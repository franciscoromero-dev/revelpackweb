// Cron job diario: pagina el catálogo de PromoOpcion, filtra las 10 categorías
// permitidas, normaliza y guarda catalog.json en Vercel Blob.
//
// ⚠️  TIEMPO DE EJECUCIÓN: 20 páginas × 40 s de delay = ~820 s mínimo.
//     Requiere Vercel Enterprise (maxDuration: 900) y que las llamadas a la API
//     sean rápidas. Si el plan es Pro (límite 300 s), reduce PAGES o DELAY_MS.

const { put } = require('@vercel/blob');

const GQL   = 'https://www.promocionalesenlinea.net/graphql';
const PAGES = 20;
const DELAY_MS = 40_000;

const ALLOWED_FAMILIES = {
  'BEBIDAS':              'bebidas',
  'ESCRITURA':            'escritura',
  'TECNOLOGIA':           'tecnologia',
  'LIBRETAS_Y_CARPETAS':  'libretas_carpetas',
  'ARTICULOS_PARA_VIAJE': 'viaje',
  'OFICINA':              'oficina',
  'BELLEZA':              'belleza',
  'ANTIESTRES':           'antiestres',
  'LLAVEROS':             'llaveros',
  'SALUD':                'salud',
};

// ── GraphQL client ────────────────────────────────────────────────────────────

async function gqlRequest(query, variables, token) {
  const ctrl = new AbortController();
  const tid  = setTimeout(() => ctrl.abort(), 15000);
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(GQL, {
      method:  'POST',
      headers,
      body:    JSON.stringify({ query, variables: variables || {} }),
      signal:  ctrl.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (json.errors?.length) throw new Error(json.errors[0].message);
    return json.data;
  } finally {
    clearTimeout(tid);
  }
}

// ── Auth ──────────────────────────────────────────────────────────────────────

async function login() {
  // PROMOOP_TOKEN permite saltarse el mutation cuando el token ya está fresco
  if (process.env.PROMOOP_TOKEN) return process.env.PROMOOP_TOKEN;
  const data = await gqlRequest(`
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) { accessToken }
    }
  `, {
    email:    process.env.PROMOOP_EMAIL,
    password: process.env.PROMOOP_PASSWORD,
  });
  return data.login.accessToken;
}

// ── Fetch de una página ───────────────────────────────────────────────────────

async function fetchPage(page, token) {
  const data = await gqlRequest(`
    query Catalog($page: Int!) {
      distribuitorProductCatalog(page: $page) {
        hasNextPage
        totalPages
        data {
          productModel {
            sku
            nameProductModel
            brand
            isEnabledProductModelMx
            media { mainImages }
            features { measure }
            package {
              dimensions {
                heightInCentimeters
                lengthInCentimeters
                widthInCentimeters
              }
            }
            filters { familyFilterable }
          }
          variants {
            color
            availability { isEnabledVariantMx }
            pricing { priceMx { amount } }
          }
        }
      }
    }
  `, { page }, token);

  const catalog = data.distribuitorProductCatalog || {};
  return {
    items:       catalog.data        || [],
    hasNextPage: catalog.hasNextPage || false,
    totalPages:  catalog.totalPages  || 0,
  };
}

// ── Normalización (lógica idéntica a revelkit/js/api.js) ──────────────────────

function resolveFamily(rawFamily) {
  const raw = Array.isArray(rawFamily) ? rawFamily[0] : rawFamily;
  const key = String(raw || '').trim()
    .toUpperCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '');
  return ALLOWED_FAMILIES[key] ?? null;
}

function parseMeasure(str) {
  if (!str) return null;
  let best = null;
  for (const seg of str.split('/')) {
    const m3 = seg.match(/(\d+\.?\d*)\s*[xX×]\s*(\d+\.?\d*)\s*[xX×]\s*(\d+\.?\d*)/);
    if (m3) {
      const dims = [parseFloat(m3[1]), parseFloat(m3[2]), parseFloat(m3[3])].sort((a, b) => b - a);
      if (!best || dims[0] > best[0]) best = dims;
      continue;
    }
    const m2 = seg.match(/(\d+\.?\d*)\s*[xX×]\s*(\d+\.?\d*)/);
    if (m2) {
      const a = parseFloat(m2[1]), b = parseFloat(m2[2]);
      const dims = [Math.max(a, b), Math.min(a, b), Math.min(a, b)].sort((a, b) => b - a);
      if (!best || dims[0] > best[0]) best = dims;
      continue;
    }
    const m1 = seg.match(/(\d+\.?\d*)\s*cm/i);
    if (m1) {
      const v = parseFloat(m1[1]);
      if (!best || v > best[0]) best = [v, v, v];
    }
  }
  return best;
}

function parseImages(raw, sku) {
  const placeholder = `https://placehold.co/400x400/6B7280/FFFFFF?text=${encodeURIComponent((sku || 'SKU').slice(0, 8))}`;
  if (!raw) return [placeholder];
  if (Array.isArray(raw)) return raw.filter(Boolean).length ? raw.filter(Boolean) : [placeholder];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed.filter(Boolean);
  } catch (_) {}
  const urls = raw.split(',').map(s => s.trim()).filter(Boolean);
  return urls.length ? urls : [placeholder];
}

function mapItem(item) {
  const m  = item.productModel || {};
  const vs = item.variants     || [];

  const enabled = vs.filter(v => v.availability?.isEnabledVariantMx !== false);
  const pool    = enabled.length ? enabled : vs;

  const colors = [...new Set(pool.map(v => v.color).filter(Boolean))];
  if (!colors.length) colors.push('Único');

  const rawPrice = parseFloat(pool[0]?.pricing?.priceMx?.[0]?.amount ?? 0);
  const fam      = resolveFamily(m.filters?.familyFilterable);
  if (fam === null) return null;

  const measure = parseMeasure(m.features?.measure);
  const pkgDims = m.package?.dimensions || {};

  const dimL = measure ? measure[0] : parseFloat(pkgDims.lengthInCentimeters) || 10;
  const dimW = measure ? measure[1] : parseFloat(pkgDims.widthInCentimeters)  || 10;
  const dimH = measure ? measure[2] : parseFloat(pkgDims.heightInCentimeters) || 10;

  return {
    sku:                 m.sku,
    name:                m.nameProductModel || m.sku,
    brand:               m.brand || '',
    family:              fam,
    heightInCentimeters: dimH,
    lengthInCentimeters: dimL,
    widthInCentimeters:  dimW,
    price:               Math.round(rawPrice),
    images:              parseImages(m.media?.mainImages, m.sku),
    colors,
    stock:               enabled.length > 0 ? 100 : 0,
  };
}

function normalize(items) {
  return items
    .filter(i => i.productModel?.isEnabledProductModelMx !== false)
    .map(mapItem)
    .filter(p => p !== null && p.price > 0 && p.sku);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── Handler ───────────────────────────────────────────────────────────────────

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('[sync-catalog] Iniciando —', new Date().toISOString());

  try {
    const token   = await login();
    const all     = [];
    let totalPages = PAGES;

    for (let page = 1; page <= PAGES; page++) {
      const { items, hasNextPage, totalPages: tp } = await fetchPage(page, token);
      if (page === 1) totalPages = tp || PAGES;

      const batch = normalize(items);
      all.push(...batch);
      console.log(`[sync-catalog] Página ${page}/${totalPages} — ${batch.length} productos (acum: ${all.length})`);

      if (!hasNextPage || page === PAGES) break;
      console.log(`[sync-catalog] Rate-limit delay ${DELAY_MS / 1000}s…`);
      await sleep(DELAY_MS);
    }

    const payload = JSON.stringify({
      updatedAt: new Date().toISOString(),
      total:     all.length,
      products:  all,
    });

    const blob = await put('catalog.json', payload, {
      access:          'public',
      contentType:     'application/json',
      addRandomSuffix: false,   // URL estable: siempre /catalog.json
    });

    console.log(`[sync-catalog] Guardado → ${blob.url} (${all.length} productos)`);
    return res.status(200).json({ ok: true, total: all.length, url: blob.url });

  } catch (err) {
    console.error('[sync-catalog] Error fatal:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
