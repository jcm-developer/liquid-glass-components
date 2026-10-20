# Contributing to Liquid Glass Components

Thank you for your interest in contributing.

## Before you start

- [AGENTS.md](AGENTS.md) lists the rules for every change and where each kind of knowledge
  lives. It applies to humans too.
- [docs/code-style.md](docs/code-style.md) covers naming, comments and docblocks.
- [docs/domains/components.md](docs/domains/components.md) is the contract every component
  follows.

## Adding a component

1. Create `skills/liquid-glass/snippets/glass-<component>.css` with the file docblock, a
   `Base` section, optional `Variants` and the full `Accessibility` section.
2. Use tokens (`var(--glass-*)`) for every colour, blur and timing.
3. Add the component to the `:where()` list in `tokens.css`, the snippet table in
   `SKILL.md`, the table in `docs/domains/components.md`, the `<link>` list and a gallery card
   in `site/index.html`.
4. Run `node scripts/check-docs.mjs`.
5. Do the visual release checks in [docs/operations.md](docs/operations.md).

## Principles

- **Accessibility first.** Never trade contrast for looks.
- **Refraction is an enhancement.** The component must look right without `liquid-glass.js`.
- **No glass on glass**, and glass only on the chrome layer.
- **Zero dependencies, no build step.**

## Reporting issues

Use the bug report or component request template when you open an issue. Please include the browser and version, the OS and any accessibility settings enabled, a
screenshot or recording for visual bugs, and minimal reproduction code.

## License

By contributing, you agree that your contributions are licensed under the MIT License.
