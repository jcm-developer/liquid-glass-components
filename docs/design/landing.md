# Landing page

> Page recipe. Component styles live in the snippets ([../domains/components.md](../domains/components.md));
> this file only holds what is specific to the page.

`site/index.html` is the public page: one static file, no build step. It links every snippet
from `../skills/liquid-glass/snippets/` and `liquid-glass.js`, so each demo is the shipped
component, not a copy ([../decisions.md](../decisions.md), D7). The page adds layout, stages
and copy around them; it never restyles a component.

## Look

Dark by default (`#08080a`) with a light theme behind the theme button, persisted in
`localStorage` (`lg-theme`) and applied before first paint, together with the matching
`meta theme-color` so the mobile browser bar follows the theme. Type is Geist and Geist Mono; the
snippets inherit it through `--glass-font-sans`. Sections are left aligned with a mono kicker
(`01 · What's inside`), a large tight headline and a short muted paragraph.

`color-scheme` follows the theme, so native controls and scrollbars match it. Scrollbars are
thin and use `--scroll-thumb` through the standard `scrollbar-width` and `scrollbar-color`
(no `::-webkit-scrollbar` rules, which Chromium ignores once `scrollbar-color` is set). While
a `<dialog>` is open the page stops scrolling, so only the dialog shows a scrollbar; the code
drawer wraps long lines instead of scrolling sideways.

Page buttons come in two shapes: labelled pills (`.btn`, `.code-btn`) and icon-only actions
(`.icon-btn`), which are bare icons that show a round fill only on hover. An icon action sits
at the edge of a pill group, never between two pills.

Glass appears only where it has something to refract: on **stages**, rounded frames that hold
a wallpaper. Page cards, the nav at rest and the terminal are flat.

## Sections

1. **Nav.** Transparent at the top; past 40px of scroll it contracts into a centred pill with a
   blur (`.nav.scrolled`). Below 760px the links move into a menu: a native popover
   (`#nav-menu`, opened by `popovertarget`), so Escape and outside clicks close it for free.
2. **Hero.** Headline with a word-by-word blur-in, the install command in a copy pill, and the
   hero stage: an animated wallpaper (drifting blobs plus a scrolling feed of tiles and
   headlines) under real components. The draggable lens (pointer and arrow keys), the
   wallpaper segmented control, the refraction switch and strength slider, and the tab bar
   are all live.
3. **Stats strip.** Facts only (components, agents, dependencies, licence). GitHub stars load
   at runtime and stay hidden below ten.
4. **What's inside.** Bento of flat cards with small animated visuals.
5. **Components.** Gallery of every snippet on its own mini wallpaper, filtered by category
   with View Transitions. "Code" opens a drawer with the snippet's source. Cards are one
   cell; `.wide` spans two columns and `.tall` two rows (the navigation bar's phone screen,
   which scrolls on its own). Keep the cell count a multiple of three and of two so the grid
   has no holes.
6. **Playground.** Sliders write `--glass-*` tokens on the preview elements and call
   `LiquidGlass.refresh`; "Copy tokens" exports a `:root` block.
7. **Install.** Steps on the left, a terminal with one tab per agent (plus "Any agent" for the
   universal prompt) on the right.
8. **CTA and footer**, with the full trademark notice.

## Demo rules

- Every stage sets `data-glass-scheme="dark"`: the wallpapers are dark and saturated, so the
  dark scheme is right regardless of the page theme. Page-level glass (toast, sheet) follows
  the page theme through `data-glass-scheme` on `<html>`.
- Demo markup is the usage markup from the snippet's docblock. Demo sidebar links carry
  `data-demo-link` so they do not jump the page. Shortcuts in demos are written for macOS
  (`⌘K`); on other platforms a script rewrites them to `Ctrl` (`isApplePlatform`).
- The "Code" drawer loads the deployed snippet first and falls back to GitHub raw when the
  page runs from `file://` (`loadSnippet`).
- No glass inside glass: the gallery cards are flat; only the component sits on the
  wallpaper.

## Motion and performance

- Wallpapers pause while off screen (`IntersectionObserver` toggles `.paused`).
- Scroll reveals use `animation-timeline: view()` inside `@supports`, so content is visible
  without it.
- `prefers-reduced-motion` stops every animation and transition on the page.
- On touch devices the engine skips refraction, so the hero shows the blur fallback
  ([../decisions.md](../decisions.md), D9).

## Responsive

- Below 1000px: single-column hero, two-column gallery, the hero control panel hides.
- Below 760px: the nav links and "Get started" move into the menu popover, and GitHub loses
  its label and becomes an icon action like the theme and menu buttons.
- Below 640px: 16px gutters, stacked CTAs, one-column gallery, smaller lens; the hero's corner
  buttons hide. The page never scrolls horizontally (`overflow-x: clip` on `body` as a guard).
