---
name: liquid-glass
description: >-
  Generate web UI components with Apple's Liquid Glass aesthetic using
  modern CSS (backdrop-filter, mask-composite, CSS springs). Use this
  skill when creating or restyling navigation bars, tab bars, toolbars,
  modals, popovers, floating action buttons, cards, or any chrome/control
  layer element with a translucent glass appearance. Do NOT use for
  content-layer elements like article cards, table cells, or feeds.
  Always enforce WCAG AA contrast, prefers-reduced-transparency fallback,
  and prefers-reduced-motion suppression.
license: MIT
metadata:
  version: "1.0.0"
  author: "jcm-developer"
  repo: "https://github.com/jcm-developer/liquid-glass-components"
---

# Liquid Glass — Web Design Skill

Generate accessible, performant web components with Apple's Liquid Glass
visual language using CSS, SVG, and vanilla JS only.

## Quick Start

1. Import tokens: `@import url('./tokens.css');` or copy the `:root` block from `snippets/tokens.css`
2. Apply the `.glass-surface` base class to your element
3. Add the `::before` specular border pseudo-element
4. Include ALL accessibility fallbacks (reduced transparency, motion, contrast, forced-colors)

## Core Principles

1. **Layer Separation:** Glass belongs ONLY to the navigation/chrome layer (tab bars, toolbars, sidebars, popovers, sheets, modals, FABs). NEVER apply glass to content (articles, feeds, table cells, list items).
2. **No Glass-on-Glass:** NEVER stack glass elements on top of each other. Use flat semi-transparent fills for subdivisions within a glass container.
3. **Concentric Radii:** Inner border-radius = Outer border-radius − Padding between them.
4. **Accessibility First:** Every glass component MUST include fallbacks for `prefers-reduced-transparency`, `prefers-reduced-motion`, `prefers-contrast: more`, and `forced-colors: active`.
5. **Performance Budget:** Maximum 1 active `backdrop-filter` layer visible simultaneously on mobile viewport.

## Design Tokens

Read `snippets/tokens.css` for the complete `:root` block with dark mode and accessibility overrides. Key tokens:

| Token | Default | Purpose |
|-------|---------|--------|
| `--glass-blur` | `20px` | Gaussian blur radius |
| `--glass-bg` | `rgba(255,255,255,0.12)` | Surface background |
| `--glass-saturation` | `180%` | Backdrop saturation boost |
| `--glass-border` | `rgba(255,255,255,0.25)` | Border color |
| `--glass-border-radius-lg` | `24px` | Large radius |
| `--glass-shadow` | Multi-layer | Ambient occlusion |
| `--glass-shadow-inset` | Multi-layer | Inner bevel |
| `--glass-easing-spring` | `linear(...)` | Spring physics curve |

## Base Glass Surface

Every glass component starts with this foundation:

```css
.glass-surface {
  position: relative;
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation)) contrast(var(--glass-contrast));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation)) contrast(var(--glass-contrast));
  box-shadow: var(--glass-shadow), var(--glass-shadow-inset);
  border: var(--glass-border-width) solid transparent;
  border-radius: var(--glass-border-radius-lg);
  color: var(--glass-text-primary);
  font-family: var(--glass-font-sans);
  font-weight: var(--glass-font-weight-body);
  isolation: isolate;
  contain: layout paint;
  transform: translateZ(0);
}
```

## Specular Border

Add to ALL glass components via `::before`:

```css
.glass-surface::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: var(--glass-border-width);
  background: linear-gradient(
    135deg,
    var(--glass-border-top) 0%,
    rgba(255, 255, 255, 0.15) 40%,
    transparent 60%,
    var(--glass-border-bottom) 100%
  );
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  pointer-events: none;
}
```

DO NOT use `border-image` with `border-radius` — the spec makes them incompatible (corners become square).

## Mandatory Accessibility Fallbacks

Include ALL of these in every component:

```css
/* Reduced transparency */
@media (prefers-reduced-transparency: reduce) {
  .glass-surface {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    background: var(--glass-solid-bg);
    border-color: var(--glass-solid-border);
  }
  .glass-surface::before { display: none; }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .glass-surface {
    transition: none !important;
    animation: none !important;
  }
}

/* High contrast */
@media (prefers-contrast: more) {
  .glass-surface {
    background: var(--glass-bg);
    border: var(--glass-border-width) solid var(--glass-border);
    box-shadow: none;
  }
  .glass-surface::before { display: none; }
}

/* Forced colors (Windows High Contrast) */
@media (forced-colors: active) {
  .glass-surface {
    background: Canvas;
    border: 2px solid CanvasText;
    color: CanvasText;
    backdrop-filter: none;
    box-shadow: none;
  }
  .glass-surface::before { display: none; }
}
```

## Variants

### Regular (default)
Dense blur, high readability. Use for bars, sidebars, modals, popovers.

### Clear
Ultra-translucent, minimal diffusion. For controls over rich media (photos, video, maps).
**CRITICAL:** MUST add dimming layer of `rgba(0, 0, 0, 0.35)` behind the control on bright backgrounds (Apple's 35% rule).

```css
.glass-surface--clear {
  --glass-blur: 8px;
  --glass-bg: rgba(255, 255, 255, 0.06);
  --glass-saturation: 130%;
}
.glass-surface--clear.needs-dimming::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  border-radius: inherit;
  z-index: -1;
}
```

### Prominent
Accent-tinted for primary CTAs.

```css
.glass-surface--prominent {
  --glass-bg: rgba(59, 130, 246, 0.35);
  --glass-blur: 24px;
}
```

## Typography on Glass

- Minimum font size: **16px** for body text, **14px** for metadata
- Minimum font weight: **500** (Medium). NEVER use ≤ 300 (thin strokes blur into the backdrop)
- Add `text-shadow: var(--glass-text-shadow)` for text on dark glass
- NEVER use `mix-blend-mode` on text — collapses to 1:1 ratio on mid-gray backgrounds
- Increase letter-spacing slightly (`+0.015em`) for better glyph discrimination

## Focus Indicators

Use dual-ring pattern (black outer + white inner) for visibility on any background:

```css
.glass-interactive:focus-visible {
  outline: 2px solid #000000;
  outline-offset: 3px;
  box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #000000;
}

@media (forced-colors: active) {
  .glass-interactive:focus-visible {
    outline: 3px solid Highlight;
    box-shadow: none;
  }
}
```

## Performance Rules

1. Max **1 backdrop-filter layer** visible simultaneously on mobile
2. Reduce blur to **8–12px** on touch devices
3. NEVER use `will-change: backdrop-filter` — causes iOS OOM crashes
4. Use `isolation: isolate` and `contain: layout paint` on every glass element
5. Add `transform: translateZ(0)` to force hardware compositing layer
6. `backdrop-filter` creates a containing block for `position: fixed` children — use DOM portals for tooltips/dropdowns inside glass containers
7. Do NOT animate `backdrop-filter` directly — animate opacity or swap classes instead

## Animation

Use native CSS spring physics via `linear()` (Baseline Available: Chrome 113+, Safari 17.2+, Firefox 112+):

```css
.glass-spring {
  transition: transform 0.5s var(--glass-easing-spring);
}
.glass-spring:active {
  transform: scale(0.96);
}
```

For morphing between states (pill → expanded panel), use View Transitions API with fallback:

```javascript
function morphGlass() {
  if (!document.startViewTransition) {
    toggleState();
    return;
  }
  document.startViewTransition(() => toggleState());
}
```

## Component Snippets

See `snippets/` directory for production-ready CSS:

| File | Component |
|------|-----------|
| `tokens.css` | Complete `:root` design tokens with dark mode & a11y |
| `glass-card.css` | Card / Panel |
| `glass-button.css` | Pill button, icon button, prominent button |
| `glass-tab-bar.css` | Bottom/top tab bar with active indicator |
| `glass-toolbar.css` | Floating toolbar / navbar |
| `glass-modal.css` | Bottom sheet / centered modal |
| `glass-segmented.css` | Segmented control |
| `glass-toggle.css` | Switch with glass thumb |
| `glass-slider.css` | Range slider with glass track and thumb |
| `glass-popover.css` | Contextual action menu / popover |
| `glass-dock.css` | macOS/iPadOS dock with magnification |
| `glass-sidebar.css` | Navigation sidebar with section links |
| `glass-search.css` | Expandable search pill |
| `glass-toast.css` | Floating notification |

Each snippet includes: HTML structure, full CSS with tokens, hover/active/focus-visible/disabled states, and all accessibility fallbacks.

## DO / DON'T Quick Reference

### ✅ DO
- Reserve glass for navigation/chrome layer only
- Include `prefers-reduced-transparency`, `prefers-reduced-motion`, `forced-colors` fallbacks
- Use `-webkit-backdrop-filter` alongside `backdrop-filter`
- Apply concentric radii (inner = outer − padding)
- Use font-weight ≥ 500 on glass
- Limit to 1 backdrop-filter layer on mobile
- Use `border: 1px solid transparent` (becomes visible in forced-colors)
- Use dual-ring focus indicators (black + white)

### ❌ DON'T
- Don't apply glass to content (articles, feeds, table cells)
- Don't stack glass on glass
- Don't mix regular and clear variants in one control group
- Don't use `will-change: backdrop-filter` (iOS OOM crashes)
- Don't use `border-image` with `border-radius`
- Don't use `mix-blend-mode` on text
- Don't use WebGL for UI components
- Don't use `backdrop-filter: url(#svg-filter)` (Safari/Firefox ignore it)
- Don't animate `backdrop-filter` directly
- Don't use font-weight ≤ 300 on glass
- Don't redistribute SF Pro or SF Symbols
