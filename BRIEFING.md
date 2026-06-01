# BRIEFING.md
> Archivo vivo. Se llena al inicio y se enriquece durante el proyecto.
> Claude Code debe actualizarlo conforme se toman decisiones importantes.

---

## Contexto del proyecto

**Cliente:** RevelPack
**Industria:** Fabricación de packaging personalizado — industria promocional
**Objetivo principal de la página:** Landing page que genera cotizaciones. CTA principal → WhatsApp y email a ventas@revelpack.com
**Audiencia objetivo:** Agencias de marketing, productoras de eventos, empresas corporativas, distribuidoras de artículos promocionales, marcas premium
**Tono de comunicación:** Profesional, confiable, aspiracional. Premium sin ser inaccesible.
**Referencias visuales o competidores:** PakFactory (se usaban imágenes de ellos como placeholder — pendiente reemplazarlas todas)
**Deadline o urgencia:** Sin fecha definida

---

## Objetivo técnico

**¿Es una landing page estática o tiene lógica interactiva?** Estática con interacciones JS ligeras (nav, mega-menu, FAQ accordion, scroll reveal, carrusel)
**¿Necesita backend o base de datos?** No. Contacto vía WhatsApp y email directo.
**¿Hay elementos visuales complejos?** Carrusel de imágenes en página de producto (cajas-de-lujo.html)
**¿El cliente va a actualizar contenido después del deploy?** No definido
**¿Requiere formularios, pagos, login u otras funcionalidades?** No actualmente. Formulario de contacto está pendiente como mejora futura.

---

## Stack y arquitectura

**Stack elegido:** HTML5 + CSS3 + Vanilla JS (sin frameworks)
**Razón de la elección:** Máxima simplicidad, cero dependencias, deploy instantáneo en Vercel
**Dev server:** `npx serve . -p 3000`
**Comando para iniciar:** `npx serve . -p 3000`
**URL local:** http://localhost:3000

---

## Estructura de carpetas

```
revelpackweb/
├── index.html              # Landing principal
├── cajas-de-lujo.html      # Página de producto — Cajas de Lujo (con carrusel)
├── page2.html              # Página auxiliar (sin uso activo)
├── css/
│   └── styles.css          # Estilos globales con variables CSS (paleta oficial)
├── js/
│   └── main.js             # Nav hamburger, mega-menu, FAQ accordion, scroll reveal
├── images/
│   ├── Logo_Revel_Pack2.png    # Logo principal (PNG transparente)
│   ├── Logo_Revel_Pack.jpg     # Logo alternativo
│   ├── HERO.png / HERO2.png    # Imágenes hero
│   ├── Cajas_de_lujo.png       # Producto estrella
│   ├── caja_luz.png            # Cajas con luz (producto nuevo)
│   ├── cajas_rigidas.png       # Cajas rígidas
│   ├── estuche.png             # Estuches de presentación
│   ├── sticker.png             # Etiquetas y stickers
│   ├── comex.png / comex2.png  # Caso de cliente (carrusel cajas de lujo)
│   └── porche.png              # Caso de cliente (carrusel cajas de lujo)
├── vercel.json             # Config Vercel: rewrites + headers de seguridad y caché
├── robots.txt
├── package.json
└── CLAUDE.md / BRIEFING.md / PARTNER.md
```

---

## Diseño y marca

**Paleta de colores:**
- `#F36F32` — Naranja principal (primario / CTA)
- `#353334` — Carbón (fondo oscuro / texto dark)
- `#3F88C5` — Azul acento
- `#136F63` — Verde acento
- `#EBF2FA` — Gris claro / fondos

**Tipografía:**
- Display: `Playfair Display` (serif, headings)
- Body: `DM Sans` (sans-serif, texto corrido)
- Ambas desde Google Fonts

**Logo:** `images/Logo_Revel_Pack2.png` (PNG con fondo transparente — el activo)
**Estilo visual:** Premium / aspiracional con calidez. No frío ni corporativo genérico.
**Elementos visuales clave:** Cartas de producto con imagen + cuerpo, mega-menu de navegación, topbar de propuesta de valor, carrusel de imágenes en páginas de producto

---

## Deploy y repositorio

**Workflow:** Claude Code → GitHub → Vercel
**Repositorio GitHub:** franciscoromero / revelpackweb (inferido del git user)
**URL de producción en Vercel:** Pendiente confirmar
**Rama principal:** main
**Variables de entorno:** Ninguna

---

## Decisiones tomadas

- **Mayo 2025** — Stack HTML/CSS/JS vanilla sin frameworks. Razón: máxima simplicidad para un site estático de generación de leads.
- **Mayo 2025** — CTA principal vía WhatsApp (`wa.me/525555097063`) y email (`ventas@revelpack.com`). Sin formulario propio por ahora.
- **Mayo 2025** — Carrusel implementado en `cajas-de-lujo.html` con JS inline (no en main.js) para mantener la lógica autocontenida en la página de producto.
- **Mayo 2025** — Algunas imágenes del catálogo aún son de PakFactory (placeholder). Se deben reemplazar con imágenes propias.
- **Mayo 2025** — `vercel.json` configurado con headers de seguridad (X-Frame-Options, X-XSS-Protection) y cache agresivo para CSS/JS.

---

## Problemas resueltos

-

---

## Estado actual

**Última sesión:** 31 mayo 2025
**Qué se completó:** Documentación inicial del BRIEFING.md a partir del estado real del proyecto
**Cómo está el proyecto ahora:** Landing principal funcional con 8 productos en catálogo. Página de detalle `cajas-de-lujo.html` con carrusel de 3 imágenes (Cajas de Lujo, Comex, Porche). Sección ¿Por qué RevelPack? referenciada en nav pero sin sección implementada en el HTML. Testimonios y FAQ presentes.

---

## Pendientes

- [ ] Reemplazar imágenes de PakFactory con imágenes propias (Cajas Plegables, Cajas Corrugadas, Insertos)
- [ ] Implementar sección `#nosotros` / "¿Por qué RevelPack?" — está en el nav pero no existe en el HTML
- [ ] Confirmar y documentar URL de producción en Vercel
- [ ] Decidir si se agrega formulario de contacto (Formspree o similar)
- [ ] Crear páginas de detalle para otros productos (Cajas Rígidas, Cajas con Luz, etc.) — hoy solo Cajas de Lujo tiene su propia página
- [ ] Google Analytics o pixel de conversión
- [ ] Política de Privacidad (link en footer sin destino)
- [ ] Agregar imagen `comex2.png` al carrusel si aplica

---

## Notas adicionales

- El número de WhatsApp en todos los CTAs: `+52 55 5509 7063`
- Instagram: `@revel.pack`
- El `page2.html` existe en el repo pero parece un residuo — revisar si se puede eliminar
