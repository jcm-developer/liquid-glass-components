---
trigger: model-decision
description: Liquid Glass design system rules for translucent, accessible glass UI components using backdrop-filter, mask-composite borders, and CSS springs.
---

# Liquid Glass Design Rules

## When to Apply
Apply when creating navigation bars, tab bars, toolbars, modals, popovers, floating buttons, or any chrome/control layer element with translucent glass appearance.

## Core Rules
1. Glass belongs ONLY to navigation/chrome layer — never content
2. Never stack glass on glass
3. Use `backdrop-filter: blur(20px) saturate(180%)` with `-webkit-` prefix
4. Specular border via `::before` with `mask-composite: exclude`
5. Include ALL accessibility fallbacks: reduced-transparency, reduced-motion, high-contrast, forced-colors
6. Min font-weight 500, min 16px body text on glass
7. Max 1 backdrop-filter on mobile
8. CSS `linear()` springs for animation
9. `isolation: isolate`, `contain: layout paint`, `transform: translateZ(0)`
10. Never use `will-change: backdrop-filter`
