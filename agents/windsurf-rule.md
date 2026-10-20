---
trigger: model-decision
description: Liquid Glass design system rules for refractive, accessible glass UI components with low frost, specular rims and CSS springs.
---

# Liquid Glass design rules (v2.0.0)

## When to apply
Apply when creating navigation bars, tab bars, toolbars, sidebars, docks, modals, popovers,
toasts, floating buttons, switches, sliders or any chrome/control element with a glass look.

## Core rules
1. Glass belongs ONLY to the navigation/chrome layer, never content
2. Never stack glass on glass; controls inside glass use flat fills
3. Low frost: `blur(8px) saturate(180%)` with the `-webkit-` prefix (2px when refraction runs); never 20px+
4. Specular light from two inset rims (`--glass-shadow-rim`), not a `::before` mask border
5. Real refraction via `data-refract` + `liquid-glass.js` (Chromium only); components must work without it
6. Include ALL fallbacks: reduced transparency, increased contrast, reduced motion, forced colours, with `backdrop-filter: none !important`
7. Pressed controls grow; selections slide; `linear()` springs over 600ms
8. Weight 500+, 16px body text on glass
9. At most 3 glass surfaces visible on mobile
10. Never use `will-change: backdrop-filter` or animate `backdrop-filter`
