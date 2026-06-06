# Musical Scales Reference

Fluid type scales borrow interval names from Western music theory. Each named
scale represents a ratio between successive steps in the type hierarchy.

## Quick Reference

| Name               | Ratio  | Character                  | Best For                        |
|--------------------|--------|----------------------------|----------------------------------|
| Minor Second       | 1.067  | Subtle, barely perceptible | Data dashboards, dense UIs       |
| Major Second       | 1.125  | Very subtle                | Text-heavy interfaces            |
| Minor Third        | 1.200  | Pleasant, harmonious       | Body text systems, general UI    |
| Major Third        | 1.250  | Clear interval             | Balanced editorial               |
| Perfect Fourth     | 1.333  | Bold, clear hierarchy      | Modern web, marketing sites      |
| Augmented Fourth   | 1.414  | Dramatic leap              | Editorial layouts, portfolios    |
| Perfect Fifth      | 1.500  | Very bold                  | Strong hierarchy, posters        |
| Golden Ratio (φ)   | 1.618  | Natural proportion         | Maximum aesthetic contrast       |
| Minor Sixth        | 1.600  | Wide expressive range      | Dramatic typography              |
| Major Sixth        | 1.667  | Very wide spacing          | Hero sections, landing pages     |
| Octave             | 2.000  | Extreme contrast           | Poster-like, monumental scale    |

## Scale Categories

### Diatonic (1.067 – 1.125)
Smallest intervals. Use when you need many levels without overwhelming
contrast. Good for technical documentation and data-rich applications.

### Tertian (1.200 – 1.250)
Based on thirds — the building blocks of Western harmony. Natural feel that
works across most applications.

### Quartal (1.333 – 1.414)
Based on fourths. Noticeable contrast. Popular in modern web design for
creating clear editorial hierarchy.

### Quintal / Special (1.500+)
Bold intervals for expressive or poster-like layouts. Use sparingly —
reserve for headings and hero text.

## How Scale Affects Clamps

A larger scale ratio → steeper slope between viewport breakpoints
→ more dramatic size change. Combined with `minFontSize`/`maxFontSize`,
the scale determines how quickly each step grows relative to the one below it.

```
font-step(n) = base-font × scale^n
```

Both `base-font` and `scale` are interpolated between min/max viewport,
creating a **fluid type scale** where every step is itself fluid.

## Custom Values

Any positive number can be used as a scale. Common custom values:
- `1.0` — no scaling, all steps equal
- `1.15` — between major-second and minor-third
- `1.275` — between major-third and perfect-fourth
- `1.45` — between augmented-fourth and perfect-fifth

## In the Script

Pass by name or value:

```json
{
  "type": {
    "minTypeScale": "perfect-fourth",
    "maxTypeScale": "golden-ratio"
  }
}
```

```json
{
  "type": {
    "minTypeScale": 1.333,
    "maxTypeScale": 1.618
  }
}
```

Using different min/max scales creates a **dynamic ratio** that tightens or
amplifies across viewports.
