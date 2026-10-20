---
description: "Liquid Glass design system for refractive, accessible glass UI components"
applyTo: "**/*.css, **/*.html, **/*.tsx, **/*.jsx, **/*.vue, **/*.svelte"
---

# Liquid Glass component guidelines (v2.0.0)

When generating UI components with a glass aesthetic:

## Rules
1. Low frost: `backdrop-filter: blur(8px) saturate(180%)` with the `-webkit-` prefix; never 20px+
2. Specular light from two inset rim shadows (`var(--glass-shadow-rim)`), not a `::before` mask border
3. Real refraction: add `data-refract` and load `liquid-glass.js` (Chromium only); the component must look complete without it
4. Glass ONLY on the navigation layer (tab bars, toolbars, sidebars, docks, modals, popovers, toasts, floating buttons), never on content
5. Never stack glass on glass; controls inside glass use flat fills (`.glass-btn--plain`)
6. Include accessibility fallbacks for:
   - `prefers-reduced-transparency: reduce` (with `backdrop-filter: none !important`)
   - `prefers-reduced-motion: reduce`
   - `prefers-contrast: more`
   - `forced-colors: active`
7. Pressed controls grow (`var(--glass-press-scale)`); selections slide; `linear()` springs over 600ms
8. Min font-weight 500 on glass surfaces
9. At most 3 glass surfaces visible on a mobile viewport
10. Never use `will-change: backdrop-filter` (causes iOS crashes) or animate `backdrop-filter`
11. Never use `border-image` with `border-radius` (incompatible per spec)
12. Never use `mix-blend-mode` on text over glass

See the project's `skills/liquid-glass/snippets/tokens.css` for design tokens.
