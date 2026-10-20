# Liquid Glass Components: agent instructions

This project uses Liquid Glass Components (v2.1.0), a design system that implements Apple's
Liquid Glass material on the web. Full rules: `.agents/skills/liquid-glass/SKILL.md`.

## Key rules

1. **Layer separation.** Glass belongs ONLY to the navigation/chrome layer (tab bars,
   toolbars, sidebars, docks, modals, popovers, toasts, floating buttons). NEVER on content
   (articles, feeds, table cells).
2. **No glass on glass.** Controls inside a glass surface use flat fills
   (`.glass-btn--plain`, `var(--glass-fill)`).
3. **The material:** low frost (2px with refraction, 8px without), a faint tint, two specular
   rims (`--glass-shadow-rim`). Never a heavy blur of 20px or more.
4. **Refraction is an enhancement.** Add `data-refract` and load `liquid-glass.js`; it only
   renders in Chromium on desktop. Components must look complete without it.
5. **Accessibility required** in every component:
   - `prefers-reduced-transparency: reduce`: solid background, `backdrop-filter: none !important`
   - `prefers-contrast: more`: solid background, 2px outline, no shadows
   - `prefers-reduced-motion: reduce`: no transitions or animations
   - `forced-colors: active`: system colours (Canvas, CanvasText, ButtonFace)
6. **Interaction:** pressed controls grow (`--glass-press-scale`); selections slide; springs
   use `--glass-easing-spring` over 600ms.
7. **Performance:** at most 3 glass surfaces visible at once on mobile. Never
   `will-change: backdrop-filter`; never animate `backdrop-filter`.
8. **Typography:** weight 500 or more on glass; 16px body, 14px metadata; no
   `mix-blend-mode` on text.
9. Always pair `-webkit-backdrop-filter` with `backdrop-filter`.

## Design tokens

`snippets/tokens.css` holds every `--glass-*` custom property, the schemes
(`data-glass-scheme="dark|light"`) and the accessibility overrides.

## Component snippets

`snippets/` holds one CSS file per component, with its usage markup in the top docblock, plus
`glass-surface.css` for custom glass elements and `liquid-glass.js` for refraction and
behaviours.

## Build and test

No build step. Components are plain CSS and one optional vanilla JS file.
