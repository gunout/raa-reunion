# 🇷🇪 RAA Réunion Monitor

### Dashboard de veille des Recueils des Actes Administratifs de La Réunion (974)

[![Préfecture](https://img.shields.io/badge/Préfecture-La%20Réunion-0d7a8a?style=for-the-badge)](https://www.reunion.gouv.fr/)
[![Département](https://img.shields.io/badge/Département-974-c0392b?style=for-the-badge)](https://www.reunion.gouv.fr/)
[![Région](https://img.shields.io/badge/Région-La%20Réunion-0d7a8a?style=for-the-badge)](https://www.reunion.gouv.fr/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-000091?style=for-the-badge)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-ffb800?style=for-the-badge)]()
[![Statut](https://img.shields.io/badge/statut-actif-00a95f?style=for-the-badge)]()

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)]()
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)]()
[![DSFR](https://img.shields.io/badge/DSFR-1.12.1-000091?style=flat-square)](https://www.systeme-de-design.gouv.fr/)
[![Cheerio](https://img.shields.io/badge/Cheerio-1.0-E88C1C?style=flat-square)]()
[![PRs](https://img.shields.io/badge/PRs-welcome-00a95f?style=flat-square)](https://github.com/gunout/raa-reunion/pulls)

[![GitHub stars](https://img.shields.io/github/stars/gunout/raa-reunion?style=social)](https://github.com/gunout/raa-reunion/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/gunout/raa-reunion?style=social)](https://github.com/gunout/raa-reunion/network/members)
[![GitHub issues](https://img.shields.io/github/issues/gunout/raa-reunion?style=flat-square)](https://github.com/gunout/raa-reunion/issues)
[![GitHub last commit](https://img.shields.io/github/last-commit/gunout/raa-reunion?style=flat-square)](https://github.com/gunout/raa-reunion/commits/main)
[![GitHub repo size](https://img.shields.io/github/repo-size/gunout/raa-reunion?style=flat-square)](https://github.com/gunout/raa-reunion)

---

## 📖 Présentation

**RAA Réunion Monitor** est un tableau de bord complet permettant de **suivre, analyser et explorer** les Recueils des Actes Administratifs (RAA) publiés par la **Préfecture de La Réunion** (département 974).

L'outil se compose de deux parties :

1. **Un scraper Node.js** qui extrait automatiquement les actes depuis [reunion.gouv.fr](https://www.reunion.gouv.fr/) et génère un fichier `json/raa_reunion.json` structuré.
2. **Un dashboard web** (HTML/CSS/JS pur, sans dépendance) qui consomme ce JSON et offre une interface riche : recherche, filtres, statistiques, lecteur PDF, détection de doublons, exports.

> ⚡ **Aucun backend requis** pour le dashboard. Le scraper s'exécute ponctuellement (manuellement ou via cron) et le dashboard se contente de lire un fichier JSON statique.

---

## ✨ Fonctionnalités

### 🕷️ Scraper (Node.js)

- ✅ Découverte automatique des **URLs de mois** pour une année donnée
- ✅ Extraction des **actes PDF** avec titre, numéro, date, URL
- ✅ Détection automatique du **type d'acte** (arrêté, décision, recueil, spécial, nominatif…)
- ✅ Capture des **actes sans PDF** (récépissés, avis…) listés en texte brut
- ✅ **Dédoublonnage** par URL et par titre normalisé
- ✅ Filtre intelligent des **mois futurs** (pas de 404 inutiles)
- ✅ Gestion des **retries** et des erreurs réseau
- ✅ Scraping **multi-années** en une commande
- ✅ Sortie JSON **propre et versionnable**

### 📊 Dashboard (Web)

- 🎨 **Interface DSFR** (Système de Design de l'État français) — couleurs Marianne
- 🔍 **Recherche instantanée** par titre, numéro, mois, URL
- 🎯 **Filtres avancés** : type, mois, année, plage de dates, présence de PDF, doublons
- 📖 **Lecteur PDF intégré** (modale avec iframe + toolbar)
- 📋 **Panneau de détails** complet pour chaque acte
- 🔧 **Vue JSON brut** pour debug/export
- 🔍 **Analyseur de doublons** avec 4 stratégies (URL, titre, numéro, similarité Levenshtein)
- 📈 **Statistiques visuelles** : répartition par type, activité par année
- 🏆 **Top des mois les plus prolifiques**
- 📥 **Export CSV** des résultats filtrés
- 📋 **Copie en masse** des URLs PDF
- ⌨️ **Raccourcis clavier** (`/` pour rechercher, `Échap` pour fermer)
- 📱 **Responsive** (mobile/tablette/desktop)
- 🌐 **100 % offline** une fois le JSON généré

---

## 🚀 Installation

### Prérequis

- **Node.js** ≥ 18 ([télécharger](https://nodejs.org/))
- **npm** ≥ 9 (fourni avec Node.js)
- Un navigateur moderne (Chrome, Firefox, Safari, Edge)

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/gunout/raa-reunion.git
cd raa-reunion

# 2. Installer les dépendances
npm install

# 3. Générer le fichier JSON (scrape 2026 par défaut)
npm run scrape

# 4. Lancer le dashboard
npm run serve
```

Puis ouvrez **http://localhost:8020** dans votre navigateur.

> ⚠️ **Important** : n'ouvrez **jamais** `index.html` en double-clic (`file://`). Le navigateur bloquera le chargement du JSON pour des raisons de sécurité (CORS). Passez toujours par `http://localhost:8020`.

---

## 🎮 Utilisation

### Scraper

```bash
# Scraper l'année en cours
npm run scrape

# Scraper plusieurs années d'un coup
node scraper.js 2023 2024 2025 2026

# Ou via le script npm
npm run scrape-all
```

**Sortie attendue :**

```
[RAA] Années à scraper : 2026
[RAA] === Année 2026 ===
[RAA] Découverte pour 2026 : https://www.reunion.gouv.fr/...
[RAA]   → 10 mois à scraper
[RAA]   Scraping 2026/JANVIER → ...
[RAA]     → 29 actes
[RAA]   Scraping 2026/FEVRIER → ...
[RAA]     → 29 actes
...
[RAA] ✅ 348 actes écrits dans .../json/raa_reunion.json
```

### Dashboard

| Action | Comment |
|---|---|
| 🔍 Rechercher | Tapez dans la barre de recherche ou appuyez sur `/` |
| 🎯 Filtrer | Utilisez les listes déroulantes ou la barre avancée |
| 📖 Lire un PDF | Cliquez sur une carte ou sur « 📖 Lire le PDF » |
| 🔍 Voir les doublons | Onglet « 🔍 Doublons » en haut de la liste |
| 📥 Exporter | Bouton « 📥 Export CSV » dans la sidebar droite |
| 📋 Copier URLs | Bouton « 📋 Copier les URLs PDF » |
| ⌨️ Fermer modale | `Échap` |

### Automatisation (cron)

Pour scraper automatiquement chaque nuit à 3h :

```bash
# Éditer la crontab
crontab -e

# Ajouter cette ligne
0 3 * * * cd /home/user/raa-reunion && /usr/bin/node scraper.js >> /var/log/raa.log 2>&1
```

---

## 🏗️ Architecture

```
raa-reunion/
├── 📄 index.html              # Dashboard (HTML + CSS + JS inline)
├── 🕷️ scraper.js              # Scraper Node.js
├── 📦 package.json            # Dépendances et scripts
├── 📖 README.md               # Ce fichier
├── 📜 LICENSE                 # MIT
├── 📁 json/
│   └── 📊 raa_reunion.json    # Données générées (348 actes)
└── 📁 node_modules/           # Dépendances (git-ignored)
```

### Stack technique

| Composant | Technologie |
|---|---|
| **Scraper** | Node.js + [cheerio](https://cheerio.js.org/) + [node-fetch](https://github.com/node-fetch/node-fetch) |
| **Dashboard** | HTML5 + CSS3 + JavaScript Vanilla (ES6+) |
| **UI** | [DSFR 1.12.1](https://www.systeme-de-design.gouv.fr/) |
| **Police** | Marianne |
| **Couleurs** | Bleu France `#000091`, Rouge Marianne `#E1000F`, Bleu Océan `#0d7a8a` |

### Flux de données

```
┌─────────────────────┐
│  reunion.gouv.fr    │  Site officiel de la Préfecture
│  (HTML + PDF)       │
└──────────┬──────────┘
           │  fetch + cheerio
           ▼
┌─────────────────────┐
│    scraper.js       │  Extraction + normalisation
│  (Node.js)          │  Détection type + dédoublonnage
└──────────┬──────────┘
           │  écriture JSON
           ▼
┌─────────────────────┐
│  raa_reunion.json   │  Données structurées
│  (fichier statique) │  348 actes · 2026
└──────────┬──────────┘
           │  fetch (HTTP)
           ▼
┌─────────────────────┐
│    index.html       │  Dashboard interactif
│  (navigateur)       │  Recherche · Filtres · PDF · Doublons
└─────────────────────┘
```

### Structure d'un acte (JSON)

```json
{
  "id": "r974-a1b2c3",
  "titre": "Arrêté n° 2025-441/SP SAINT-PAUL/BRPA du 13/03/2025...",
  "numero": "2025-441/SP",
  "url": "https://www.reunion.gouv.fr/contenu/telechargement/.../file.pdf",
  "date_publication": "2025-03-13",
  "annee": 2026,
  "mois": "MARS",
  "departement": "974",
  "nom_departement": "La Réunion",
  "prefecture": "Saint-Denis",
  "region": "La Réunion",
  "type": "arrete"
}
```

---

## 🛠️ Scripts npm

| Script | Description |
|---|---|
| `npm run scrape` | Scrape l'année en cours |
| `npm run scrape-all` | Scrape 2024-2025-2026 |
| `npm run serve` | Lance un serveur HTTP local sur le port 8000 |

---

## 🔍 Algorithme de détection de doublons

Le dashboard analyse les actes selon **4 stratégies complémentaires** :

| # | Stratégie | Exemple détecté |
|---|---|---|
| 1 | **URL identique** | Le même PDF scanné deux fois |
| 2 | **Titre normalisé** | Accents, casse, ponctuation ignorés |
| 3 | **Numéro + mois** | Même `n° 2026-441` dans le même mois |
| 4 | **Similarité Levenshtein** | Titres à > 92 % de similarité |

Chaque groupe de doublons est présenté avec :

- ✅ **À conserver** (1er de chaque groupe)
- ✗ **Doublon probable** (les suivants)
- 🔍 **Cause** de la détection

---

## ❓ FAQ

<details>
<summary><strong>Le dashboard affiche « Impossible de charger json/raa_reunion.json »</strong></summary>

Vous avez probablement ouvert le HTML en `file://` (double-clic). Utilisez un serveur HTTP :

```bash
npx http-server -p 8020 -c-1
```

Puis ouvrez `http://localhost:8020`.
</details>

<details>
<summary><strong>Le PDF ne s'affiche pas dans la modale</strong></summary>

Certains serveurs gouvernementaux envoient l'en-tête `X-Frame-Options: DENY` qui bloque l'affichage en iframe. Utilisez le bouton **« 🌐 Ouvrir dans un onglet »** dans la toolbar du lecteur.
</details>

<details>
<summary><strong>Le scraping échoue avec HTTP 404</strong></summary>

Les mois futurs n'existent pas encore sur le site. Le scraper les filtre automatiquement pour l'année en cours. Si le 404 concerne un mois passé, vérifiez manuellement l'URL sur [reunion.gouv.fr](https://www.reunion.gouv.fr/).
</details>

<details>
<summary><strong>Le port 8000 est déjà utilisé</strong></summary>

Changez de port :

```bash
npx http-server -p 8080 -c-1
```

Puis ouvrez `http://localhost:8080`.
</details>

<details>
<summary><strong>Puis-je scraper d'autres départements ?</strong></summary>

Oui, mais le scraper est **spécifique à La Réunion** (URLs, structure HTML). Pour un autre département, dupliquez `scraper.js` et adaptez `BASE`, `RAA_ROOT` et les sélecteurs cheerio.
</details>

<details>
<summary><strong>Les données sont-elles à jour ?</strong></summary>

Le JSON est généré **manuellement** via `npm run scrape`. Pour des données fraîches, relancez le scraper ou configurez un cron (voir [Automatisation](#automatisation-cron)).
</details>

<details>
<summary><strong>Puis-je héberger le dashboard en ligne ?</strong></summary>

Oui ! Le dashboard est 100 % statique. Déposez `index.html` et `json/raa_reunion.json` sur :
- [GitHub Pages](https://pages.github.com/)
- [Netlify](https://www.netlify.com/)
- [Vercel](https://vercel.com/)
- Un simple `nginx` / `apache`

Aucun backend nécessaire.
</details>

---

## 🤝 Contribuer

Les contributions sont **les bienvenues** ! Voici comment procéder :

1. **Fork** le projet ([github.com/gunout/raa-reunion/fork](https://github.com/gunout/raa-reunion/fork))
2. **Créez** une branche (`git checkout -b feature/ma-fonctionnalite`)
3. **Committez** (`git commit -m 'Ajout de ma fonctionnalité'`)
4. **Pushez** (`git push origin feature/ma-fonctionnalite`)
5. **Ouvrez** une Pull Request ([github.com/gunout/raa-reunion/pulls](https://github.com/gunout/raa-reunion/pulls))

### Idées d'amélioration

- [ ] Tests unitaires pour le scraper
- [ ] Support multi-départements
- [ ] Export Excel (`.xlsx`)
- [ ] Notifications email sur nouveaux actes
- [ ] Thème sombre
- [ ] Mode hors-ligne PWA
- [ ] Analyse sémantique des titres (NLP)
- [ ] Timeline interactive

### Conventions

- **Code** : français pour les commentaires, anglais pour les variables
- **Commits** : [Conventional Commits](https://www.conventionalcommits.org/fr/)
- **Style** : 2 espaces, point-virgules, ES6+

---

## 📜 License

Ce projet est sous licence **MIT**. Voir [LICENSE](https://github.com/gunout/raa-reunion/blob/main/LICENSE) pour plus de détails.

```
MIT License

Copyright (c) 2026 RAA Réunion Monitor

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Remerciements

- [Préfecture de La Réunion](https://www.reunion.gouv.fr/) pour la publication des RAA
- [Système de Design de l'État (DSFR)](https://www.systeme-de-design.gouv.fr/) pour la charte graphique
- [Cheerio](https://cheerio.js.org/) pour le parsing HTML
- [Shields.io](https://shields.io/) pour les badges

---

## 📞 Contact

- 🐛 **Bug / Suggestion** : [Ouvrir une issue](https://github.com/gunout/raa-reunion/issues)
- 💬 **Discussion** : [Ouvrir une discussion](https://github.com/gunout/raa-reunion/discussions)
- 👤 **Auteur** : [@gunout](https://github.com/gunout)

---

<div align="center">

**🇷🇪 Fait avec ❤️ pour La Réunion**

[![Préfecture](https://img.shields.io/badge/Préfecture-La%20Réunion-0d7a8a?style=flat-square)](https://www.reunion.gouv.fr/)
[![République](https://img.shields.io/badge/République-Française-000091?style=flat-square)](https://www.gouvernement.fr/)
[![GitHub](https://img.shields.io/badge/GitHub-gunout%2Fraa--reunion-181717?style=flat-square&logo=github)](https://github.com/gunout/raa-reunion)

*Liberté · Égalité · Fraternité*

**Dernière mise à jour** : Octobre 2026

</div>

---

---

<div align="center">

### 🇫🇷 Gunout · 2026

![Made in France](https://img.shields.io/badge/Made_in-France-002395?style=flat-square&labelColor=FFFFFF&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA5MDAgNjAwIj48cmVjdCB3aWR0aD0iOTAwIiBoZWlnaHQ9IjYwMCIgZmlsbD0iIzAwMjM5NSIvPjxyZWN0IHdpZHRoPSI5MDAiIGhlaWdodD0iNDAwIiB5PSIxMDAiIGZpbGw9IiNmZmYiLz48cmVjdCB3aWR0aD0iOTAwIiBoZWlnaHQ9IjIwMCIgeT0iNDAwIiBmaWxsPSIjZWQyOTM5Ii8+PC9zdmc+)
![GitHub](https://img.shields.io/badge/GitHub-gunout-181717?style=flat-square&logo=github&logoColor=white)
![Year](https://img.shields.io/badge/2026-ED2939?style=flat-square&labelColor=FFFFFF)

<sub>© 2026 <strong>Gunout</strong> — Tous droits réservés.</sub>

</div>
