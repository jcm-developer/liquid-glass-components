# Refraction engine

## Purpose

`skills/liquid-glass/snippets/liquid-glass.js` gives glass elements real refraction and adds
the behaviours CSS cannot do alone: sliding selection indicators, switch toggling, slider
fill, dock magnification, the navigation bar's scroll edge and collapsing title, and the
pointer sheen. It is optional; every snippet works without
it.

## Key files

- `liquid-glass.js`: the whole engine, a classic script exposing `window.LiquidGlass`.
- `tokens.css`: `--glass-refraction`, `--glass-bezel`, `--glass-blur`, `--glass-chroma`,
  `--glass-saturation`, read by the engine.
- `site/index.html`: the biggest consumer (hero toggle and strength slider, playground).

## Flow

1. **Gate.** `canRefract` allows refraction only in Chromium (`navigator.userAgentData`
   brands), on a fine pointer, and without reduced transparency, increased contrast or forced
   colours. `<html data-glass-refract="off|always">` overrides it. The result is mirrored as
   the `glass-refraction` class on `<html>`.
2. **Attach.** `init` scans for `[data-refract]` and calls `refract`, which creates one SVG
   `<filter>` per element inside a shared hidden `<defs>` and starts observing its size.
3. **Build.** On the first resize callback, `apply` reads the options (`readOptions`: data
   attributes, then CSS tokens, then `update` overrides), builds the displacement map for the
   element's size and corner radius (`displacementMap`) and sets
   `backdrop-filter: url(#glass-refract-N)` inline.
4. **Filter graph.** The backdrop is blurred by `--glass-blur`, displaced three times with
   scales `1`, `1 - 0.07 * chroma` and `1 - 0.14 * chroma`, each pass keeping one colour
   channel, recombined with `screen`, then saturated. The channel split is the chromatic
   fringe.
5. **Map.** Inside the bezel, each pixel samples the backdrop further inward along the edge
   normal with magnitude `t * t` (`t` is 1 at the edge, 0 at the inner bezel edge). Outside
   the bezel the map is neutral, so the centre of the surface is undistorted.
6. **Live changes.** `update` rewrites filter attributes for strength, blur and chroma, and
   rebuilds the map only for a bezel change. `refresh` re-reads CSS tokens after a custom
   property change. A preference change calls `reevaluate`, which applies or removes every
   filter.

Behaviours (`initIndicator`, `initToggle`, `initSlider`, `initDock`, `initNavBar`,
`bindPointer`) are wired
by the same `init`, are idempotent, and announce changes with a bubbling `glass:change` event.
`initNavBar` marks the bar `is-enhanced`, then on each scroll frame sets `is-scrolled` (any
scroll) and `is-collapsed` (the large title has passed under the bar) on it; it fires no event.

## Public API

`LiquidGlass.init(root?)`, `select(container, itemOrIndex)`, `refract(el, overrides?)`,
`update(el, overrides)`, `refresh(el?)`, `enable(el, on)`, `detach(el)`, `reevaluate()`,
`supported` (getter) and `version`. Each is documented by its docblock in `liquid-glass.js`.

## Invariants

- The engine only ever adds an inline `backdrop-filter`; removing it (`clearStyle`) must
  always leave a correct CSS fallback behind.
- Every blocking preference removes refraction, including changes after load.
- A map is never rebuilt on every frame: during a resize the old map is stretched and the
  exact one is rebuilt 140ms after the size settles (`onResize`).
- The map cache holds at most `MAP_CACHE_SIZE` entries (least recently used).

## Gotchas

- **Inline style beats the fallbacks.** The filter is set inline, so a stylesheet rule without
  `!important` cannot remove it. That is why the engine itself must stand down under every
  blocking preference, and why the snippets' accessibility blocks use `!important`.
- **Size zero.** Hidden elements (`display: none`, a closed `<dialog>`) measure zero and are
  skipped; the resize observer applies them when they appear.
- **Percentage radii.** `border-radius: 50%` is resolved against the shorter side
  (`radiusOf`).
- **Backdrop roots** limit what the filter can see; see
  [components.md](components.md#gotchas).
- **Touch devices** skip refraction by default for battery; `data-glass-refract="always"`
  opts in.

## Related

- [components.md](components.md): the CSS side and the fallback contract.
- [../decisions.md](../decisions.md): D3 and D9.
