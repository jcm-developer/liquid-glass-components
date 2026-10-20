<div align="center">

# Liquid Glass Components

**Open-source components and an AI skill that bring Apple's Liquid Glass material to the web: real refraction, specular light and spring motion. Accessible, framework-agnostic, no build step.**

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Components](https://img.shields.io/badge/components-14-green.svg)](#components)
[![Version](https://img.shields.io/badge/version-2.0.0-purple.svg)](docs/decisions.md)

[Live demo](https://jcm-developer.github.io/liquid-glass-components/) · [Install as AI skill](#install-as-an-ai-skill) · [Universal prompt](#universal-prompt)

</div>

---

## Features

- **Real refraction.** An SVG displacement map bends the backdrop at the bezel like a lens, with a faint chromatic fringe (Chromium). Every other browser gets a clean blur fallback.
- **The actual material.** Low frost, two specular rims and a pointer-reactive sheen instead of a heavy frosted blur.
- **Fluid interaction.** Pressed controls swell, switch and slider thumbs turn into lenses, selections slide and stretch on native CSS springs.
- **Accessible by default.** Reduced transparency, increased contrast, reduced motion and forced colours fallbacks in every component, plus WCAG AA text.
- **Zero dependencies.** Plain CSS and one optional vanilla JS file. Copy, paste, ship.
- **AI-ready.** Installs as a skill for Claude Code, Cursor, Copilot, Codex, Gemini CLI and Windsurf.

## Components

| Component | File | Highlights |
|---|---|---|
| Surface | `glass-surface.css` | Base material for custom glass elements |
| Button | `glass-button.css` | Regular, prominent, icon, small and plain variants |
| Card | `glass-card.css` | Floating panel for players, widgets and inspectors |
| Tab Bar | `glass-tab-bar.css` | Icon and label tabs with a sliding indicator |
| Toolbar | `glass-toolbar.css` | Floating tool pill and fixed navbar |
| Segmented Control | `glass-segmented.css` | Selection that slides and stretches |
| Toggle | `glass-toggle.css` | Thumb that becomes a lens while pressed |
| Slider | `glass-slider.css` | Capsule thumb that becomes a lens while dragged |
| Search Field | `glass-search.css` | Pill that springs wider on focus |
| Modal / Sheet | `glass-modal.css` | Native `<dialog>`, centred or bottom sheet |
| Toast | `glass-toast.css` | Springs in from the bottom or top edge |
| Popover | `glass-popover.css` | Contextual menu with shortcuts and dividers |
| Sidebar | `glass-sidebar.css` | Navigation with a sliding current-page indicator |
| Dock | `glass-dock.css` | Proximity magnification |

## Quick start

1. Copy `skills/liquid-glass/snippets/tokens.css` and the component files you need.
2. Optionally copy `liquid-glass.js` for refraction and behaviours.
3. Use the markup from the docblock at the top of each CSS file.

```html
<link rel="stylesheet" href="tokens.css">
<link rel="stylesheet" href="glass-tab-bar.css">
<script src="liquid-glass.js" defer></script>

<nav class="glass-tabs" role="tablist" aria-label="Main" data-refract>
  <button class="glass-tabs__tab" type="button" role="tab" aria-selected="true">
    <span class="glass-tabs__label">Home</span>
  </button>
  <button class="glass-tabs__tab" type="button" role="tab" aria-selected="false">
    <span class="glass-tabs__label">Search</span>
  </button>
</nav>
```

`data-refract` opts an element into refraction. Glass needs something to look through: place
it over photos, video, wallpapers or scrolling content.

## Install as an AI skill

### Universal prompt

Copy this prompt into any AI coding agent:

```
Install the "liquid-glass" skill from https://github.com/jcm-developer/liquid-glass-components and use it in this project.

1. Detect which agent/environment you are (Claude Code, Cursor, Codex, Gemini CLI, Windsurf, Copilot) and choose the corresponding installation method from the repo's README.
2. Copy the `skills/liquid-glass` folder to the appropriate skills/rules location for your agent (project-level unless told otherwise). If your agent uses a proprietary format (.mdc, .instructions.md, AGENTS.md), use the corresponding adapter from the `agents/` folder.
3. Read SKILL.md and the files in `references/` and `snippets/` before writing code.
4. Review the current project stack (framework, styling system, existing tokens) and integrate the skill's tokens without breaking existing styles.
5. Confirm the installation path and give me a 3-line summary of the main rules.
6. Then ask me which component I want to create or restyle first with Liquid Glass.

Always respect: WCAG AA contrast (≥4.5:1), prefers-reduced-transparency fallback, prefers-reduced-motion suppression, no glass on content layer, no glass on glass, min font-weight 500 on glass, at most 3 glass surfaces visible at once on mobile.
```

### By agent

<details>
<summary><strong>Claude Code</strong></summary>

```bash
# Option A: npx skills (recommended)
npx skills add jcm-developer/liquid-glass-components

# Option B: Manual clone
git clone https://github.com/jcm-developer/liquid-glass-components /tmp/lgc
cp -r /tmp/lgc/skills/liquid-glass .claude/skills/
rm -rf /tmp/lgc
```

Skill location: `.claude/skills/liquid-glass/SKILL.md`
</details>

<details>
<summary><strong>Cursor</strong></summary>

```bash
# Install Cursor AI rule
mkdir -p .cursor/rules
cp agents/cursor-rule.mdc .cursor/rules/liquid-glass.mdc

# Or paste the "Any agent" prompt into Cursor Composer
```
</details>

<details>
<summary><strong>GitHub Copilot</strong></summary>

```bash
# Add Copilot instructions
mkdir -p .github/instructions
cp agents/copilot-instructions.md .github/instructions/liquid-glass.instructions.md
```
</details>

<details>
<summary><strong>OpenAI Codex</strong></summary>

```bash
# Configure Codex project skills
cp agents/AGENTS.md ./AGENTS.md
mkdir -p .agents/skills
cp -r skills/liquid-glass .agents/skills/
```
</details>

<details>
<summary><strong>Gemini CLI / Antigravity</strong></summary>

```bash
# Option A: CLI install
gemini skills install https://github.com/jcm-developer/liquid-glass-components

# Option B: Manual copy
mkdir -p .gemini/skills
cp -r skills/liquid-glass .gemini/skills/

# Option C: npx skills
npx skills add jcm-developer/liquid-glass-components
```
</details>

<details>
<summary><strong>Windsurf</strong></summary>

```bash
# Install Windsurf Cascade rule
mkdir -p .windsurf/rules
cp agents/windsurf-rule.md .windsurf/rules/liquid-glass.md
```
</details>

## Design tokens

Every optical parameter is a CSS custom property. Override them globally or on one element:

```css
:root {
  --glass-tint: 0.08;          /* surface fill opacity */
  --glass-rim: 0.6;            /* specular rim intensity, 0 to 1 */
  --glass-blur: 2px;           /* frost while refraction is active */
  --glass-blur-fallback: 8px;  /* frost without refraction */
  --glass-refraction: 48;      /* displacement strength in px */
  --glass-bezel: 22px;         /* width of the curved lens edge */
  --glass-chroma: 0.5;         /* chromatic dispersion, 0 to 1 */
}
```

The playground on the [live demo](https://jcm-developer.github.io/liquid-glass-components/#playground) exports these values. See [`tokens.css`](skills/liquid-glass/snippets/tokens.css) for the full set, including the light and dark schemes (`data-glass-scheme`) and every accessibility override.

## Browser support

| Feature | Chrome / Edge | Safari | Firefox |
|---|---|---|---|
| Glass material (`backdrop-filter`) | 76+ | 9+ (`-webkit-`) | 103+ |
| Real refraction (`backdrop-filter: url()`) | Yes | Blur fallback | Blur fallback |
| CSS `linear()` springs | 113+ | 17.2+ | 112+ |
| View Transitions (landing only) | 111+ | 18+ | 144+ |

Refraction also stays off on touch devices by default (battery), under reduced transparency,
increased contrast and forced colours.

## Repository structure

```
liquid-glass-components/
├── skills/liquid-glass/   # The skill: SKILL.md, references/, snippets/
├── agents/                # Adapters for Cursor, Copilot, Codex, Windsurf
├── site/                  # Landing page (GitHub Pages)
├── docs/                  # Contributor documentation
├── scripts/               # check-docs.mjs
├── AGENTS.md              # Rules for agents working on this repo
└── CONTRIBUTING.md
```

## Contributing

Start with [CONTRIBUTING.md](CONTRIBUTING.md). Contributor docs live in [`docs/`](docs/):
[code style](docs/code-style.md), [component contract](docs/domains/components.md),
[refraction engine](docs/domains/refraction-engine.md), [operations](docs/operations.md) and
the [decision log](docs/decisions.md).

## License

[MIT](LICENSE). Free for personal and commercial use.

---

## Legal disclaimer and trademark notice

**Liquid Glass Components** is an independent, community-driven open-source project.

This project is **not** affiliated, associated, authorized, endorsed by, or in any way officially connected with **Apple Inc.**, or any of its subsidiaries or its affiliates. The official Apple website can be found at [apple.com](https://www.apple.com).

The names **Apple**, **Liquid Glass**, **macOS**, **iOS**, **iPadOS**, **watchOS**, **visionOS**, **SF Pro**, and **SF Symbols**, as well as related names, marks, emblems, and images, are registered trademarks or trademarks of Apple Inc. in the United States and/or other countries and regions.

Any reference to Apple's design terminology (including "Liquid Glass") is made solely for descriptive, comparative, and nominative purposes under fair use principles to communicate the aesthetic inspiration and technical intent of these web components. All trademarks and registered trademarks remain the property of their respective holders.
