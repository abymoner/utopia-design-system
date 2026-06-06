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
| `positiveSteps` | number[] | `[0.5, 1, 1.5, 2, 3, 4, 6]`    | Step multipliers above base    |
| `negativeSteps` | number[] | `[0.25]`                         | Step multipliers below base    |
| `customSizes`   | string[] | `[]`                             | Ad-hoc pairs e.g. `["xs-l"]`  |
| `minWidth`      | number   | 375                              | Narrowest viewport (px)        |
| `maxWidth`      | number   | 1440                             | Widest viewport (px)           |
| `relativeTo`    | string   | vw                               | `viewport-width` / `container` |

## Multipliers

Multipliers are raw numbers that scale the base size. Typical values:

| Multiplier | Label | Typical Usage          |
|-----------|-------|------------------------|
| 0.25      | 3xs   | Tiny gap, icon inset   |
| 0.5       | 2xs   | Tight gap, badge       |
| 1         | xs    | Small element padding  |
| 1.5       | s     | Compact card padding   |
| 2         | m     | Standard spacing       |
| 3         | l     | Section spacing        |
| 4         | xl    | Large section gap      |
| 6         | 2xl   | Page section margin    |

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
