# Decisions

Why Liquid Glass Components is built the way it is. One entry per structural decision, newest
last. Append an entry when you make or reverse one; never rewrite an old entry, mark it
superseded instead.

Template:

```
## D<n>. <Title> (<YYYY-MM-DD or "historical">)
Status: accepted | superseded by D<m>
Context: what forced the choice.
Decision: what was chosen.
Consequences: what it costs, what it rules out.
```

## D1. Plain CSS and vanilla JavaScript, no build step (historical)
Status: accepted
Context: the components are meant to be copied into any stack (React, Vue, Svelte, plain
HTML) and read by AI agents as reference material.
Decision: one CSS file per component, one dependency-free JavaScript file, no compiler, no
bundler, no package manager.
Consequences: no Sass mixins or shared partials, so each snippet repeats the material block;
that duplication is the price of copy-paste independence. No npm package exists yet.

## D2. Glass only on the chrome layer (historical)
Status: accepted
Context: Apple's guidance reserves Liquid Glass for navigation and controls that float above
content; glass on content hurts legibility and performance.
Decision: components cover bars, controls and overlays only. Glass is never stacked on glass;
controls inside a glass surface use flat fills (`.glass-btn--plain`, `--glass-fill`).
Consequences: no "glass list item" or "glass table" components.

## D3. Real refraction as a progressive enhancement (2026-10-21)
Status: accepted
Context: v1 imitated Liquid Glass with a 20px blur and a `mask-composite` border, which reads
as frosted glass (iOS 7), not as Liquid Glass. The defining trait is refraction at the bezel.
Decision: `liquid-glass.js` builds a per-element SVG displacement map and applies it through
`backdrop-filter: url()`. It runs only in Chromium, on fine pointers, without reduced
transparency, increased contrast or forced colours. Every other case keeps the CSS blur.
Consequences: Safari and Firefox users see the fallback; components must look complete
without the engine. Reverses the v1 rule "never use `backdrop-filter: url()`".

## D4. Low frost, dual specular rims, growing press (2026-10-21)
Status: accepted
Context: Liquid Glass keeps the backdrop legible, catches light on both sides of the bezel
and makes controls swell under the finger.
Decision: frost drops to 2px with refraction (8px without), the `::before` mask border is
replaced by two inset rim shadows, and pressed controls scale up (`--glass-press-scale`)
instead of down.
Consequences: snippets are visually different from v1 even where class names did not change;
the version moved to 2.0.0.

## D5. Glass scheme follows the backdrop, not only the page theme (2026-10-21)
Status: accepted
Context: white text on glass works over photos and dark wallpapers but fails over light
content, independently of the page's own theme.
Decision: the default scheme suits dark or colourful backdrops; `prefers-color-scheme: light`
switches to a light scheme, and any container can pin one with `data-glass-scheme`.
Consequences: derived tokens are recomputed per element through the `:where()` list in
`tokens.css`, which must list every component.

## D6. Keep v1 class names and token aliases (2026-10-21)
Status: accepted
Decision: v2 keeps every v1 class and modifier, reads v1 `--active` classes for selection,
and aliases the old `--glass-border-radius-*` and `--glass-duration-morph` tokens.
Consequences: the aliases block in `tokens.css` stays until a future major version. Two v1
behaviours did change: `.glass-toolbar` is a floating pill and only becomes the fixed navbar
with `.glass-toolbar--fixed`, and the slider's `.glass-slider-fill` element is gone (the
track paints its own fill from `--glass-slider-pct`).

## D7. The landing loads the skill's own files (2026-10-21)
Status: accepted
Context: a landing with its own copy of the styles drifted from the snippets, so "Code"
showed CSS that did not produce the demo.
Decision: `site/index.html` links `skills/liquid-glass/snippets/*` directly and only adds page
layout around the demos.
Consequences: the deploy must publish `skills/` next to the page (D8). A component cannot be
restyled from `site/`; it is fixed in its snippet.

## D8. GitHub Pages through GitHub Actions (2026-10-21)
Status: accepted
Context: the README pointed at a Cloudflare Pages URL that was never deployed.
Decision: `.github/workflows/pages.yml` assembles `site/index.html` and `skills/` into one
artifact, rewrites the snippet paths and publishes it on every push to `main`.
Consequences: Pages must be set to "GitHub Actions" in the repository settings. Steps in
[operations.md](operations.md).

## D9. Mobile glass budget of three surfaces; no refraction on touch by default (2026-10-21)
Status: accepted
Context: v1 allowed one `backdrop-filter` layer on mobile, which no real interface (tab bar,
toolbar and a sheet together) can meet.
Decision: at most three glass surfaces visible at once on mobile, and the engine skips touch
devices unless `<html data-glass-refract="always">`.
Consequences: the universal prompt, `SKILL.md` and the adapters state the same budget.

## D10. Scoped, on-demand documentation (2026-10-21)
Status: accepted
Context: knowledge lived in the README and in code comments, and the skill files had drifted
from the snippets.
Decision: a short root `AGENTS.md` (rules, doc map, maintenance contract), on-demand `docs/`
(code style, domains, landing design, operations, decisions) and `scripts/check-docs.mjs` in
CI.
Consequences: every fact has one home; a change updates its home in the same commit; CI
catches em dashes, broken links, stale inventories and version drift.
