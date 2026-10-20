# AGENTS.md

Entry point for every AI agent working on this repository. It is always loaded, so it stays
short: what the project is, the rules that apply to every task, where the rest of the
knowledge lives, and how to keep that knowledge current.

This file is for agents that **develop** Liquid Glass Components. The file an end user copies
into their own project is [agents/AGENTS.md](agents/AGENTS.md); do not confuse the two.

## 1. How to work here

1. **Read this file, then only what the task needs.** Open the homes listed in Section 3 for
   the area you touch before writing code; do not read everything.
2. **These docs win over your defaults.** `AGENTS.md`, `docs/` and the skill files are the
   source of truth for architecture, style and design.
3. **The code is ground truth for structure.** When a doc and the code disagree, trust the
   code and fix the doc (Section 4).
4. **Leave the docs as current as the code.** A task is not done while a doc still describes
   the old behaviour.

## 2. Project

Liquid Glass Components is an open-source design system and AI skill that reproduces Apple's
Liquid Glass material on the web: real refraction, specular light and spring motion, with
complete accessibility fallbacks. It ships as copy-paste CSS snippets, one small JavaScript
file and a skill that teaches coding agents the rules.

| Layer | Technology |
|---|---|
| Components | Plain CSS, one file per component, BEM, `--glass-*` custom properties |
| Behaviour | `liquid-glass.js`: vanilla JavaScript, zero dependencies |
| Refraction | SVG `feDisplacementMap` through `backdrop-filter: url()` (Chromium), blur fallback elsewhere |
| Skill | `SKILL.md` plus adapters for Cursor, Copilot, Codex, Windsurf and Gemini CLI |
| Landing | `site/index.html`, a single static page that loads the snippets directly |
| Hosting | GitHub Pages through GitHub Actions (`.github/workflows/pages.yml`) |
| Build step | **None.** Nothing is compiled, bundled or installed |

```
liquid-glass-components/
├── AGENTS.md                  # This file: global rules, doc map, doc maintenance
├── CLAUDE.md                  # Imports AGENTS.md for Claude Code; holds no rules
├── README.md                  # Human introduction; not a source of rules
├── CONTRIBUTING.md            # Short guide for human contributors
├── docs/                      # On-demand knowledge, see Section 3
├── skills/liquid-glass/       # The skill: SKILL.md, references/, snippets/
├── agents/                    # Adapters end users copy into their own projects
├── site/                      # Landing page (GitHub Pages)
├── scripts/                   # Repo scripts (check-docs.mjs)
└── .github/                   # Workflows and the repo-level Copilot instructions
```

## 3. Documentation map

Each kind of fact has exactly one home. Read the home before working in its area; update it
when the area changes.

| Home | Owns | Read it when |
|---|---|---|
| `AGENTS.md` | Global rules, doc map, doc maintenance, workflow | Always (auto-loaded) |
| [docs/code-style.md](docs/code-style.md) | Naming, comments, docblocks, CSS and JS conventions | Writing or editing any code |
| [docs/domains/components.md](docs/domains/components.md) | The snippet contract: anatomy, material, states, fallbacks | Adding or changing a component |
| [docs/domains/refraction-engine.md](docs/domains/refraction-engine.md) | How `liquid-glass.js` refracts and its behaviours | Touching `liquid-glass.js` or refraction |
| [docs/domains/skill-distribution.md](docs/domains/skill-distribution.md) | `SKILL.md`, references, agent adapters, install paths, the universal prompt | Changing what agents are told or how they install it |
| [docs/design/landing.md](docs/design/landing.md) | Landing page layout, sections and demo rules | Changing `site/` |
| [docs/operations.md](docs/operations.md) | Local preview, deploy, CI, versioning, release checks | Deploy, CI or release questions |
| [docs/decisions.md](docs/decisions.md) | Why structural choices were made (decision log) | Proposing a structural change |
| `skills/liquid-glass/SKILL.md` | The rules end users' agents follow | Changing a rule users must follow |

## 4. Keeping the docs current

The docs are only useful while they match the code. Treat them as part of the change.

**Same commit.** A change that makes a documented statement false updates that doc in the
same commit:

| When you... | Update |
|---|---|
| Add, rename or delete a snippet | `SKILL.md` snippet table, `docs/domains/components.md`, the `<link>` list in `site/index.html`, the `:where()` list in `tokens.css` |
| Change a token name or default | `tokens.css`, `SKILL.md` token table, `README.md` tokens block |
| Change engine behaviour or its public API | `docs/domains/refraction-engine.md` and the header of `liquid-glass.js` |
| Change a rule end users must follow | `SKILL.md`, `references/design-principles.md` and every adapter in `agents/` |
| Change the universal prompt | `README.md` and `PROMPT` in `site/index.html` (check-docs compares them) |
| Change install commands | `README.md`, `AGENTS` in `site/index.html`, `docs/domains/skill-distribution.md` |
| Change the landing's sections or demo rules | `docs/design/landing.md` |
| Change deploy, CI or the release process | `docs/operations.md` |
| Make or reverse a structural decision | Append an entry to `docs/decisions.md` |

**How to write them.**
- **One fact, one home.** Elsewhere, link to it; never copy it.
- **Verify before writing.** Check every claim against the code.
- **Write what the code cannot say:** purpose, invariants, the why, traps.
- **Point by path and symbol, never by line number.**
- **Domain docs keep one template:** Purpose, Key files, Flow, Invariants, Gotchas, Related.
- English, no em dash (U+2014).

**Before calling a task done:** search the docs for every file and symbol you touched
(`rg -n "<name>" AGENTS.md docs skills agents README.md`) and fix whatever no longer holds.
Then run `node scripts/check-docs.mjs` (blocking in CI). It fails on an em dash, a broken
relative link, a snippet missing from an inventory, a version mismatch, or a universal prompt
that differs between the README and the landing.

## 5. Rules for every task

- **No build step and no dependencies.** Components stay plain CSS; behaviour stays in
  `liquid-glass.js`. Do not suggest a bundler, a framework, Sass or a package manager
  ([docs/decisions.md](docs/decisions.md), D1).
- **Glass only on the chrome layer, never glass on glass.** Controls inside a glass surface
  are flat fills.
- **Every component carries the full accessibility block**: reduced transparency, increased
  contrast, reduced motion and forced colours ([docs/domains/components.md](docs/domains/components.md)).
- **Refraction is an enhancement.** Every component must look right with the engine off.
- **English everywhere** in code, comments, docs and commits. **Never an em dash (U+2014).**
- **Every function carries a Google-style JSDoc docblock** (`@param`, `@return`, never
  `@returns`); format in [docs/code-style.md](docs/code-style.md).
- **The landing uses the snippets verbatim.** Never restyle a component inside `site/`; fix
  the snippet instead.

## 6. Workflow

- **Gate before calling a task done:** `node scripts/check-docs.mjs`, then the visual checks
  in [docs/operations.md](docs/operations.md) for anything that changes how a component looks.
- **Commits:** one line, a Conventional Commits subject (`feat:`, `fix:`, `docs:`, `chore:`),
  English, no body.
- **Pushing deploys.** A push to `main` publishes the landing through GitHub Pages.
