# AI Studio - Frontend Application

## 📋 Description

AI Studio est une application web moderne permettant de créer, éditer et gérer des vidéos générées par IA. L'interface permet de contrôler tout le pipeline de génération : script, audio, images et vidéo finale.

## 🏗️ Architecture

### Stack Technique
- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Router**: React Router v6
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Mock API**: JSON Server

### Structure des Dossiers

```
frontend/
├── public/              # Fichiers statiques
├── src/
│   ├── components/      # Composants réutilisables
│   │   ├── editor/      # Composants de l'éditeur (tabs)
│   │   ├── Sidebar.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── ProjectCard.jsx
│   │   ├── ConfirmModal.jsx
│   │   └── PreviewModal.jsx
│   ├── pages/           # Pages principales
│   │   ├── ProjectsListingPage.jsx
│   │   ├── ProjectEditorPage.jsx
│   │   ├── SettingsPage.jsx
│   │   └── ProPlanPage.jsx
│   ├── services/        # Services API
│   │   └── api.js
│   ├── utils/           # Utilitaires
│   │   └── helpers.js
│   ├── App.jsx          # Composant principal
│   ├── index.jsx        # Point d'entrée
│   └── index.css        # Styles globaux
├── db.json              # Base de données JSON Server
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## 🚀 Installation et Démarrage

### Prérequis
- Node.js 18+
- Yarn

### Installation

```bash
cd frontend
yarn install
```

### Démarrage

**Mode développement (Frontend + Mock API):**

```bash
# Terminal 1 - Démarrer le frontend
yarn start

# Terminal 2 - Démarrer l'API mock (JSON Server)
yarn api
```

- Frontend: http://localhost:3000
- Mock API: http://localhost:8001

### Scripts Disponibles

```bash
yarn dev          # Démarrer Vite dev server
yarn start        # Démarrer sur 0.0.0.0:3000 (production-like)
yarn api          # Démarrer JSON Server sur port 8001
yarn build        # Build de production
yarn preview      # Prévisualiser le build
```

## 📡 API Endpoints Documentation

**Base URL**: `http://localhost:8001` (JSON Server) ou votre backend réel

### 🗂️ Projects Management

#### 1. Get All Projects
```http
GET /projects
Query Parameters (optional):
  - status: string (draft, script_generated, audio_ready, images_ready, video_ready)
  - title_like: string (search by title)
  - _sort: string (field to sort by)
  - _order: string (asc, desc)

Response: Array of Project objects
```

#### 2. Get Single Project
```http
GET /projects/:id

Path Parameters:
  - id: string (project ID)

Response: Project object
```

#### 3. Create Project
```http
POST /projects

Request Body:
{
  "title": "string",
  "description": "string",
  "language": "string (en, fr, es, de, it, pt)",
  "use_case": "string (storytelling, youtube_short, explanation, commercial, inspirational, educational, tutorial)",
  "status": "draft",
  "script_style": "string (educational, inspirational, comedic, dramatic, casual, professional)",
  "voice_id": "string (alloy, echo, fable, onyx, nova, shimmer)",
  "audio_speed": "number (0.7 - 1.3)",
  "audio_pitch": "number (0.7 - 1.3)",
  "image_style": "string (realistic, pixar, anime, flat_design, watercolor, oil_painting, sketch)",
  "images_prompts": "array of strings",
  "resolution": "string (720p, 1080p, 1440p, 2160p)",
  "fps": "number (24, 30, 60)",
  "video_template_id": "string (basic_fade, slide_left, slide_right, zoom_in, zoom_out, ken_burns)",
  "background_music": "string (none, soft, upbeat, cinematic, corporate, ambient)",
  "video_inspirations": "array of strings"
}

Response: Created Project object with ID
```

#### 4. Update Project
```http
PUT /projects/:id

Path Parameters:
  - id: string (project ID)

Request Body: (partial or full Project object)
{
  "title": "string",
  "description": "string",
  ... (any project fields)
}

Response: Updated Project object
```

#### 5. Delete Project
```http
DELETE /projects/:id

Path Parameters:
  - id: string (project ID)

Response: 200 OK
```

### 🤖 AI Generation Endpoints

#### 6. Generate Script
```http
POST /projects/:id/generate-script

Path Parameters:
  - id: string (project ID)

Request Body:
{
  "title": "string",
  "description": "string",
  "use_case": "string",
  "language": "string",
  "style": "string"
}

Response:
{
  "script_text": "string (generated script)",
  "status": "script_generated",
  "updatedAt": "ISO date string"
}
```

#### 7. Generate Audio
```http
POST /projects/:id/generate-audio

Path Parameters:
  - id: string (project ID)

Request Body:
{
  "script_text": "string",
  "voice_id": "string",
  "audio_speed": "number",
  "audio_pitch": "number",
  "language": "string"
}

Response:
{
  "audio_url": "string (URL to generated audio file)",
  "status": "audio_generated",
  "updatedAt": "ISO date string"
}
```

#### 8. Generate All Images
```http
POST /projects/:id/generate-images

Path Parameters:
  - id: string (project ID)

Request Body:
{
  "prompts": ["string", "string", ...],
  "style": "string"
}

Response:
{
  "images_urls": ["string", "string", ...],
  "status": "images_ready",
  "updatedAt": "ISO date string"
}
```

#### 9. Generate Single Image (for specific scene)
```http
POST /projects/:id/generate-images/:sceneIndex

Path Parameters:
  - id: string (project ID)
  - sceneIndex: number (index of the scene, 0-based)

Request Body:
{
  "prompt": "string",
  "style": "string"
}

Response:
{
  "image_url": "string (URL to generated image)",
  "sceneIndex": number
}
```

#### 10. Generate Video
```http
POST /projects/:id/generate-video

Path Parameters:
  - id: string (project ID)

Request Body:
{
  "resolution": "string",
  "fps": number,
  "template": "string",
  "background_music": "string"
}

Response:
{
  "video_url": "string (URL to generated video file)",
  "thumbnail": "string (URL to video thumbnail)",
  "duration": number (in seconds),
  "status": "video_ready",
  "updatedAt": "ISO date string"
}
```

## 📦 Project Data Model

```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  language: string; // en, fr, es, de, it, pt
  use_case: string; // storytelling, youtube_short, explanation, commercial, inspirational, educational, tutorial
  status: string; // draft, script_generated, audio_ready, images_ready, video_ready
  
  // Script
  script_text: string;
  script_style: string; // educational, inspirational, comedic, dramatic, casual, professional
  
  // Audio
  voice_id: string; // alloy, echo, fable, onyx, nova, shimmer
  audio_speed: number; // 0.7 - 1.3
  audio_pitch: number; // 0.7 - 1.3
  audio_url: string | null;
  
  // Images
  image_style: string; // realistic, pixar, anime, flat_design, watercolor, oil_painting, sketch
  images_prompts: string[];
  images_urls: string[];
  
  // Video
  resolution: string; // 720p, 1080p, 1440p, 2160p
  fps: number; // 24, 30, 60
  video_template_id: string; // basic_fade, slide_left, slide_right, zoom_in, zoom_out, ken_burns
  background_music: string; // none, soft, upbeat, cinematic, corporate, ambient
  video_url: string | null;
  
  // Metadata
  thumbnail: string | null;
  duration: number; // in seconds
  video_inspirations: string[];
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}
```

## 🎨 Composants Principaux

### Pages

#### 1. ProjectsListingPage
- Affiche la grille de tous les projets
- Filtrage par status et recherche par titre/description
- Actions: Edit, Preview, Generate (script/audio/images/video), Delete

#### 2. ProjectEditorPage
- Éditeur avec 5 onglets: Details, Script, Audio, Images, Video
- Layout à 2 colonnes: Formulaire + Prévisualisation en direct
- Actions de génération par section
- Sauvegarde automatique

#### 3. SettingsPage
- Page placeholder pour les paramètres

#### 4. ProPlanPage
- Page placeholder pour l'upgrade Pro

### Composants

#### ProjectCard
Props: `project`, `onDelete`, `onPreview`, `onGenerate`
- Card avec thumbnail, titre, description, status
- Actions au survol

#### StatusBadge
Props: `status`
- Badge coloré avec point indicateur

#### Sidebar
- Navigation principale (Projects, Settings, Pro Plan)
- Bouton "New Project"

#### Modals
- **ConfirmModal**: Confirmation d'action (suppression)
- **PreviewModal**: Prévisualisation vidéo

#### Editor Components
- **DetailsTab**: Formulaire de détails du projet
- **ScriptTab**: Génération et édition de script
- **AudioTab**: Configuration audio et sélection de voix
- **ImagesTab**: Gestion des prompts et images par scène
- **VideoTab**: Configuration vidéo finale
- **PreviewPanel**: Prévisualisation en temps réel

## 🔧 Configuration

### Variables d'Environnement

Créer un fichier `.env` :

```env
VITE_API_BASE_URL=http://localhost:8001
```

Pour pointer vers votre backend réel, changez simplement l'URL :

```env
VITE_API_BASE_URL=https://votre-api.com/api
```

### Proxy Vite

Le fichier `vite.config.js` configure un proxy pour les requêtes `/api` :

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:8001',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/api/, '')
  }
}
```

## 🧪 Testing

Tous les composants incluent des `data-testid` pour faciliter les tests automatisés :

```jsx
<button data-testid="save-button">Save</button>
<input data-testid="project-title-input" />
```

## 🎯 Workflow de Développement

### Remplacement de l'API Mock

1. **Gardez la structure de données identique** (voir Data Model ci-dessus)
2. **Changez uniquement l'URL** dans `.env`
3. **Implémentez les endpoints** listés dans ce README
4. **Respectez les formats de requête/réponse**

### Exemple d'intégration backend

```javascript
// frontend/src/services/api.js
// Aucun changement nécessaire si votre backend respecte les mêmes endpoints

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // Changez seulement le .env
```

## 📝 Notes Importantes

### Génération IA
Les endpoints de génération (`/generate-script`, `/generate-audio`, etc.) sont actuellement mockés. Votre backend devra implémenter:
- Génération de script (GPT, Claude, Gemini...)
- Génération audio (ElevenLabs, OpenAI TTS...)
- Génération d'images (DALL-E, Stable Diffusion, Midjourney...)
- Rendu vidéo (FFmpeg, RunwayML, Pika...)

### Authentification
L'authentification n'est pas implémentée. Pour l'ajouter:
1. Ajouter un contexte Auth React
2. Gérer les tokens JWT
3. Ajouter des headers Authorization aux requêtes API
4. Créer des pages Login/Register

### Statuts des Projets
Le workflow de statut est:
```
draft → script_generated → audio_generated → images_ready → video_ready
```

## 🐛 Troubleshooting

### JSON Server ne démarre pas
```bash
# Vérifier que le port 8001 est libre
lsof -i :8001
# Ou changer le port
json-server --watch db.json --port 8002
```

### CORS Errors
JSON Server gère automatiquement CORS. Pour un backend réel, assurez-vous que:
```javascript
// Backend
app.use(cors({
  origin: 'http://localhost:3000'
}));
```

### Problèmes de proxy Vite
Si les requêtes `/api` ne fonctionnent pas, vérifiez `vite.config.js`

## 📚 Resources

- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [JSON Server](https://github.com/typicode/json-server)
- [Lucide Icons](https://lucide.dev)

## ✨ Fonctionnalités Implémentées

- ✅ Listing des projets avec filtres et recherche
- ✅ Création et édition de projets
- ✅ Interface à onglets (Details, Script, Audio, Images, Video)
- ✅ Prévisualisation en temps réel
- ✅ Génération de contenu IA (mockée)
- ✅ Gestion des prompts d'images par scène
- ✅ Configuration avancée (voix, vitesse, pitch, FPS, résolution...)
- ✅ Modals de confirmation et prévisualisation
- ✅ Design responsive et moderne
- ✅ Data-testids pour tests automatisés
- ✅ Documentation complète des endpoints

## 🚀 Prochaines Étapes

1. **Implémenter le backend** en suivant la documentation des endpoints
2. **Intégrer les vraies API IA** (OpenAI, ElevenLabs, etc.)
3. **Ajouter l'authentification** (JWT ou OAuth)
4. **Implémenter le stockage fichiers** (AWS S3, Cloudinary...)
5. **Optimiser les performances** (lazy loading, caching...)

---

**Bon développement ! 🎉**
