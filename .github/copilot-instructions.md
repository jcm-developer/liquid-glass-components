# Liquid Glass Components

See `agents/copilot-instructions.md` and `skills/liquid-glass/SKILL.md` for complete design system rules.

Key rules:
- Glass ONLY on navigation layer (bars, modals, popovers) — never on content
- Never stack glass on glass
- Include `prefers-reduced-transparency`, `prefers-reduced-motion`, `forced-colors` fallbacks
- Use `backdrop-filter: blur(20px) saturate(180%)` with `-webkit-` prefix
- Min font-weight 500 on glass, min 16px body text
- Max 1 backdrop-filter layer on mobile
