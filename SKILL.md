---
name: utopia-design-system
description: Génère un design system fluide complet avec échelles typographiques et espacements Utopia. Utilisez quand l'utilisateur demande "génère un design system", "calcule une échelle typographique fluide", "crée des tokens CSS fluides", "Utopia", "fluid type", "clamp", "design tokens".
---

# Utopia Design System Generator

## Overview

Génère des design tokens fluides basés sur la méthode Utopia (`clamp()`).
Produit des échelles typographiques (type scale) et d'espacement (space scale)
qui s'adaptent fluidement entre deux largeurs d'écran.

Nouveautés v2 :
- **Crossover pairs** — valeurs fluides entre deux steps adjacents
- **Labels sémantiques** — `--text-xs`, `--text-m`, `--h1`, etc.
- **Section spacing** — échelle d'espacement dédiée aux sections
- **Gutter fluide** — marge latérale responsive
- **Content width** — largeur max du conteneur

Trois entrées possibles :

- **Assistant interactif** — L'agent pose les questions à l'utilisateur une par une
- **Via config file** — L'agent construit un fichier JSON de configuration et exécute le script
- **Bibliothèque d'exemples** — L'agent peut montrer des pages existantes à l'utilisateur pour l'inspirer avant de générer son propre design system

## Ressources

| Ressource | Chemin |
|-----------|--------|
| Script de calcul | `scripts/calculate.mjs` |
| Générateur de tokens | `scripts/generate-tokens.mjs` |
| Base des échelles | `scripts/scales.json` |
| Guide des échelles musicales | `references/musical-scales.md` |
| Guide type scale | `references/type-scale-guide.md` |
| Guide space scale | `references/space-scale-guide.md` |
| Conformité WCAG | `references/wcag-compliance.md` |
| Exemples | `references/examples.md` |
| Bibliothèque d'exemples | `references/examples/index.md` |
| Template CSS | `assets/css-template.css` |
| Template Tailwind | `assets/tailwind-config.js` |
| Template SCSS | `assets/scss-template.scss` |

## On Activation

### 0. (Optionnel) Suggérer la bibliothèque d'exemples

Avant de lancer la génération, l'agent PEUT proposer à l'utilisateur :

```
Je peux générer un design system fluide pour vous.
Voulez-vous d'abord voir des exemples de rendus avec différentes échelles ?

Pages disponibles :
  • Moderna     — perfect-fourth (1.333)            — sobre, clair
  • Expressiva  — golden-ratio (1.618)              — dramatique, sombre
  • Kinetic     — minor-third → augmented-fourth    — terracotta, éditorial

Ou on commence directement ?
```

### 1. Demander l'échelle musicale

L'agent DOIT d'abord demander à l'utilisateur quelle échelle utiliser :

```
Quelle échelle typographique souhaitez-vous utiliser ?

Échelles disponibles :

  minor-second      1.067  — Subtile, pour UIs denses
  major-second      1.125  — Très subtile, interfaces texte
  minor-third       1.200  — Harmonieuse, usage général
  major-third       1.250  — Intervalle clair, équilibré
  perfect-fourth    1.333  — Audacieuse, hiérarchie claire
  augmented-fourth  1.414  — Saut dramatique, éditorial
  perfect-fifth     1.500  — Très contrastée, forte hiérarchie
  golden-ratio      1.618  — Proportion naturelle (φ)
  minor-sixth       1.600  — Large gamme expressive
  major-sixth       1.667  — Très large, dramatique
  octave            2.000  — Contraste extrême, monumental

Ou entrez une valeur numérique personnalisée (ex: 1.15, 1.35).
```

L'utilisateur peut aussi donner directement une valeur comme `1.2` au lieu d'un nom. Le script `resolveScale()` dans `generate-tokens.mjs` gère les deux.

**Conseil** : Si l'utilisateur hésite, recommander `perfect-fourth` (1.333) pour un site moderne ou `minor-third` (1.2) pour une application de texte.

### 2. Demander les autres paramètres

Après l'échelle, poser les questions suivantes (avec valeurs par défaut) :

| Paramètre | Défaut | Question |
|-----------|--------|----------|
| Min viewport | 375 px | Largeur d'écran minimale ? |
| Max viewport | 1440 px | Largeur d'écran maximale ? |
| Min font-size | 16 px | Taille de police de base minimale ? |
| Max font-size | 20 px | Taille de police de base maximale ? |
| Pas négatifs | 2 | Combien de pas en dessous de la base ? |
| Pas positifs | 5 | Combien de pas au-dessus de la base ? |
| Space scale | Oui | Générer une échelle d'espacement ? |
| Section space | Oui | Générer une échelle d'espacement sections ? |
| Gutter | Oui | Générer une marge latérale fluide ? |
| Content width | Oui | Générer une largeur max de conteneur fluide ? |
| Format | CSS | CSS / Tailwind / SCSS / JSON ? |

### 3. Exécuter le script

Construire le fichier de configuration JSON et lancer :

```bash
node {skill-root}/scripts/generate-tokens.mjs config.json
```

Configuration complète (toutes les fonctionnalités) :

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

### 4. Écrire les tokens dans le projet

Selon le format choisi :

- **CSS** → `{project}/src/styles/design-tokens.css`
- **Tailwind** → `{project}/tailwind.config.js` (extend)
- **SCSS** → `{project}/src/styles/_tokens.scss`
- **JSON** → `{project}/design-tokens.json`

### 5. Auto-amélioration — ajouter à la bibliothèque

Après avoir généré un design system, vérifier si une page d'exemple avec cette configuration exacte existe déjà dans `references/examples/index.md`.

**Si elle n'existe pas**, demander à l'utilisateur :

```
Ce design system (scale: {name}, ratio: {value}, base: {minFS}→{maxFS} px)
n'existe pas encore dans la bibliothèque d'exemples du skill.

Souhaitez-vous que je génère une page de démonstration et l'ajoute ?
[Cette page sera utile pour vos projets futurs et pour les autres
utilisateurs du skill.]

1) Oui, ajouter à la bibliothèque
2) Non, merci
```

#### Procédure d'ajout

Si l'utilisateur accepte (option 1) :

1. Générer le JSON complet de la configuration utilisée
2. Construire une page HTML en suivant le template standard des pages d'exemple :
   - Hero avec la config en header
   - Section content avec 3 cartes expliquant les caractéristiques
   - Type showcase avec tous les steps
   - Space demo avec barres fluides
   - Panneau de tokens pliable
   - Footer avec métadonnées de config
3. Sauvegarder dans `{skill-root}/references/examples/{name}.html`
4. Ajouter une entrée dans `{skill-root}/references/examples/index.md` :
   ```
   | [{Name}](./examples/{name}.html) | {scale-name} | {ratio} | {minFS}→{maxFS} px | {steps} | {theme} |
   ```

> **Note d'implémentation** : La page peut être générée en modifiant le template d'une page existante (copier le HTML, remplacer les tokens dans `:root` et les métadonnées). Le script `generate-tokens.mjs` en mode JSON fournit toutes les données nécessaires.

## Utilisation programmatique

L'agent peut aussi importer `calculate.mjs` directement :

```js
import { calculateTypeScale, calculateSpaceScale } from '{skill-root}/scripts/calculate.mjs';

const steps = calculateTypeScale({
  minWidth: 375,
  maxWidth: 1440,
  minFontSize: 16,
  maxFontSize: 20,
  minTypeScale: 1.2,
  maxTypeScale: 1.333,
  negativeSteps: 2,
  positiveSteps: 5
});

steps.forEach(step => {
  console.log(`--font-size-${step.label}: ${step.clamp};`);
});
```

## Fonctions exportées (calculate.mjs)

| Fonction | Description |
|----------|-------------|
| `calculateClamp(opts)` | Calcule une valeur `clamp()` unique |
| `calculateClamps(opts)` | Calcule plusieurs clamps depuis des paires |
| `calculateTypeScale(config)` | Calcule une échelle typographique complète |
| `calculateSpaceScale(config)` | Calcule une échelle d'espacement complète |
| `calculateSectionSpaceScale(config)` | Calcule une échelle d'espacement sections |
| `calculateTypeCrossoverPairs(steps)` | Génère les paires de transition entre steps |
| `calculateTextLabels(steps)` | Génère les alias sémantiques --text-* |
| `calculateHeadingLabels(steps)` | Génère les alias sémantiques --h1..h6 |
| `calculateGutter(config)` | Calcule une marge latérale fluide |
| `calculateContentWidth(config)` | Calcule une largeur max de conteneur fluide |
| `checkWCAG(opts)` | Vérifie la conformité WCAG 1.4.4 |

## Échelles musicales (scales.json)

Le fichier `scripts/scales.json` contient toutes les échelles nommées avec leur valeur, description et catégorie. L'agent peut le lire pour présenter les options à l'utilisateur.

```js
const scales = JSON.parse(fs.readFileSync('{skill-root}/scripts/scales.json'));
```

## Formats de sortie

### CSS Custom Properties
```css
:root {
  --font-size-0: clamp(1.00rem, 0.83rem + 0.87vw, 1.50rem);
  --text-m: clamp(1.00rem, 0.83rem + 0.87vw, 1.50rem);
  --h1: clamp(2.89rem, 2.39rem + 1.53vw, 4.21rem);
  --space-m: clamp(1.00rem, 0.83rem + 0.87vw, 1.50rem);
  --section-space-xl: clamp(2.00rem, 1.65rem + 1.74vw, 3.00rem);
  --gutter: clamp(1.00rem, -0.41rem + 6.01vw, 5.00rem);
  --content-width: clamp(40rem, 28.73rem + 48.08vw, 72rem);
}
```

### Tailwind Config
```js
fontSize: { 'm': 'clamp(...)', 'xl': 'clamp(...)' },
spacing: { 'm': 'clamp(...)', 'section-xl': 'clamp(...)', 'gutter': 'clamp(...)' }
```

### SCSS Variables
```scss
$font-size-0: clamp(1.00rem, 0.83rem + 0.87vw, 1.50rem);
$space-m: clamp(1.00rem, 0.83rem + 0.87vw, 1.50rem);
$section-space-xl: clamp(2.00rem, 1.65rem + 1.74vw, 3.00rem);
```

### JSON (données structurées)
```json
{
  "typeSteps": [{ "step": 0, "label": "0", "clamp": "..." }],
  "spaceScale": { "sizes": [...], "oneUpPairs": [...], "customPairs": [...] },
  "sectionSpace": { "sizes": [...], "oneUpPairs": [...] },
  "textLabels": [{ "label": "m", "clamp": "..." }],
  "headingLabels": [{ "label": "h1", "clamp": "..." }],
  "gutter": { "label": "gutter", "clamp": "..." },
  "contentWidth": { "label": "content-width", "clamp": "..." }
}
```
