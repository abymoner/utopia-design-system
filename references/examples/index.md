# Example Library

Bibliothèque de pages de démonstration montrant différentes configurations
d'échelles fluides produites par le skill `utopia-design-system`.

Chaque page suit le même standard :

| Section | Contenu |
|---------|---------|
| Hero | Échelle + tagline + métadonnées de configuration |
| Content | Cartes expliquant les caractéristiques de l'échelle |
| Type showcase | Tous les steps typographiques en direct (redimensionnable) |
| Space demo | Barres dont la largeur est liée aux tokens `--space-*` |
| Tokens | Panneau pliable listant tous les tokens CSS générés |

## Catalogue

| Page | Scale | Ratio | Base | Steps | Espacement | Theme |
|------|-------|-------|------|-------|------------|-------|
| [Moderna](./moderne.html) | perfect-fourth | 1.333 | 16→20 px | −2 à 5 (8) | 10 tokens | Clair, sobre |
| [Expressiva](./expressif.html) | golden-ratio | 1.618 | 18→24 px | −1 à 6 (8) | 12 tokens | Sombre, dramatique |
| [Kinetic](./kinetic.html) | minor-third → augmented-fourth | 1.2 → 1.414 | 16→20 px | −2 à 5 (8) | 11 tokens | Terracotta, éditorial |

## Ajouter un exemple

Après chaque génération de design system, le skill demande à l'utilisateur
si la configuration doit être ajoutée à la bibliothèque. Pour ajouter une
page manuellement :

1. Copier le template depuis une page existante
2. Remplacer les tokens CSS dans `:root`
3. Mettre à jour le config header (scale, base, viewport)
4. Ajuster les démos si nécessaire (labels de steps, espacements)
5. Ajouter l'entrée dans ce catalogue

### Convention de nommage

```
{kebab-name}.html
```

Exemples : `moderne.html`, `expressif.html`, `augmented-editorial.html`.
