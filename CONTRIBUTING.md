# Contributing to Liquid Glass Components

Thank you for your interest in contributing! 🫧

## How to Contribute

### Adding a New Component

1. Create `skills/liquid-glass/snippets/glass-<component>.css`
2. Include the HTML structure as a comment at the top
3. Use design tokens from `tokens.css` — never hardcode values
4. Include ALL accessibility fallbacks:
   - `@supports not (backdrop-filter: blur(1px))`
   - `@media (prefers-reduced-transparency: reduce)`
   - `@media (prefers-reduced-motion: reduce)`
   - `@media (forced-colors: active)`
5. Include states: hover, active, focus-visible, disabled
6. Test on Chrome, Safari, and Firefox
7. Ensure min 44×44px touch targets for interactive elements

### Design Principles

- **Accessibility first** — Never sacrifice contrast for aesthetics
- **Performance budget** — Max 1 backdrop-filter on mobile
- **Zero dependencies** — Pure CSS, no JS unless absolutely necessary
- **Progressive enhancement** — Solid fallback → glass → glass with effects

### Code Style

- Use BEM naming: `.glass-component__element--modifier`
- Use design tokens via `var(--glass-*)` custom properties
- Include `-webkit-backdrop-filter` alongside `backdrop-filter`
- Comment non-obvious techniques (e.g., mask-composite trick)

## Reporting Issues

Please include:
- Browser and version
- OS and accessibility settings enabled
- Screenshot or recording if visual bug
- Minimal reproduction code

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
