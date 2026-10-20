# Liquid Glass Components

Read `AGENTS.md` at the repository root before working here: it holds the rules, the
documentation map and the maintenance contract. Code style is in `docs/code-style.md`.

Key rules:
- No build step and no dependencies: plain CSS snippets and one vanilla JS file
- Glass ONLY on the navigation layer, never on content; never glass on glass
- Every component includes the reduced transparency, increased contrast, reduced motion and forced colours fallbacks
- Refraction (`liquid-glass.js`) is an enhancement; components must look right without it
- English everywhere, no em dash (U+2014), Google-style JSDoc on every function
- Run `node scripts/check-docs.mjs` before calling a task done
