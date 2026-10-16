<div align="center">

# 🫧 Liquid Glass Components

**An open-source design system and AI skill for building web interfaces with Apple's Liquid Glass aesthetic — accessible, performant, and framework-agnostic.**

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Components](https://img.shields.io/badge/components-14-green.svg)](#-components)
[![Browser Support](https://img.shields.io/badge/browsers-98%25-brightgreen.svg)](#-browser-support)

[Live Demo →](https://liquid-glass-components.pages.dev) · [Install as AI Skill →](#-install-as-ai-skill) · [Copy Prompt →](#-universal-prompt)

</div>

---

> Translucent, refractive, and fluid UI components for the web — inspired by the visual language Apple introduced at WWDC 2025.

## ✨ Features

- 🔮 **Authentic Glass Aesthetic** — `backdrop-filter`, specular borders with `mask-composite`, and native CSS spring physics
- ♿ **Accessible by Default** — WCAG AA contrast, `prefers-reduced-transparency`, `forced-colors`, and `prefers-reduced-motion` fallbacks built into every component
- ⚡ **Zero Dependencies** — Pure CSS + vanilla JS. No framework lock-in. Copy and paste
- 🤖 **AI-Ready Skill** — Install as a skill for Claude Code, Cursor, Copilot, Codex, Gemini CLI, or Windsurf
- 🎨 **Customizable Tokens** — Tune blur, opacity, saturation, radii, and spring animations via CSS custom properties
- 🌗 **Light & Dark Mode** — Automatic adaptation with `prefers-color-scheme`
- 📱 **Mobile Optimized** — Progressive enhancement: solid fallback → glass → glass with specular reflections

## 🧩 Components

| Component | Status | Description |
|-----------|--------|-------------|
| Glass Card | ✅ Ready | Panel with specular border, variants: regular, clear, prominent, elevated |
| Button (Pill) | ✅ Ready | Pill-shaped button with spring press animation |
| Icon Button | ✅ Ready | Circular icon button (44×44 touch target) |
| Tab Bar | ✅ Ready | Horizontal tab bar with sliding active indicator |
| Toolbar / Navbar | ✅ Ready | Floating fixed navbar with specular border |
| Segmented Control | ✅ Ready | Radio group with glass active indicator |
| Toggle / Switch | ✅ Ready | Switch with glass thumb and spring animation |
| Search Field | ✅ Ready | Expandable search pill |
| Modal / Sheet | ✅ Ready | Centered modal and bottom sheet variants |
| Toast | ✅ Ready | Floating notification pill |
| Slider | 📋 Planned | Range input with glass thumb |
| Popover / Menu | 📋 Planned | Contextual glass panel |
| Sidebar | 📋 Planned | Collapsible glass lateral panel |
| Dock | 📋 Planned | macOS-style magnifying dock |

## 🚀 Quick Start

### Copy & Paste (Recommended)

1. Copy `skills/liquid-glass/snippets/tokens.css` into your project
2. Import it: `@import url('./tokens.css');`
3. Copy any component CSS file from `skills/liquid-glass/snippets/`
4. Use the HTML structure documented at the top of each CSS file

### CDN (Coming Soon)

```html
<link rel="stylesheet" href="https://unpkg.com/liquid-glass-components/tokens.css">
```

## 🤖 Install as AI Skill

### Universal Prompt (works with any agent)

Copy this prompt and paste it into your AI coding agent:

```
Install the "liquid-glass" skill from https://github.com/jcm-developer/liquid-glass-components and use it in this project.

1. Detect which agent/environment you are (Claude Code, Cursor, Codex, Gemini CLI, Windsurf, Copilot) and choose the corresponding installation method from the repo's README.
2. Copy the `skills/liquid-glass` folder to the appropriate skills/rules location for your agent (project-level unless told otherwise). If your agent uses a proprietary format (.mdc, .instructions.md, AGENTS.md), use the corresponding adapter from the `agents/` folder.
3. Read SKILL.md and the files in `references/` and `snippets/` before writing code.
4. Review the current project stack (framework, styling system, existing tokens) and integrate the skill's tokens without breaking existing styles.
5. Confirm the installation path and give me a 3-line summary of the main rules.
6. Then ask me which component I want to create or restyle first with Liquid Glass.

Always respect: WCAG AA contrast (≥4.5:1), prefers-reduced-transparency fallback, prefers-reduced-motion suppression, no glass on content layer, no glass on glass, min font-weight 500 on glass, max 1 backdrop-filter layer on mobile.
```

### By Agent

<details>
<summary><strong>Claude Code</strong></summary>

```bash
# Option A: npx skills (if available)
npx skills add jcm-developer/liquid-glass-components

# Option B: Manual
git clone https://github.com/jcm-developer/liquid-glass-components /tmp/lgc
cp -r /tmp/lgc/skills/liquid-glass .claude/skills/
rm -rf /tmp/lgc
```

Skill location: `.claude/skills/liquid-glass/SKILL.md`
</details>

<details>
<summary><strong>Cursor</strong></summary>

```bash
mkdir -p .cursor/rules
cp agents/cursor-rule.mdc .cursor/rules/liquid-glass.mdc
```
</details>

<details>
<summary><strong>GitHub Copilot</strong></summary>

```bash
mkdir -p .github/instructions
cp agents/copilot-instructions.md .github/instructions/liquid-glass.instructions.md
```
</details>

<details>
<summary><strong>OpenAI Codex</strong></summary>

```bash
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

# Option B: Manual
mkdir -p .gemini/skills
cp -r skills/liquid-glass .gemini/skills/

# Option C: npx skills
npx skills add jcm-developer/liquid-glass-components
```
</details>

<details>
<summary><strong>Windsurf</strong></summary>

```bash
mkdir -p .windsurf/rules
cp agents/windsurf-rule.md .windsurf/rules/liquid-glass.md
```
</details>

## 🎨 Design Tokens

Customize every aspect via CSS custom properties:

```css
:root {
  --glass-blur: 20px;            /* Gaussian blur radius */
  --glass-bg: rgba(255,255,255,0.12);  /* Surface background */
  --glass-saturation: 180%;      /* Backdrop saturation boost */
  --glass-border-radius-lg: 24px;/* Large corner radius */
  --glass-easing-spring: linear( /* Native CSS spring curve */
    0, 0.009, 0.035 2.1%, 0.141 4.4%, 0.723 12.9%, ...
  );
}
```

See [`tokens.css`](skills/liquid-glass/snippets/tokens.css) for the complete set including dark mode, high contrast, and forced-colors overrides.

## 🌐 Browser Support

| Feature | Chrome | Safari | Firefox | iOS Safari |
|---------|--------|--------|---------|------------|
| `backdrop-filter` | 76+ | 9+ (webkit) | 103+ | 9+ (webkit) |
| `mask-composite` | 120+ | 15.4+ | 53+ | 15.4+ |
| CSS `linear()` springs | 113+ | 17.2+ | 112+ | 17.2+ |
| View Transitions | 111+ | 18+ | 144+ | 18+ |
| **Overall** | **~98% global** |||||

## 📁 Repository Structure

```
liquid-glass-components/
├── skills/liquid-glass/       # AI skill (SKILL.md + references + snippets)
├── agents/                    # Multi-agent adapters (Cursor, Copilot, Codex, Windsurf)
├── site/                      # Landing page (coming soon)
├── README.md
├── LICENSE (MIT)
└── TRADEMARKS.md
```

## 📄 License

[MIT](LICENSE) — Free for personal and commercial use. Copy, modify, distribute.

---

## Legal Disclaimer & Trademark Notice

**Liquid Glass Components** is an independent, community-driven open-source project.

This project is **not** affiliated, associated, authorized, endorsed by, or in any way officially connected with **Apple Inc.**, or any of its subsidiaries or its affiliates. The official Apple website can be found at [apple.com](https://www.apple.com).

The names **Apple**, **Liquid Glass**, **macOS**, **iOS**, **iPadOS**, **watchOS**, **visionOS**, **SF Pro**, and **SF Symbols**, as well as related names, marks, emblems, and images, are registered trademarks or trademarks of Apple Inc. in the United States and/or other countries and regions.

Any reference to Apple's design terminology (including "Liquid Glass") is made solely for descriptive, comparative, and nominative purposes under fair use principles to communicate the aesthetic inspiration and technical intent of these web components. All trademarks and registered trademarks remain the property of their respective holders.
