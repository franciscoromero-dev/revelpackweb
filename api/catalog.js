// Endpoint público que devuelve catalog.json desde Vercel Blob.
// RevelKit llama este endpoint en lugar de ir directo a PromoOpcion.

const { list } = require('@vercel/blob');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { blobs } = await list({ prefix: 'catalog.json' });
    const entry = blobs.find(b => b.pathname === 'catalog.json');

    if (!entry) {
      return res.status(404).json({
        error: 'Catálogo no encontrado. Ejecuta /api/sync-catalog primero.',
      });
    }

    const upstream = await fetch(entry.url);
    if (!upstream.ok) throw new Error(`Blob fetch failed: HTTP ${upstream.status}`);
    const catalog = await upstream.json();

    // Cache de 1 hora en CDN; el cliente puede servir hasta 24 h stale
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json(catalog);

  } catch (err) {
    console.error('[catalog] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
};
