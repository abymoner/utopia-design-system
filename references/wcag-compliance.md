# WCAG Compliance

## WCAG 1.4.4 — Resize Text

> Except for captions and images of text, text can be resized without
> assistive technology up to 200 percent without loss of content or
> functionality. (Level AA)

In fluid typography, this means a user zooming to 200% at a 500% viewport
width must see text at least 2× larger than at 100% zoom.

## How the Check Works

The algorithm (credit: Maxwell Barvian, fluid.style) models the font size
at 500% viewport zoom and compares it to 2× the font size at 100% zoom.

It solves the piecewise inequality:

```
z5 < 2 × z1
```

Where `z5` is the font at 500% zoom and `z1` at 100% zoom. If any viewport
range fails this inequality, a **WCAG violation** is reported.

## Reading Violation Output

```json
{
  "wcagViolation": {
    "from": 1024,
    "to": 1440
  }
}
```

This means text may be too small between 1024 px and 1440 px viewport width
at 500% zoom. Consider:

- Reducing the max scale ratio
- Increasing the base font size at the max viewport
- Adding a mid-viewport breakpoint

## Prevention Strategies

1. **Keep scales moderate** — ratios above 1.5 are more likely to violate
2. **Use smaller positive steps** — 4 or fewer large heading steps
3. **Narrow the font-size range** — `minFontSize` closer to `maxFontSize`
4. **Use `relativeTo: "container"`** — container queries can reduce violation range
5. **Test with `--check-wcag`** flag before deploying

## Note

When `minWidth > maxWidth` (inverted responsive), the check flips the
coordinates internally so the same algorithm applies.
