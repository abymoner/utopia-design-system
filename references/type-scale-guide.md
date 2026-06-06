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

## Crossover Pairs

Adjacent type steps can be paired to create smooth transitions between sizes:

```css
--font-size-5-to-4: clamp(3.16rem, 2.42rem + 3.16vw, 5.26rem);
--font-size-4-to-3: clamp(2.37rem, 1.81rem + 2.37vw, 3.95rem);
--font-size-1-to-0: clamp(1.00rem, 0.77rem + 1.00vw, 1.67rem);
--font-size-0-to--1: clamp(0.75rem, 0.57rem + 0.75vw, 1.25rem);
```

Each pair interpolates from the minimum of the smaller step to the maximum of the larger step, creating a fluid transition between two adjacent sizes.

## Semantic Labels

In addition to the numbered type scale steps, the generator produces semantic aliases for common use cases.

### Text Sizes (`--text-*`)

| Token | Maps to step | Usage |
|-------|-------------|-------|
| `--text-xs` | -2 | Fine print, captions |
| `--text-s` | -1 | Small text, metadata |
| `--text-m` | 0 | Body text (base) |
| `--text-l` | 1 | Large body, intro text |
| `--text-xl` | 2 | Subheadings |
| `--text-xxl` | 3 | Small headings |

### Heading Sizes (`--h1` through `--h6`)

| Token | Maps to step | Usage |
|-------|-------------|-------|
| `--h6` | -1 | Section headers |
| `--h5` | 0 | Card titles |
| `--h4` | 1 | Subsection headings |
| `--h3` | 2 | Section headings |
| `--h2` | 3 | Major section headings |
| `--h1` | 4 | Page title, hero |

### Heading Crossover Pairs

Adjacent heading sizes can also be paired:

```css
--h6-to-h5: clamp(0.75rem, 0.57rem + 0.75vw, 1.25rem);
--h2-to-h1: clamp(2.37rem, 1.81rem + 2.37vw, 3.95rem);
```

## Configuration

Toggle these features with boolean flags in the config:

| Property | Default | Description |
|----------|---------|-------------|
| `enableCrossoverPairs` | true | Generate type crossover pairs |
| `enableTextLabels` | true | Generate semantic text/heading labels |
| `enableHeadingPairs` | true | Generate heading crossover pairs |

## WCAG Compliance

Each step is checked against WCAG 1.4.4 (text resize up to 200% at 500% zoom).
If a violation is detected, the failure viewport range is reported.
