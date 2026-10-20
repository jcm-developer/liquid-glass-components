# Components

## Purpose

The snippet contract: what every component file contains, how the shared material is built,
and the invariants that keep the components consistent and accessible. How the code is
written (docblocks, banners, naming) lives in [../code-style.md](../code-style.md).

## Key files

All under `skills/liquid-glass/snippets/`.

| File | Component |
|---|---|
| `tokens.css` | Design tokens, schemes, derived tokens, accessibility overrides |
| `glass-surface.css` | Base material (`.glass-surface`), `.glass-sheen`, clear and prominent variants |
| `liquid-glass.js` | Refraction engine and behaviours ([refraction-engine.md](refraction-engine.md)) |
| `glass-button.css` | Button: regular, prominent, icon, small, plain |
| `glass-card.css` | Floating panel |
| `glass-dock.css` | Dock with proximity magnification |
| `glass-nav-bar.css` | Screen navigation bar with glass groups, collapsing title and scroll edge |
| `glass-modal.css` | Modal and bottom sheet on `<dialog>` |
| `glass-popover.css` | Contextual menu |
| `glass-search.css` | Search pill that widens on focus |
| `glass-segmented.css` | Segmented control with sliding indicator |
| `glass-sidebar.css` | Navigation sidebar with sliding indicator |
| `glass-slider.css` | Range slider with lens thumb |
| `glass-tab-bar.css` | Tab bar with sliding indicator |
| `glass-toast.css` | Notification |
| `glass-toggle.css` | Switch with lens thumb |
| `glass-toolbar.css` | Tool pill and fixed website header |

## Anatomy of a snippet

1. **File docblock** with the usage markup. The markup is the public API: the landing and the
   README copy it verbatim.
2. **Base.** The root element carries the material block, in this order:

   ```css
   position: relative;
   isolation: isolate;
   background: var(--glass-bg);
   -webkit-backdrop-filter: blur(var(--glass-blur-fallback)) saturate(var(--glass-saturation));
   backdrop-filter: blur(var(--glass-blur-fallback)) saturate(var(--glass-saturation));
   box-shadow: var(--glass-shadow-rim), var(--glass-shadow);
   outline: 1px solid transparent;
   outline-offset: -1px;
   color: var(--glass-text-primary);
   text-shadow: var(--glass-text-shadow);
   ```

   Then the elements, states (hover, active, focus-visible, disabled) and selection.

   Exception: in `glass-nav-bar.css` the root bar is clear and each `.glass-nav-bar__group`
   carries the material block, so the groups are what the `:where()` list names.
3. **Variants**, if any, written as token overrides (`--glass-tint`, `--glass-tint-rgb`)
   rather than new declarations.
4. **Accessibility**, all four, in this order:
   - `prefers-reduced-transparency: reduce`: `--glass-solid-bg` background, solid text,
     `backdrop-filter: none !important`.
   - `prefers-contrast: more`: solid background, `outline: 2px solid currentColor`, no shadow.
   - `prefers-reduced-motion: reduce`: transitions and animations off.
   - `forced-colors: active`: system colours, no backdrop filter, visible outline.

## The material

Three layers, all driven by tokens (`tokens.css`, Primitives):

- **Refraction** (`--glass-refraction`, `--glass-bezel`, `--glass-chroma`): added by the engine
  on `[data-refract]` elements. Never required for the component to look right.
- **Frost**: `--glass-blur-fallback` (8px) in CSS; the engine swaps in `--glass-blur` (2px)
  inside its filter when refraction runs, because refraction already separates the surface
  from the backdrop.
- **Light**: `--glass-tint` fill plus `--glass-shadow-rim`, two inset highlights (top-left
  strong, bottom-right softer) and a faint inner glow. `.glass-sheen` adds a highlight that
  follows the pointer.

Selection inside a glass surface uses `--glass-fill`; separators use `--glass-separator`.

## Interaction

- **Press grows.** Pressed controls scale to `--glass-press-scale` (1.08) and light up from the
  press point; nothing shrinks on press.
- **Lens thumbs.** The toggle and slider thumbs turn into a clear lens while held, in pure
  CSS (`:active`).
- **Sliding indicator.** Tab bars, segmented controls and sidebars get a `.glass-indicator`
  from the engine that springs and stretches between items. Without the engine the selected
  item keeps a static `--glass-fill` background (`:not(.is-enhanced)` rules).
- Springs use `--glass-easing-spring` over `--glass-duration-spring` (600ms); shorter
  durations cut the overshoot off.

## Invariants

- No glass on glass: buttons inside a glass panel are `.glass-btn--plain`; toolbar buttons
  and menu items are flat.
- Touch targets are at least `--glass-target` (44px), except inline items inside a larger
  control.
- Selection lives in ARIA (`aria-selected`, `aria-checked`, `aria-current`).
- Every component that uses derived tokens is listed in the `:where()` block of `tokens.css`.

## Gotchas

- **Derived tokens resolve where they are declared.** `--glass-bg` and `--glass-shadow-rim`
  are recomputed on each component through the `:where()` list. A new component missing from
  that list inherits the values computed on `:root` and ignores local overrides such as
  `style="--glass-tint: .2"`. `check-docs.mjs` enforces the list.
- **Backdrop roots.** `backdrop-filter` cannot see past an ancestor with `opacity` below 1,
  `filter`, `mask`, `clip-path`, `mix-blend-mode` or its own `backdrop-filter`. A glass element
  inside a fading or masked container only refracts that container's content.
- **`<dialog>` display.** `.glass-modal` sets `display: flex` only on `[open]`; setting it on
  the closed dialog would show it.
- **Navigation bar scroll container.** The engine watches the nearest ancestor whose
  `overflow-y` is `auto` or `scroll`, else the window, and looks for
  `.glass-nav-bar__large-title` inside it. A bar inside a custom scroller that is not its
  ancestor never updates. The scroll edge is a fade, not glass ([../decisions.md](../decisions.md), D11).
- **Popover anchor.** `.glass-popover` is absolutely positioned; its anchor must be
  `.glass-popover-anchor` (or any positioned ancestor).

## Related

- [refraction-engine.md](refraction-engine.md): the JavaScript side.
- [skill-distribution.md](skill-distribution.md): how these rules reach end users' agents.
