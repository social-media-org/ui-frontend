# 🚀 Quick Start Guide - AI Studio Frontend

## Démarrage Rapide (5 minutes)

### 1. Installation

```bash
cd /app/frontend
yarn install
```

### 2. Lancement de l'Application

**Option A: Avec Supervisor (Production-like)**
```bash
sudo supervisorctl restart all
```

**Option B: Manuellement (Développement)**
```bash
# Terminal 1 - Frontend
cd /app/frontend
yarn start

# Terminal 2 - Mock API
cd /app/frontend
yarn api
```

### 3. Accès à l'Application

- **Frontend**: http://localhost:3000
- **Mock API**: http://localhost:8001
- **API Docs**: http://localhost:8001 (JSON Server UI)

### 4. Tester l'Application

1. Ouvrir http://localhost:3000
2. Cliquer sur un projet existant pour l'éditer
3. Ou cliquer sur "+ New Project" pour en créer un nouveau
4. Explorer les différents onglets (Details, Script, Audio, Images, Video)
5. Tester les boutons "Generate" (mockés pour le moment)

---

## 📁 Structure du Projet

```
frontend/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── editor/          # Composants de l'éditeur
│   │   ├── Sidebar.jsx      # Navigation sidebar
│   │   ├── StatusBadge.jsx  # Badge de statut
│   │   ├── ProjectCard.jsx  # Card de projet
│   │   └── ...
│   ├── pages/               # Pages principales
│   │   ├── ProjectsListingPage.jsx
│   │   ├── ProjectEditorPage.jsx
│   │   ├── SettingsPage.jsx
│   │   └── ProPlanPage.jsx
│   ├── services/
│   │   └── api.js           # Service API (à pointer vers votre backend)
│   ├── utils/
│   │   └── helpers.js       # Fonctions utilitaires
│   └── App.jsx              # Point d'entrée React
├── db.json                  # Base de données JSON Server (mock)
└── package.json
```

---

## 🔌 Remplacer l'API Mock par votre Backend

### Étape 1: Modifier le .env

```bash
# frontend/.env

# Mock API (actuel)
VITE_API_BASE_URL=http://localhost:8001

# Votre backend (à changer)
VITE_API_BASE_URL=https://votre-backend.com/api
```

### Étape 2: C'est tout !

Le service API (`src/services/api.js`) utilisera automatiquement la nouvelle URL. Aucun autre changement de code n'est nécessaire si votre backend respecte les mêmes endpoints.

---

## 🧪 Test des Endpoints Mock

### Avec cURL

```bash
# Get all projects
curl http://localhost:8001/projects

# Get single project
curl http://localhost:8001/projects/1

# Create project
curl -X POST http://localhost:8001/projects \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Project",
    "description": "Test",
    "language": "en",
    "use_case": "explanation",
    "status": "draft"
  }'

# Update project
curl -X PUT http://localhost:8001/projects/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title"}'

# Delete project
curl -X DELETE http://localhost:8001/projects/1
```

### Avec le Frontend

1. **Créer un projet**: Cliquer sur "+ New Project"
2. **Éditer un projet**: Cliquer sur une card de projet
3. **Générer du contenu**: Cliquer sur les boutons "Generate Script", "Generate Audio", etc.
4. **Sauvegarder**: Cliquer sur "Save"
5. **Supprimer**: Hover sur une card et cliquer sur l'icône poubelle

---

## 📊 Données Mock Disponibles

Le fichier `db.json` contient 3 projets d'exemple :

1. **The Future of AI** (video_ready)
   - Script, audio, images et vidéo complétés
   - Use case: Explanation

2. **Morning Meditation** (audio_ready)
   - Script et audio générés
   - Use case: Inspirational

3. **Untitled Project** (draft)
   - Nouveau projet vide
   - Use case: Explanation

---

## 🎨 Personnalisation du Design

### Couleurs Tailwind

Les couleurs primaires sont définies dans `tailwind.config.js` :

```javascript
colors: {
  primary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    // ... purple palette
    900: '#581c87',
  },
}
```

Pour changer les couleurs, modifiez cette configuration.

### Styles Globaux

Les styles globaux sont dans `src/index.css` avec des classes utilitaires comme :
- `.btn-primary`
- `.btn-secondary`
- `.input-field`
- `.card`
- `.tab-button`

---

## 🔧 Commandes Utiles

```bash
# Installation des dépendances
yarn install

# Démarrer le frontend
yarn start

# Démarrer l'API mock
yarn api

# Build de production
yarn build

# Prévisualiser le build
yarn preview

# Ajouter une nouvelle dépendance
yarn add nom-du-package
```

---

## 🐛 Dépannage

### Le frontend ne démarre pas

```bash
# Vérifier les logs
tail -f /var/log/supervisor/frontend.out.log

# Redémarrer
sudo supervisorctl restart frontend
```

### L'API mock ne démarre pas

```bash
# Vérifier que le port 8001 est libre
lsof -i :8001

# Redémarrer
sudo supervisorctl restart json-api
```

### Erreurs CORS

Les requêtes vers l'API sont proxifiées par Vite. Vérifiez `vite.config.js` :

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8001',
    changeOrigin: true
  }
}
```

### Les images ne s'affichent pas

Les URLs mockées pointent vers Unsplash. Vérifiez votre connexion internet.

---

## 📖 Documentation Complète

- **README.md**: Vue d'ensemble et documentation des endpoints
- **API_GUIDE.md**: Guide détaillé pour implémenter le backend
- **Ce fichier**: Quick Start Guide

---

## ✨ Fonctionnalités Implémentées

### Page Listing
- ✅ Grille de projets avec thumbnails
- ✅ Recherche par titre/description
- ✅ Filtrage par statut
- ✅ Badges de statut colorés
- ✅ Actions au survol (Edit, Preview, Generate, Delete)
- ✅ Modal de confirmation de suppression
- ✅ Modal de prévisualisation vidéo

### Page Éditeur
- ✅ 5 onglets (Details, Script, Audio, Images, Video)
- ✅ Layout 2 colonnes (Formulaire + Preview)
- ✅ Prévisualisation en temps réel
- ✅ Sauvegarde automatique
- ✅ Génération par section

#### Onglet Details
- ✅ Titre, description
- ✅ Langue (6 langues)
- ✅ Use case (7 types)
- ✅ Inspirations vidéo (ajout/suppression dynamique)

#### Onglet Script
- ✅ Sélection de style
- ✅ Textarea avec compteur de caractères
- ✅ Durée estimée
- ✅ Bouton "Generate Script"

#### Onglet Audio
- ✅ Sélection de voix (6 voix)
- ✅ Contrôle de vitesse (slider)
- ✅ Contrôle de pitch (slider)
- ✅ Player audio intégré
- ✅ Bouton "Generate Audio"

#### Onglet Images
- ✅ Sélection de style visuel (7 styles)
- ✅ Gestion des prompts par scène
- ✅ Ajout/suppression de scènes
- ✅ Génération individuelle ou en masse
- ✅ Prévisualisation des images
- ✅ Bouton "Regenerate"

#### Onglet Video
- ✅ Sélection de résolution (4 options)
- ✅ Sélection de FPS (24/30/60)
- ✅ Templates de transition (6 types)
- ✅ Musique de fond (6 options)
- ✅ Player vidéo intégré
- ✅ Bouton "Render Video"

### Navigation
- ✅ Sidebar avec logo
- ✅ Menu (Projects, Settings, Pro Plan)
- ✅ Bouton "New Project"
- ✅ Bouton retour sur éditeur
- ✅ Navigation React Router

### Design
- ✅ Design moderne et professionnel
- ✅ Palette purple/grey/white
- ✅ Responsive (mobile-friendly)
- ✅ Animations fluides
- ✅ Icons Lucide React
- ✅ Composants Tailwind CSS

---

## 🎯 Prochaines Étapes

1. **Implémenter le backend** en suivant `API_GUIDE.md`
2. **Intégrer les vraies API IA** (OpenAI, ElevenLabs, DALL-E, etc.)
3. **Ajouter l'authentification** (JWT ou OAuth)
4. **Déployer l'application** (Vercel, Netlify, AWS, etc.)

---

**Vous êtes prêt à commencer ! 🎉**

Pour toute question, référez-vous à la documentation complète dans `README.md` et `API_GUIDE.md`.
