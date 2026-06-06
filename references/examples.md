# Examples

Deux types d'exemples sont disponibles :

## Bibliothèque de pages de démonstration

Des pages HTML complètes avec hero, contenu, type showcase, espacements
visuels, et panneau de tokens générés. Ouvrez-les dans un navigateur et
redimensionnez la fenêtre pour voir la fluidité en action.

→ **[Accéder à la bibliothèque d'exemples](./examples/index.md)**

### Pages disponibles

| Page | Scale | Ratio | Base | Steps | Theme |
|------|-------|-------|------|-------|-------|
| [Moderna](./examples/moderne.html) | perfect-fourth | 1.333 | 16→20 px | −2 à 5 | Clair |
| [Expressiva](./examples/expressif.html) | golden-ratio | 1.618 | 18→24 px | −1 à 6 | Sombre |
| [Kinetic](./examples/kinetic.html) | minor-third → aug-fourth | 1.2 → 1.414 | 16→20 px | −2 à 5 | Terracotta |

## Exemples de configuration (CLI)

### Minimal Config

```bash
node scripts/generate-tokens.mjs <<'EOF'
{
  "type": {
    "minTypeScale": "minor-third",
    "maxTypeScale": "perfect-fourth",
    "minFontSize": 16,
    "maxFontSize": 20,
    "negativeSteps": 2,
    "positiveSteps": 4,
    "minWidth": 375,
    "maxWidth": 1440
  },
  "space": {
    "minSize": 8,
    "maxSize": 12,
    "positiveSteps": [1.5, 2, 3, 4, 6],
    "negativeSteps": [0.5, 0.75]
  },
  "format": "css"
}
EOF
```

### Container-Queried Type

```json
{
  "type": {
    "relativeTo": "container",
    "minTypeScale": 1.2,
    "maxTypeScale": 1.333,
    "minFontSize": 16,
    "maxFontSize": 20,
    "minWidth": 300,
    "maxWidth": 1200,
    "negativeSteps": 1,
    "positiveSteps": 3
  },
  "format": "tailwind"
}
```

### Aggressive Editorial Scale

```json
{
  "type": {
    "minTypeScale": 1.25,
    "maxTypeScale": 1.618,
    "minFontSize": 18,
    "maxFontSize": 24,
    "positiveSteps": 6,
    "negativeSteps": 1,
    "minWidth": 375,
    "maxWidth": 1600
  },
  "format": "scss"
}
```

### Custom Clamp Pairs

```json
{
  "clamps": {
    "minWidth": 375,
    "maxWidth": 1440,
    "pairs": [[16, 24], [32, 48], [64, 96]]
  },
  "format": "css"
}
```

### Interactive Mode

```bash
node scripts/generate-tokens.mjs
```

The script will ask for each parameter with sensible defaults.

### Full Design System (with Section Space, Gutter, Content Width)

```json
{
  "type": {
    "minTypeScale": "perfect-fourth",
    "maxTypeScale": 1.333,
    "minFontSize": 16,
    "maxFontSize": 20,
    "negativeSteps": 2,
    "positiveSteps": 5,
    "minWidth": 375,
    "maxWidth": 1440
  },
  "space": {
    "minSize": 8,
    "maxSize": 12,
    "positiveSteps": [1.5, 2, 3, 4, 6],
    "negativeSteps": [0.5, 0.75]
  },
  "sectionSpace": {},
  "gutter": { "minGutter": 16, "maxGutter": 80 },
  "contentWidth": { "minContent": 640, "maxContent": 1152 },
  "format": "css"
}
```
