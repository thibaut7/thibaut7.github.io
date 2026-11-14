# Portfolio — Komlan Thibaut Bassa

Site personnel (projets, écrits, lectures), construit avec Jekyll et hébergé sur GitHub Pages.
En anglais par défaut (`/`), en français sous `/fr/` : les navigateurs réglés en français y sont
envoyés automatiquement, et le bouton EN/FR mémorise le choix du visiteur.
Aucune compilation à faire : GitHub construit le site à chaque push.

## Où changer quoi

| Je veux… | Fichier |
|---|---|
| Changer mon accroche, la ligne stage, mon e-mail, LinkedIn, CV, portrait | `_config.yml` |
| Changer un texte de l'interface (menus, titres) en anglais ou en français | `_data/i18n.yml` |
| Carte des visiteurs (identifiant MapMyVisitors) | `_config.yml` → `carte_visiteurs_id` |
| Ajouter / modifier un projet | `_data/projets.yml` (+ média dans `assets/media/`) |
| Ajouter une lecture | `_data/lectures.yml` |
| Publier un écrit | un fichier dans `_posts/` → voir **GUIDE-ECRITS.md** |
| Changer les couleurs, l'arrondi des vignettes | `assets/css/style.css` (variables en haut) |

## Mettre en ligne (première fois)

1. Mets le contenu de ce dossier à la racine du dépôt **`thibaut7.github.io`**
   (il remplace l'ancien contenu).
2. Sur GitHub : *Settings → Pages → Build and deployment* :
   Source = **Deploy from a branch**, branche **main**, dossier **/ (root)**.
3. Après 1 à 2 minutes, le site est sur **https://thibaut7.github.io**.

## Voir le site sur ton ordinateur (facultatif)

Il faut Ruby. Puis :

```bash
bundle install
bundle exec jekyll serve --drafts
```

et ouvre http://localhost:4000 (`--drafts` affiche aussi les brouillons).

## Structure

```
_config.yml          réglages et infos personnelles
_data/               projets, lectures, textes EN/FR (i18n.yml)
_posts/              tes écrits publiés (AAAA-MM-JJ-titre.md)
_drafts/             brouillons + modèle d'écrit
_layouts/            gabarits (page, écrit)
_includes/date.html  affichage des dates en français
assets/              CSS, vidéos, images
index.html, fr/       accueil en anglais et en français
visitors/, fr/visiteurs/  page de la carte des visiteurs
```
