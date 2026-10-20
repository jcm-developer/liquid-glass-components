# Skill distribution

## Purpose

How the Liquid Glass rules and snippets reach end users' coding agents: the skill, its
references, the per-agent adapters, the install paths and the universal prompt.

## Key files

| File | Read by | Role |
|---|---|---|
| `skills/liquid-glass/SKILL.md` | Claude Code, Gemini CLI, Codex (as a skill) | The full rule set and snippet index |
| `skills/liquid-glass/references/design-principles.md` | The skill, on demand | Optical background and variant table |
| `skills/liquid-glass/snippets/*` | The skill, and humans copying code | The components ([components.md](components.md)) |
| `agents/AGENTS.md` | Codex, and any agent reading `AGENTS.md` in the user's repo | Condensed rules |
| `agents/cursor-rule.mdc` | Cursor (`.cursor/rules/`) | Condensed rules with globs |
| `agents/copilot-instructions.md` | Copilot (`.github/instructions/`) | Condensed rules with `applyTo` |
| `agents/windsurf-rule.md` | Windsurf (`.windsurf/rules/`) | Condensed rules |
| `README.md` | Humans | Install commands and the universal prompt |
| `site/index.html` (`AGENTS`, `PROMPT`) | Visitors | The same install commands and prompt |

`agents/AGENTS.md` is a file users copy into their project. The root `AGENTS.md` instructs
agents developing this repository. They are unrelated.

## Flow

1. The user installs with `npx skills add jcm-developer/liquid-glass-components` (Claude Code,
   Gemini CLI), copies an adapter (Cursor, Copilot, Windsurf, Codex), or pastes the universal
   prompt into any agent.
2. The agent reads `SKILL.md` or its adapter, then the snippets it needs.
3. It copies `tokens.css`, the component snippets and, for refraction and behaviours,
   `liquid-glass.js` into the user's project.

## Invariants

- `SKILL.md`, `references/design-principles.md` and every adapter state the same rules. The
  adapters are condensed, never contradictory.
- The universal prompt is identical in `README.md` and `PROMPT` in `site/index.html`;
  `check-docs.mjs` compares them.
- Install commands are identical in `README.md` and `AGENTS` in `site/index.html`.
- `SKILL.md` lists every snippet; `check-docs.mjs` enforces it.

## Gotchas

- Adapters embed a short CSS example. When the material changes, update those examples too;
  a stale example teaches the old look.
- `SKILL.md` front matter (`name`, `description`) decides when agents load the skill. Keep the
  description about when to use it, not about how it works.

## Related

- [components.md](components.md): what the snippets must contain.
- [../decisions.md](../decisions.md): D2, D3, D9.
