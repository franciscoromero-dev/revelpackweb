# CLAUDE.md
> Punto de entrada. Claude Code lee este archivo automáticamente al abrir la carpeta.

---

## Al iniciar sesión

1. Lee `PARTNER.md` — contexto de quién soy y cómo trabajamos
2. Lee `BRIEFING.md` — el proyecto, el cliente y el estado actual
3. Levanta el servidor en background si no está corriendo
4. Revisa la sección **Estado actual** del `BRIEFING.md` y arranca desde ahí
5. Confirma con una línea: qué proyecto es y en qué estado está

---

## Stack y servidor
<!-- Se actualiza según lo que defina el BRIEFING.md -->

**Dev server:** `npx serve . -p 3000` (default si el stack no indica otro)
**Vista local:** http://localhost:3000
**Regla:** los cambios deben verse reflejados inmediatamente. No compilar a menos que se pida explícitamente.

---

## Reglas de trabajo

- Nunca tocar archivos fuera del directorio actual
- Clases CSS en kebab-case
- Sin frameworks externos salvo los ya instalados
- Comentarios en código solo si el bloque no es autoexplicativo
- Antes de escribir código en un proyecto nuevo, verificar que `BRIEFING.md` tenga el stack definido. Si no, hacer las preguntas necesarias primero

---

## Al finalizar sesión

Actualizar en `BRIEFING.md`:
- Sección **Estado actual** — qué se hizo y cómo está el proyecto
- Sección **Decisiones tomadas** — si se tomó alguna decisión importante
- Sección **Pendientes** — qué falta
