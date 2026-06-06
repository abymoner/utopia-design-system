# Space Scale Guide

A fluid space scale generates responsive spacing values (margin, padding, gap)
that interpolate between min/max viewport widths.

## How It Works

A base size (`minSize` / `maxSize`) is multiplied by a series of step
multipliers to produce the full scale. Each resulting size is then made fluid
via `clamp()`.

```
space(n, vw) = base(vw) × multiplier[n]
```

## Configuration

| Property        | Type     | Default                          | Description                    |
|-----------------|----------|----------------------------------|--------------------------------|
| `minSize`       | number   | 8                                | Base size at min viewport (px) |
| `maxSize`       | number   | 12                               | Base size at max viewport (px) |
| `positiveSteps` | number[] | `[1.5, 2, 3, 4, 6]`             | Step multipliers above base    |
| `negativeSteps` | number[] | `[0.5, 0.75]`                    | Step multipliers below base    |
| `customSizes`   | string[] | `[]`                             | Ad-hoc pairs e.g. `["xs-l"]`  |
| `minWidth`      | number   | 375                              | Narrowest viewport (px)        |
| `maxWidth`      | number   | 1440                             | Widest viewport (px)           |
| `relativeTo`    | string   | vw                               | `viewport-width` / `container` |

## Multipliers

Multipliers are raw numbers that scale the base size. Typical values:

| Multiplier | Label | Typical Usage          |
|-----------|-------|------------------------|
| 0.125     | 3xs   | Tiny gap, icon inset   |
| 0.25      | 2xs   | Tight gap, badge       |
| 0.5       | xs    | Small element padding  |
| 0.75      | s     | Compact card padding   |
| 1         | m     | Standard spacing       |
| 1.5       | l     | Section spacing        |
| 2         | xl    | Large section gap      |
| 3         | 2xl   | Page section margin    |
| 4         | 3xl   | Wide page margin       |
| 6         | 4xl   | Major section padding  |

## One-Up Pairs

Adjacent sizes paired together: `xs-s`, `s-m`, `m-l`, `l-xl`, `xl-2xl`.
These represent the minimum of the smaller and maximum of the larger,
creating smooth visual transitions.

## Custom Pairs

Any two labels joined by `-`: `xs-2xl`, `3xs-l`. The script looks up both
sizes and computes a clamp between them.

## Output Example

```css
:root {
  --space-3xs: clamp(0.19rem, 0.08rem + 0.52vw, 0.50rem);
  --space-2xs: clamp(0.38rem, 0.25rem + 0.61vw, 0.75rem);
  --space-xs:  clamp(0.56rem, 0.42rem + 0.70vw, 1.00rem);
  --space-s:   clamp(0.75rem, 0.58rem + 0.87vw, 1.25rem);
  --space-m:   clamp(1.00rem, 0.83rem + 0.87vw, 1.50rem);
  --space-l:   clamp(1.50rem, 1.25rem + 1.30vw, 2.25rem);
  --space-xl:  clamp(2.00rem, 1.65rem + 1.74vw, 3.00rem);
  --space-2xl: clamp(3.00rem, 2.48rem + 2.61vw, 4.50rem);
}
```

## Section Space Scale

A separate fluid space scale for section padding and margins, using larger default multipliers:

| Parameter | Default | Description |
|-----------|---------|-------------|
| `positiveSteps` | `[1.5, 2, 3, 4, 6]` | Step multipliers above base |
| `negativeSteps` | `[0.5, 0.75]` | Step multipliers below base |

Output as `--section-space-{label}` with its own one-up pairs (`--section-space-m-l`, etc.).

## Gutter

A single fluid value for page-level horizontal margins:

```css
--gutter: clamp(1rem, -0.41rem + 6.01vw, 5rem);
```

Configure with `minGutter` (default 16 px) and `maxGutter` (default 80 px) in the config's `gutter` section.

## Content Width

A fluid max-width for the main content container, with a safe variant that accounts for gutters:

```css
--content-width: clamp(40rem, 28.73rem + 48.08vw, 72rem);
--content-width-safe: min(var(--content-width), calc(100% - var(--gutter) * 2));
```

Configure with `minContent` (default 640 px) and `maxContent` (default 1152 px) in the config's `contentWidth` section.

The `--content-width-safe` utility ensures the content never overflows the viewport at any width.
