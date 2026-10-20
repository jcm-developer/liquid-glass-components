# Code style

How CSS, JavaScript, HTML and Markdown are written in this repository. Read it before writing
or editing code. What a component must contain (material, states, fallbacks) lives in
[domains/components.md](domains/components.md); this file is about how it is written.

## Naming

- Snippets: `skills/liquid-glass/snippets/glass-<component>.css`, one component per file.
  The shared material is `glass-surface.css`; behaviour is `liquid-glass.js`.
- Classes: BEM with the `glass-` prefix: `.glass-<component>`, `.glass-<component>__<element>`,
  `.glass-<component>--<modifier>`. State classes set by JavaScript use `is-`
  (`is-enhanced`, `is-refracting`, `is-stretching`).
- Custom properties: `--glass-*` for every token. Component-local properties keep the
  component name (`--glass-search-width`, `--glass-dock-scale`).
- Data attributes: `data-refract` and `data-refract-<option>` for refraction,
  `data-glass-*` for everything else (`data-glass-scheme`, `data-glass-indicator`).
- Events: `glass:<name>` (`glass:change`).
- Selection state lives in ARIA (`aria-selected`, `aria-checked`, `aria-current`), never in a
  class. v1 modifier classes such as `--active` are still read for compatibility.

## Comments

- **English.** Every comment, docblock and doc.
- Two kinds only: **docblocks** on declarations and files (format below) and **inline
  comments** inside a body that explain the WHY, never the WHAT. Never comment the refactor
  itself; that belongs in the commit message.
- `/* ── Section ── */` banners split a long file into sections.
- **Never an em dash (U+2014).** Use a comma, colon, semicolon, period or parentheses.
  `scripts/check-docs.mjs` fails the build on one.

## CSS

### File docblock

Every snippet starts with a `/** */` docblock: a summary sentence, a line with the version and
dependencies, then the usage markup indented two spaces after `*  `, then any notes. The
markup is the contract: the landing and the README use it verbatim.

```css
/**
 * Switch whose thumb swells into a clear lens while pressed.
 *
 * Liquid Glass Components v2.0.0. Requires tokens.css. Optional: liquid-glass.js (toggles aria-checked).
 *
 * Usage:
 *   <button class="glass-toggle" type="button" role="switch" aria-checked="true" aria-labelledby="wifi-label">
 *     <span class="glass-toggle__thumb"></span>
 *   </button>
 *
 *   Without liquid-glass.js, flip aria-checked yourself on click.
 */

/* ── Base ── */
```

### Sections

In this order: `/* ── Base ── */`, then optional `/* ── Variants ── */`, then
`/* ── Accessibility ── */` with all four media queries (reduced transparency, increased
contrast, reduced motion, forced colours).

### Rules

- Values come from tokens. The only literals allowed are geometry specific to the component
  and the pure white of specular highlights.
- Declare `-webkit-backdrop-filter` before `backdrop-filter`, always with the same value.
- Use individual transform properties (`scale`, `translate`) for state changes so they do
  not overwrite each other.
- Inline comments on a declaration explain why it is there, not what it does.

## JavaScript

### Docblocks (Google JSDoc style)

Every function declaration and every member of the public `LiquidGlass` API carries one.
One-line arrow helpers bound to a `const` (`$`, `mq`, `onScroll`) and closures passed
straight to an event listener are exempt. A comment that documents a declaration is always a
`/** */` docblock directly above it, never `//` or `/* */`.

- A summary sentence in the third person, starting with a verb ("Returns", "Builds",
  "Checks"), ending in a period. Further paragraphs, if any, hold the WHY.
- A blank ` *` line before the tags.
- `@param {type} name - Description.` One per parameter, in signature order. The description
  starts with a capital and ends with a period. Optional: `[name]`, default: `[name=value]`.
  Nullable: `{?type}`. Object members: `@param {type} args.member - ...`.
- `@return {type} Description.` Never `@returns`. Omit it for functions that return nothing.
- Line width 100; continuation lines of a tag are indented 4 spaces after the `*`.
- **Constants and fields**: a single-line `/** ... */` is enough.

```js
/**
 * Builds the displacement map of a rounded rectangle as a PNG data URL.
 *
 * Inside the bezel each pixel samples the backdrop further inward along the edge normal,
 * which is how the rim of a convex lens bends light.
 *
 * @param {number} w - The width in CSS pixels.
 * @param {number} h - The height in CSS pixels.
 * @param {number} r - The corner radius in CSS pixels.
 * @param {number} bezel - The width of the curved edge in CSS pixels.
 * @return {string} The map as a data URL.
 */
function displacementMap(w, h, r, bezel) { ... }

/** Maximum number of displacement maps kept in memory. */
const MAP_CACHE_SIZE = 48;
```

### Rules

- `'use strict'`, `const` by default, `let` only when reassigned, no `var` (except the
  pre-paint theme script in `site/index.html`, which must run in any browser).
- No dependencies, no modules that need a bundler. `liquid-glass.js` is a classic script that
  exposes `window.LiquidGlass`.
- No `console.log` in shipped code.

## HTML

- Semantic elements and ARIA roles first (`role="tablist"`, `role="switch"`, `<dialog>`).
- Interactive elements are `<button type="button">` or `<a href>`, never a clickable `<div>`.
- Icon-only controls carry `aria-label`; decorative SVG carries `aria-hidden="true"`.

## Markdown

- English, sentence case headings, no em dash.
- Point to code by path and symbol (`liquid-glass.js` → `apply`), never by line number.
- Relative links between docs; `scripts/check-docs.mjs` checks they resolve.
