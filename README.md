# Utopia Design System — Agent Skill

Générateur de design systems fluides pour agents d'IA (opencode).

Produit des échelles typographiques et d'espacement responsives via `clamp()`, basées sur la [méthode Utopia](https://utopia.fyi) de James Gilyead & Trys Mudford.

## Architecture

```
├── SKILL.md                    # Instructions exécutables pour l'agent
├── scripts/
│   ├── calculate.mjs           # Moteur mathématique (clamp, type scale, space scale, WCAG)
│   ├── generate-tokens.mjs     # CLI interactive + pipeline config→tokens
│   └── scales.json             # 11 échelles musicales (minor-second → octave)
├── assets/
│   ├── css-template.css        # Template CSS avec custom properties + utilitaires
│   ├── scss-template.scss      # Template SCSS avec variables + mixins
│   └── tailwind-config.js      # Template Tailwind (fontSize, spacing, gap)
├── references/
│   ├── type-scale-guide.md     # Documentation complète des échelles typo
│   ├── space-scale-guide.md    # Documentation complète des échelles d'espacement
│   ├── musical-scales.md       # Guide des ratios musicaux et leur usage
│   ├── wcag-compliance.md      # Vérification WCAG 1.4.4 (Resize Text)
│   ├── examples.md             # Exemples de configuration CLI
│   └── examples/               # Pages de démonstration HTML
│       ├── index.md            # Catalogue des exemples
│       ├── moderne.html        # perfect-fourth, thème clair
│       ├── expressif.html      # golden-ratio, thème sombre
│       └── kinetic.html        # minor-third → aug-fourth, terracotta
```

## Usage

### Via agent (mode skill)

Le skill `utopia-design-system` guide l'agent à travers un assistant interactif :

1. L'agent propose de voir des exemples existants
2. Demande l'échelle musicale (`perfect-fourth`, `golden-ratio`, etc.)
3. Collecte les paramètres (viewport, font-size, steps, format)
4. Exécute `generate-tokens.mjs` avec la configuration
5. Écrit les tokens dans le projet (CSS / Tailwind / SCSS / JSON)
6. Propose d'ajouter la config à la bibliothèque d'exemples

### Via CLI directe

```bash
# Mode interactif
node scripts/generate-tokens.mjs

# Via fichier JSON
node scripts/generate-tokens.mjs config.json

# Via JSON inline
node scripts/generate-tokens.mjs --config '{"format":"tailwind","type":{"minTypeScale":"perfect-fourth"}}'
```

### Via API (import ES)

```js
import {
  calculateTypeScale, calculateSpaceScale, calculateSectionSpaceScale,
  calculateTypeCrossoverPairs, calculateTextLabels, calculateHeadingLabels,
  calculateGutter, calculateContentWidth, checkWCAG
} from './scripts/calculate.mjs';

const steps = calculateTypeScale({
  minWidth: 375, maxWidth: 1440,
  minFontSize: 16, maxFontSize: 20,
  minTypeScale: 1.2, maxTypeScale: 1.333,
  negativeSteps: 2, positiveSteps: 5
});
```

## Tokens générés

| Catégorie | Exemple | Description |
|-----------|---------|-------------|
| Type scale | `--font-size-0: clamp(...)` | Steps numérotés (-2 à 5) |
| Text labels | `--text-m: clamp(...)` | Aliases sémantiques (xs → xxl) |
| Heading labels | `--h1: clamp(...)` | Tailles de titres (h1 → h6) |
| Crossover pairs | `--font-size-1-to-0: clamp(...)` | Transitions entre steps adjacents |
| Space scale | `--space-m: clamp(...)` | Labels sémantiques (xs → 4xl) |
| One-up pairs | `--space-m-l: clamp(...)` | Transitions entre espacements |
| Section space | `--section-space-xl: clamp(...)` | Espacement dédié aux sections |
| Gutter | `--gutter: clamp(...)` | Marge latérale fluide |
| Content width | `--content-width: clamp(...)` | Largeur max du conteneur |

## Formats de sortie

| Format | Syntaxe | Usage |
|--------|---------|-------|
| CSS | `--font-size-0: clamp(...)` | Custom properties |
| Tailwind | `theme.extend.fontSize` / `spacing` | `tailwind.config.js` |
| SCSS | `$font-size-0: clamp(...)` | Variables + mixins |
| JSON | Structuré (steps, pairs) | Post-traitement |

## Échelles disponibles

| Nom | Ratio | Caractère |
|-----|-------|-----------|
| minor-second | 1.067 | Subtile, UIs denses |
| major-second | 1.125 | Interfaces texte |
| minor-third | 1.200 | Harmonieuse, généraliste |
| major-third | 1.250 | Intervalle clair |
| **perfect-fourth** | **1.333** | **Audacieuse, moderne** |
| augmented-fourth | 1.414 | Saut dramatique |
| perfect-fifth | 1.500 | Très contrastée |
| golden-ratio | 1.618 | Proportion naturelle (φ) |
| octave | 2.000 | Contraste extrême |

## WCAG 1.4.4

Chaque step typographique est automatiquement vérifié contre le critère « Resize Text ». Les violations avec leur plage de viewport sont rapportées dans les données de sortie.
