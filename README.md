# Transformez l'architecture d'une application existante

Projet **Renote** : prise de notes, relations entre notes et tags — évolution progressive d’un monolithe Laravel + Livewire vers une exposition **API REST** et un front **React** avec **state management**.

## Sommaire

- [Contexte produit](#contexte-produit)
- [Architecture cible (synthèse)](#architecture-cible-synthèse)
  - [Description](#description)
  - [Justification](#justification)
- [Documentation détaillée](#documentation-détaillée) (dont **architecture étape 4**)
- [Migration React (étapes)](#migration-react-étapes)
- [Front React : arborescence, sécurité, assets](#front-react--arborescence-sécurité-assets)
- [Installation](#installation)

---

## Contexte produit

Renote permet à un utilisateur de :

- créer et consulter des notes ;
- définir des relations entre les notes ;
- gérer des tags et les associer à des notes.

---

## Architecture cible (synthèse)

### Description

L’architecture **cible** est un **monolithe Laravel évolutif** :

| Couche | Rôle |
|--------|------|
| **Back-end** | Une seule application Laravel expose une **API REST** documentée (`routes/api.php`, contrôleurs JSON) et conserve la **logique métier** dans des **services** (`NoteService`, `TagService`, etc.) partagés avec l’UI historique. L’authentification API repose sur **Laravel Sanctum** (tokens Bearer). |
| **Front historique** | Pages **Blade + Livewire** peuvent coexister le temps de la migration, mais le périmètre notes/tags vise une **SPA React** montée depuis une vue « coquille ». |
| **Front cible** | **React** + **bundler (Vite)** consommant **uniquement** l’API (`/api/...`) en JSON ; **state management** centralisé (ex. **Redux Toolkit**) pour auth, listes notes/tags et erreurs ; plus de dépendance à la session Livewire pour ce flux. |

Schéma d’ensemble (vue logique) :

```mermaid
flowchart LR
  subgraph clients [Clients]
    R[React SPA]
    LW[Livewire legacy]
  end
  subgraph api [Laravel]
    REST[API REST + Sanctum]
    SVC[Services métier]
    ORM[Eloquent]
  end
  DB[(Base de données)]
  R -->|JSON Bearer| REST
  LW --> SVC
  REST --> SVC
  SVC --> ORM
  ORM --> DB
```

### Justification

- **Une seule source de vérité métier** : les règles restent dans les services Laravel ; l’API et Livewire (transitoire) s’appuient sur les mêmes primitives → pas de duplication incompatible entre « web » et « API ».
- **Clients interchangeables** : contrat HTTP stable (JSON + OpenAPI implicite dans les contrôleurs) permet d’ajouter un front React, puis éventuellement mobile ou autre consommateur sans réécrire le cœur métier.
- **Séparation nette présentation / données** : React gère l’état UI et les appels réseau ; le serveur reste autorité sur persistance et validation métier → aligné avec l’objectif du parcours « transformer l’architecture existante » sans big-bang.
- **Auth explicite côté API** : Sanctum + Bearer clarifie le modèle pour un client hors session cookie, condition nécessaire à une SPA isolée ou servie sur un autre origine si le projet l’exige.

---

## Documentation détaillée

| Document | Contenu |
|----------|---------|
| Ce README (sections *Architecture*, *Migration*, *Front React*) | Synthèse soutenance OC : périmètre SPA, arborescence `resources/js/`, sécurité API vs coquille `/app`. |
| [docs/architecture-etape4-finale.md](docs/architecture-etape4-finale.md) | **Document d’architecture final (étape 4 OC)** : schémas base/cible, couches back & front, **catalogue REST + exemples JSON**, SOLID, séquence front → BDD. |
| [docs/architecture-backend-etape4.md](docs/architecture-backend-etape4.md) | Évolution back-end, services, API REST |
| [docs/architecture-front-exercice2-etape1.md](docs/architecture-front-exercice2-etape1.md) | Analyse du front actuel et écart vers la cible |
| [docs/architecture-front-exercice2-etape2.md](docs/architecture-front-exercice2-etape2.md) | Front cible : Redux Toolkit et flux de données |

---

## Migration React (étapes)

| Étape | Statut | Contenu |
|-------|--------|---------|
| **1 — Socle SPA + auth API** | Fait | Application React sous **`/app`** (`/app/login`, navigation). **`POST /api/login`**, token Sanctum, **`POST /api/logout`**. Le dashboard **Livewire** (`/dashboard`) reste disponible en parallèle. |
| **2 — Notes via API** | Fait | Liste **`GET /api/notes`**, création **`POST /api/notes`** (`text`, `tag_id`), suppression **`DELETE /api/notes/{id}`** ; sélection du tag depuis **`GET /api/tags`**. |
| **3 — Tags via API** | Fait | Liste **`GET /api/tags`**, création **`POST /api/tags`** (`name`, validation unique). |
| **4 — State management (RTK)** | Fait | **`@reduxjs/toolkit`** + **`react-redux`** : `configureStore`, slices **`auth`** (`initializeAuth`, `login`, `logout`), **`notes`** (`fetchNotes`, `createNote`, `deleteNote`), **`tags`** (`fetchTags`, `createTag`). Composants connectés via **`useAppDispatch`** / **`useAppSelector`** ; gate **`AppSessionGate`** pour `initializeAuth`. Voir `resources/js/store/` et `resources/js/features/`. |
| **5 — Retrait Livewire (notes / tags)** | Fait | `app/Livewire/Notes.php`, `TagForm.php` et vues associées supprimés. **`/notes`** et **`/tags`** (web) redirigent vers **`/app/notes`** et **`/app/tags`**. Le **dashboard** Blade sert de point d’entrée (liens + rappel session web vs token API) ; le menu **Flux** inclut des liens vers la SPA. |

En développement, lancer **`npm run dev`** en parallèle de PHP/Herd pour le rechargement à chaud des fichiers React.

---

## Front React : arborescence, sécurité, assets

### Arborescence (`resources/js/`)

Vue d’ensemble du code SPA (sans détail de chaque fichier) :

```text
resources/js/
├── app.jsx                 # Point d’entrée Vite : Redux Provider + React Router + session gate
├── AppRoutes.jsx           # Routes (/login, /notes, /tags) et garde selon auth Redux
├── AppSessionGate.jsx      # Charge l’utilisateur API au démarrage si un token existe
├── pages/                  # Écrans : LoginPage, NotesPage, TagsPage
├── layouts/                # AppShell (nav + outlet)
├── features/
│   ├── auth/               # Slice + thunks : initializeAuth, login, logout
│   ├── notes/              # Slice + thunks : fetch/create/delete notes
│   └── tags/               # Slice + thunks : fetch/create tags
├── store/                  # configureStore, hooks useAppDispatch / useAppSelector
└── lib/                    # Client HTTP axios (base `/api`), format des erreurs API
```

La vue Blade **`resources/views/spa.blade.php`** ne contient que la coquille HTML (`#spa-root`) et **`@vite`** pour charger CSS + bundle JS.

### Sécurité (consignes OC : routes protégées)

| Zone | Rôle |
|------|------|
| **`GET /app/...`** | Sert le **HTML** et le **JavaScript** de la SPA (pas de données métier dans la réponse initiale). |
| **`/api/*` (sauf login)** | Données JSON protégées par **`auth:sanctum`** : le navigateur doit envoyer **`Authorization: Bearer <token>`** (obtenu via **`POST /api/login`**). |
| **Session Laravel** (cookie, `/login` Livewire, `/dashboard`) | **Indépendante** du token SPA : être connecté au site Blade **ne** connecte **pas** automatiquement la SPA ; il faut se connecter sur **`/app/login`** pour obtenir un token. |

Ainsi, les **endpoints métier ne sont pas exposés sans authentification** ; la SPA ne fait pas confiance au seul chargement de page pour accéder aux données.

### Assets (consignes OC : Vite + React)

Après toute modification des fichiers **`resources/js/**` ou **`resources/css/app.css`**, soit lancer **`npm run dev`** (rechargement à chaud), soit **`npm run build`** pour régénérer **`public/build/`** (sinon le navigateur garde un ancien bundle).

---

## Installation

1. **Laravel Herd** (PHP, Composer, environnement local) : [documentation Laravel — Herd](https://laravel.com/docs/12.x/installation#installation-using-herd)

2. **Node.js** (v22 recommandé) — gestionnaire de versions : **nvm** (macOS/Linux) ; sous Windows : [nvm-windows](https://github.com/coreybutler/nvm-windows#readme)

3. **Cloner** ce dépôt, puis à la racine du projet :

   ```bash
   composer install
   npm install
   ```

4. **Environnement** : copier `.env.example` en `.env`, puis `php artisan key:generate`.

5. **Base de données** : adapter `.env` (SQLite par défaut dans l’exemple), puis :

   ```bash
   php artisan migrate
   ```

6. **Assets front** :

   - développement : `npm run dev` ;
   - ou build de production : `npm run build` (génère `public/build/manifest.json` requis si le serveur Vite n’est pas lancé).

7. **Démarrer Herd** et ouvrir l’URL du site dans le navigateur.

Vous êtes prêt à travailler sur le projet.
