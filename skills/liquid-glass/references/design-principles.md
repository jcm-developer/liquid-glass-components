# Liquid Glass design principles

> Reference for AI agents. Read when generating Liquid Glass components. The rules themselves
> are in `../SKILL.md`; this file explains the optics behind them.

## What Liquid Glass is

Liquid Glass is the interface material Apple introduced at WWDC 2025. It behaves like a thin,
curved piece of glass floating above content: it bends what is behind it at its edges, catches
light on its rims, and reacts to touch as if it were fluid.

## Layer hierarchy

| Layer | Material | Examples |
|---|---|---|
| Navigation and controls (top) | Liquid Glass | Tab bars, toolbars, sidebars, docks, popovers, sheets, modals, toasts, floating buttons |
| Content (bottom) | Opaque or plain | Articles, cards in a feed, lists, tables |
| Transitional | Glass while interacting | Switch and slider thumbs while held |

## Optical properties and their web equivalents

| Property | What happens | On the web |
|---|---|---|
| Refraction | The backdrop bends toward the centre near the bezel | SVG `feDisplacementMap` in `backdrop-filter: url()` (`liquid-glass.js`) |
| Chromatic dispersion | A faint colour fringe at the very edge | Three displacement passes, one per colour channel |
| Clarity | The backdrop stays readable through the surface | Low frost: 2px with refraction, 8px without |
| Specular highlights | Bright rims where light enters and exits the glass | Two inset shadows (`--glass-shadow-rim`) plus a pointer sheen |
| Adaptive tint | The surface takes on what is behind it | `saturate(180%)` on the backdrop and a faint tint |
| Fluidity | Controls swell, stretch and settle | `linear()` springs, growing press, stretching indicators |

## Variants

| Variant | Tint | Frost | Use |
|---|---|---|---|
| Regular | `0.08` (dark scheme), `0.42` (light scheme) | 2px refracted, 8px fallback | Bars, sidebars, popovers, sheets |
| Clear | `0.02` | Same | Controls over photos, video and maps |
| Prominent | Accent at `0.55` | Same | The single primary action |

## The 35% rule

For the clear variant over bright media, add a `rgba(0, 0, 0, 0.35)` dimming layer behind
the control so its content keeps WCAG AA contrast.

## Concentric geometry

```
Inner radius = Outer radius - Padding
```

## Schemes

- **Dark scheme** (default): glass over dark or colourful content. White text, low tint.
- **Light scheme**: glass over light content. Dark text, denser white tint, stronger rims.

Choose the scheme by what is behind the glass, not only by the page theme
(`data-glass-scheme`).

## Sources

- [Apple Developer: Liquid Glass](https://developer.apple.com/documentation/technologyoverviews/liquid-glass)
- [HIG: Materials](https://developer.apple.com/design/human-interface-guidelines/materials)
- [WWDC25 Session 219](https://developer.apple.com/videos/play/wwdc2025/219/)
