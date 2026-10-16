# Liquid Glass Design Principles Reference

> Reference document for AI agents. Read when generating Liquid Glass components.

## Apple's Liquid Glass (WWDC 2025)

Liquid Glass is a dynamic interface material combining optical physics (refraction, lensing, specular highlights) with fluid digital behavior (morphing, spring animations, adaptive tinting).

## Layer Hierarchy

| Layer | Material | Examples |
|-------|----------|----------|
| **Navigation/Chrome** (top) | Liquid Glass | Tab bars, toolbars, sidebars, popovers, sheets, modals, FABs |
| **Content** (bottom) | Standard/Solid | Articles, cards, lists, feeds, tables |
| **Exception** | Glass (transitional only) | Slider thumbs, toggle knobs while being dragged |

## Optical Properties

1. **Refraction** — Content behind bends slightly toward center (n ≈ 1.45–1.52)
2. **Lensing** — Convex distortion at edges magnifies adjacent pixels
3. **Specular highlights** — Bright rim on top edge, reactive to tilt/cursor
4. **Adaptive tinting** — Surface absorbs dominant hues from background
5. **Chromatic dispersion** — Subtle spectral halo at extreme edges
6. **Substantiality** — Small elements = thin glass; large panels = thick glass

## Variants

| Variant | Blur | Opacity | Use Case |
|---------|------|---------|----------|
| `regular` | 20–28px | Medium | Bars, sidebars, modals, any text-heavy surface |
| `clear` | 8px | Low | Controls over rich media (photos, video, maps) |
| `prominent` | 24px | Medium + accent tint | Primary CTA (Save, Buy, Call) |
| `identity` | 0 | Transparent | Base state for transitions/fallback |

## The 35% Rule

For `clear` variant on bright backgrounds: add `rgba(0, 0, 0, 0.35)` dimming layer behind the control.

## Concentric Geometry

```
Inner Radius = Outer Radius − Padding
```

## Mode Behavior

- **Light mode:** White reflectance, elevated luminance
- **Dark mode:** Smoky deep glass, sharper specular rims, enhanced color spill sensitivity

## Sources

- [Apple Developer: Liquid Glass](https://developer.apple.com/documentation/technologyoverviews/liquid-glass)
- [HIG: Materials](https://developer.apple.com/design/human-interface-guidelines/materials)
- [WWDC25 Session 219](https://developer.apple.com/videos/play/wwdc2025/219/)
