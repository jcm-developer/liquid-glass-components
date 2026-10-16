---
description: "Liquid Glass design system for translucent, accessible glass UI components"
applyTo: "**/*.css, **/*.html, **/*.tsx, **/*.jsx, **/*.vue, **/*.svelte"
---

# Liquid Glass Component Guidelines

When generating UI components with a glass/translucent aesthetic:

## Rules
1. Use `backdrop-filter: blur(20px) saturate(180%)` with `-webkit-` prefix
2. Apply specular border via `::before` pseudo-element with `mask-composite: exclude`
3. Glass ONLY on navigation layer (tab bars, toolbars, modals, FABs) — never on content
4. Never stack glass on glass
5. Include accessibility fallbacks for:
   - `prefers-reduced-transparency: reduce`
   - `prefers-reduced-motion: reduce`
   - `prefers-contrast: more`
   - `forced-colors: active`
6. Min font-weight 500 on glass surfaces
7. Max 1 backdrop-filter layer on mobile viewport
8. Use CSS `linear()` spring easing for animations
9. Add `isolation: isolate` and `contain: layout paint`
10. Never use `will-change: backdrop-filter` (causes iOS crashes)
11. Never use `border-image` with `border-radius` (incompatible per spec)
12. Never use `mix-blend-mode` on text over glass

See project's `skills/liquid-glass/snippets/tokens.css` for design tokens.
