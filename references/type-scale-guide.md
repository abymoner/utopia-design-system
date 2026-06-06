# Type Scale Guide

A fluid type scale generates responsive font sizes that interpolate smoothly
between a minimum and maximum viewport.

## How It Works

Each step in the scale is computed as:

```
font-size(step, vw) = base-font(vw) × scale(vw) ^ step
```

Both `base-font` and `scale` are themselves fluid — they interpolate between
min/max values across the viewport range. Every step inherits this fluidity.

## Configuration

| Property        | Type    | Default | Description                            |
|-----------------|---------|---------|----------------------------------------|
| `minFontSize`   | number  | 16      | Base font size at min viewport (px)    |
| `maxFontSize`   | number  | 20      | Base font size at max viewport (px)    |
| `minTypeScale`  | number  | 1.2     | Scale ratio at min viewport            |
| `maxTypeScale`  | number  | 1.333   | Scale ratio at max viewport            |
| `negativeSteps` | number  | 2       | Steps smaller than base (−1, −2, …)    |
| `positiveSteps` | number  | 5       | Steps larger than base (1, 2, … 5)     |
| `minWidth`      | number  | 375     | Narrowest viewport (px)                |
| `maxWidth`      | number  | 1440    | Widest viewport (px)                   |
| `relativeTo`    | string  | vw      | `viewport-width` / `viewport` / `container` |
| `labelStyle`    | string  | utopia  | `utopia` / `tailwind` / `tshirt`       |

## Output Example

```css
:root {
  --font-size--2: clamp(0.64rem, 0.45rem + 0.93vw, 1.11rem);
  --font-size--1: clamp(0.80rem, 0.61rem + 0.93vw, 1.33rem);
  --font-size-0:  clamp(1.00rem, 0.83rem + 0.87vw, 1.50rem);
  --font-size-1:  clamp(1.25rem, 1.08rem + 0.84vw, 1.80rem);
  --font-size-2:  clamp(1.56rem, 1.39rem + 0.85vw, 2.17rem);
}
```

## Naming Conventions

### Utopia (default)
Steps are numbered: `-2`, `-1`, `0`, `1`, `2`, `3xl`, `4xl`, `5xl`.

### Tailwind
Maps to semantic names: `xs`, `sm`, `base`, `lg`, `xl`, `2xl`, `3xl`, `4xl`.

### T-Shirt
Compact: `2xs`, `xs`, `s`, `m`, `l`, `xl`, `2xl`, `3xl`.

## WCAG Compliance

Each step is checked against WCAG 1.4.4 (text resize up to 200% at 500% zoom).
If a violation is detected, the failure viewport range is reported.
