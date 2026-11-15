# Portfolio — Komlan Thibaut Bassa

Site personnel (projets, écrits, lectures), construit avec Jekyll et hébergé sur GitHub Pages :
**https://thibaut7.github.io**

- **Bilingue** : anglais par défaut (`/`), français sous `/fr/`. Les navigateurs réglés en français
  y sont envoyés automatiquement, et le bouton EN/FR mémorise le choix du visiteur.
- **Aucune compilation à faire** : GitHub reconstruit le site à chaque push sur `main` (1 à 2 minutes).
  Si une modification n'apparaît pas, recharge sans cache (Ctrl+Maj+R / Cmd+Maj+R).

## Où changer quoi

| Je veux… | Fichier |
|---|---|
| Changer mon accroche ou la ligne sur le stage (EN et FR) | `_config.yml` → `accroche`, `stage` |
| Changer mon e-mail, LinkedIn, GitHub, portrait | `_config.yml` |
| Remplacer mon CV | `assets/cv/CV-Komlan-Thibaut-Bassa-EN.pdf` et `-FR.pdf` (garder les mêmes noms) |
| Ajouter / modifier un projet | `_data/projets.yml` (+ vidéo ou image dans `assets/media/`) |
| Ajouter une lecture | `_data/lectures.yml` |
| Changer une citation | `_data/citations.yml` |
| Publier un écrit | un fichier dans `_posts/` → voir **GUIDE-ECRITS.md** |
| Changer un texte de l'interface (menus, titres, boutons) | `_data/i18n.yml` |
| Changer les couleurs, l'arrondi des vignettes | `assets/css/style.css` (variables en haut) |

Chaque texte affiché existe en deux versions, `en:` et `fr:` : pense à modifier les deux.

## Projets

Dans `_data/projets.yml`, chaque projet a un titre, une description (`en` / `fr`), ses technos,
un lien et un **visuel** :

- `type: video` : une courte vidéo **muette en boucle** (`fichier`) et son image de départ (`affiche`).
  Garde-la courte (10–15 s) et légère (moins de 1 Mo).
- `type: image` : une image ou une illustration (`jpg`, `png`, `webp`, `svg`).

Toutes les vignettes ont le même format (4:3) ; une image d'un autre format est recadrée au centre.

## Citations

`_data/citations.yml` contient une citation par endroit : `portrait` (sous la photo), `projets`,
`ecrits` et `lectures`. Chacune a un texte (`en` / `fr`), un auteur et, si besoin, une source.
Supprimer un bloc retire la citation correspondante.

## Carte des visiteurs

La page **Visitors** (`/visitors/`, `/fr/visiteurs/`) affiche une carte du monde des visites.

- Sur chaque page, une fois par session, le script `assets/js/visites.js` estime la ville du visiteur
  (services get.geojs.io, puis ipwho.is) et enregistre **seulement** le pays, la ville et une position
  arrondie (≈ 10 km) dans une base **Supabase**. Aucune adresse IP, aucun nom, aucun cookie.
- Réglages dans `_config.yml` : `supabase_url` et `supabase_cle` (clé *publishable*, faite pour être
  publique). Vider ces deux valeurs désactive le suivi.
- La base n'accepte que l'ajout de visites ; la carte lit des totaux par ville via la fonction
  `carte_visites()`. Pour effacer des visites : Supabase → *Table Editor* → `visites`.
- Le fond de carte est `assets/carte-monde.svg` (projection équirectangulaire, données Natural Earth).
- Ne mets **jamais** dans le site la clé *secret* / *service_role* ni le mot de passe de la base.

## Voir le site sur ton ordinateur (facultatif)

Il faut Ruby. Puis :

```bash
bundle install
bundle exec jekyll serve --drafts
```

et ouvre http://localhost:4000 (`--drafts` affiche aussi les brouillons).

## Structure

```
_config.yml               réglages, infos personnelles, Supabase
_data/                    projets, lectures, citations, textes EN/FR (i18n.yml)
_posts/                   écrits publiés (AAAA-MM-JJ-titre.md)
_drafts/                  brouillons + modèle d'écrit
_layouts/                 gabarits : default, home, ecrit, visitors
_includes/                date (EN/FR), citation
assets/css/style.css      styles
assets/js/visites.js      enregistrement des visites et carte
assets/carte-monde.svg    fond de carte
assets/media/             vidéos et illustrations des projets
assets/cv/                CV en anglais et en français
index.html, fr/           accueil en anglais et en français
visitors/, fr/visiteurs/  carte des visiteurs
```
