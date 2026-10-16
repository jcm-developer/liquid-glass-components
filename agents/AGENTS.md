# Liquid Glass Components — Agent Instructions

This project provides a design system and component library implementing Apple's "Liquid Glass" visual language for the web.

## Key Rules

1. **Layer Separation:** Glass effects belong ONLY to the navigation/chrome layer (tab bars, toolbars, sidebars, modals, popovers, FABs). NEVER apply glass to content elements (articles, feeds, table cells).

2. **No Glass-on-Glass:** Never stack glass elements. Use flat semi-transparent fills for subdivisions.

3. **Accessibility Required:** Every glass component MUST include:
   - `prefers-reduced-transparency: reduce` → solid opaque background
   - `prefers-reduced-motion: reduce` → no transitions/animations
   - `prefers-contrast: more` → high contrast borders, no shadows
   - `forced-colors: active` → system colors (Canvas, CanvasText, ButtonFace)

4. **Performance:** Max 1 `backdrop-filter` layer visible on mobile. Use `isolation: isolate`, `contain: layout paint`, `transform: translateZ(0)`. Never use `will-change: backdrop-filter`.

5. **Typography:** Min font-weight 500 on glass. Min 16px body, 14px metadata. Never use mix-blend-mode on text.

6. **Browser Compatibility:** Always include `-webkit-backdrop-filter` alongside `backdrop-filter`.

## Design Tokens

See `skills/liquid-glass/snippets/tokens.css` for the complete CSS custom properties system.

## Component Snippets

See `skills/liquid-glass/snippets/` for production-ready CSS for all components.

## Build & Test

No build step required. Components are pure CSS.
