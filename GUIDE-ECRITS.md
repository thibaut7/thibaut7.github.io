# Publier un écrit

Un écrit = **un fichier Markdown dans le dossier `_posts/`**.
Dès que le fichier est sur GitHub, le site se reconstruit tout seul (1 à 2 minutes) :
le texte apparaît dans la partie **Écrits** de l'accueil, avec sa date, et il a sa propre page.

## 1. Le nom du fichier

```
_posts/AAAA-MM-JJ-titre-court.md
```

- `AAAA-MM-JJ` : la date du texte (ex. `2026-11-20`).
- `titre-court` : en minuscules, sans accents ni espaces, mots séparés par des tirets.
  Il devient l'adresse de la page : `…/ecrits/titre-court/`.

Exemple : `_posts/2026-11-20-pourquoi-j-ecris.md`

⚠️ Sans la date au début du nom, le fichier est ignoré.

## 2. L'en-tête du fichier

Tout en haut du fichier, entre deux lignes de trois tirets :

```markdown
---
title: "Pourquoi j'écris"
date: 2026-11-20
categorie: essai
resume: "Une phrase qui donne envie de lire."
---
```

| Champ | Obligatoire | Rôle |
|---|---|---|
| `title` | oui | Le titre, entre guillemets |
| `date` | conseillé | La date affichée (« 20 novembre 2026 »). Sinon, celle du nom du fichier |
| `categorie` | non | Un mot affiché à côté de la date : essai, note, nouvelle… |
| `resume` | non | La phrase sous le titre. Sans elle, le site prend le début du texte |

## 3. Le texte

Sous l'en-tête, écris en Markdown normal : paragraphes séparés par une ligne vide,
`## Intertitre`, `*italique*`, `**gras**`, `> citation`, listes avec `-`, `[lien](https://…)`.

Pour une image : mets le fichier dans `assets/img/`, puis écris
`![description](/assets/img/nom-du-fichier.jpg)`.

Le fichier `_drafts/modele-d-ecrit.md` montre tout ça : copie-le pour démarrer.

## 4. Publier

**Depuis le site GitHub (le plus simple) :** ouvre ton dépôt, entre dans `_posts`,
clique sur *Add file → Create new file*, donne le nom (`2026-11-20-titre.md`),
colle ton texte, puis *Commit changes*.

**Depuis ton ordinateur :**

```bash
git add _posts/2026-11-20-titre.md
git commit -m "Nouvel écrit : titre"
git push
```

## Brouillons

Un texte pas encore prêt va dans `_drafts/` (sans date dans le nom) : il n'est pas publié.
Quand il est prêt, déplace-le dans `_posts/` en ajoutant la date devant le nom.

## Bon à savoir

- Les écrits sont classés du plus récent au plus ancien.
- Une date dans le futur : le texte n'apparaît qu'à partir de ce jour-là, au prochain push.
- Pour retirer un texte, supprime son fichier.
