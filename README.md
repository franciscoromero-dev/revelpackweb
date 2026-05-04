# RevelPack — Sitio Web Oficial

Sitio web para RevelPack, fabricante de cajas y estuches personalizados para la industria promocional.

## Estructura del repositorio

```
revelpack/
├── index.html          # Página principal
├── css/
│   └── styles.css      # Estilos globales
├── js/
│   └── main.js         # Interacciones (nav, FAQ, scroll reveal)
├── images/             # Imágenes locales (próximamente)
└── README.md
```

## Deploy en Vercel

### Opción 1 — Desde GitHub (recomendado)

1. Sube esta carpeta a un repositorio en GitHub
2. Ve a [vercel.com](https://vercel.com) e inicia sesión
3. Click en **"New Project"** → importa el repo de GitHub
4. Deja toda la configuración por defecto (es HTML estático)
5. Click **Deploy** — listo en ~30 segundos ✅

### Opción 2 — Vercel CLI

```bash
npm i -g vercel
cd revelpack
vercel
```

## Deploy en GitHub Pages

1. Sube a GitHub
2. Ve a Settings → Pages
3. Source: **Deploy from a branch** → `main` → `/ (root)`
4. Guarda — disponible en `https://tuusuario.github.io/revelpack`

## Próximos pasos

- [ ] Reemplazar imágenes de PakFactory por imágenes propias de RevelPack
- [ ] Actualizar textos de hero, productos y testimonios con contenido real
- [ ] Agregar logo oficial de RevelPack
- [ ] Configurar dominio personalizado en Vercel
- [ ] Ajustes de SEO (meta tags, sitemap, robots.txt)
- [ ] Integrar formulario de contacto (Formspree o similar)
- [ ] Google Analytics / pixel de conversión

## Tecnologías

- HTML5 semántico
- CSS3 (variables, grid, flexbox, animaciones)
- Vanilla JS (sin dependencias)
- Fuentes: Syne + DM Sans (Google Fonts)

## Contacto

Para cambios o ajustes al sitio, contactar al equipo de desarrollo.
