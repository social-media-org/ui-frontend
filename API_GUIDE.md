# Guide d'Intégration API - AI Studio Backend

## 📌 Vue d'ensemble

Ce document décrit en détail comment implémenter le backend pour l'application AI Studio. Le frontend est déjà complet et fonctionnel avec JSON Server comme API mock. Vous devez créer un backend qui respecte exactement les mêmes endpoints et formats de données.

## 🎯 Objectif

Créer un backend orchestrateur (UI-Service) qui :
1. Gère les projets dans une base de données
2. Orchestre les appels aux microservices de génération IA
3. Respecte les contrats API définis par le frontend

## 🏗️ Architecture Recommandée

### Principe de Conception

**IMPORTANT**: Le backend sert d'**orchestrateur/intermédiaire** entre le frontend et les microservices. Il NE DOIT PAS contenir de logique métier.

- ✅ **Routes**: Valident les entrées, appellent les services
- ✅ **Services**: Effectuent des appels REST aux microservices cibles
- ❌ **PAS de traitement métier dans les routes**: Toute logique doit être déléguée aux microservices

### Exemple de Flux

```
Frontend → Backend Route → Backend Service → Microservice (Script/Audio/Image/Video)
                                              ↓
                                          Traitement IA
                                              ↓
Frontend ← Backend Route ← Backend Service ← Microservice
```

## 🗂️ Structure Recommandée

```
backend/
├── app/
│   ├── main.py                    # FastAPI app principale
│   ├── config.py                  # Configuration & env vars
│   ├── database.py                # Configuration DB
│   │
│   ├── models/
│   │   └── project.py             # Modèles Pydantic/DB
│   │
│   ├── routes/                    # Routes par domaine
│   │   ├── projects.py            # CRUD projets
│   │   ├── script.py              # Routes génération script
│   │   ├── audio.py               # Routes génération audio
│   │   ├── images.py              # Routes génération images
│   │   └── video.py               # Routes génération vidéo
│   │
│   └── services/                  # Services = appels REST aux microservices
│       ├── project_service.py     # Gestion projets DB
│       ├── script_service.py      # Appels microservice script
│       ├── audio_service.py       # Appels microservice audio
│       ├── image_service.py       # Appels microservice image
│       └── video_service.py       # Appels microservice vidéo
│
├── requirements.txt
└── .env
```

### Exemple d'Organisation par Domaine

**routes/script.py** (Route uniquement)
```python
from fastapi import APIRouter, Depends
from services.script_service import ScriptService

router = APIRouter(prefix="/projects", tags=["script"])

@router.post("/{project_id}/generate-script")
async def generate_script(
    project_id: str,
    data: ScriptGenerationRequest,
    script_service: ScriptService = Depends()
):
    # Validation uniquement, pas de logique métier
    result = await script_service.generate_script(project_id, data)
    return result
```

**services/script_service.py** (Service = appel REST au microservice)
```python
import httpx
from config import settings

class ScriptService:
    def __init__(self):
        self.script_api_url = settings.SCRIPT_SERVICE_URL
    
    async def generate_script(self, project_id: str, data):
        """Appel REST au microservice de génération de script"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{self.script_api_url}/generate",
                json={
                    "title": data.title,
                    "description": data.description,
                    "use_case": data.use_case,
                    "language": data.language,
                    "style": data.style
                }
            )
            response.raise_for_status()
            return response.json()
```

## 📊 Modèle de Données (MongoDB)

### Collection/Table: `projects`

```json
{
  "_id": "ObjectId ou UUID",
  "title": "string",
  "description": "string",
  "language": "string (en, fr, es, de, it, pt)",
  "use_case": "string (storytelling, youtube_short, explanation, commercial, inspirational, educational, tutorial)",
  "status": "string (draft, script_generated, audio_ready, images_ready, video_ready)",
  
  // Script
  "script_text": "string",
  "script_style": "string (educational, inspirational, comedic, dramatic, casual, professional)",
  
  // Audio
  "voice_id": "string (alloy, echo, fable, onyx, nova, shimmer)",
  "audio_speed": "number (0.7 - 1.3)",
  "audio_pitch": "number (0.7 - 1.3)",
  "audio_path": "string | null",
  
  // Images - FORMAT IMPORTANT
  "image_style": "string (realistic, pixar, anime, flat_design, watercolor, oil_painting, sketch)",
  "images": [
    {
      "prompt": "string",
      "url": "string | null"
    }
  ],
  
  // Video
  "resolution": "string (720p, 1080p, 1440p, 2160p)",
  "fps": "number (24, 30, 60)",
  "video_template_id": "string (basic_fade, slide_left, slide_right, zoom_in, zoom_out, ken_burns)",
  "background_music": "string (none, soft, upbeat, cinematic, corporate, ambient)",
  "video_url": "string | null",
  
  // Metadata
  "thumbnail": "string | null",
  "duration": "number (in seconds)",
  "video_inspirations": ["string"],
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

## 🔌 API Endpoints par Domaine

---

## 1️⃣ DOMAINE: PROJETS (CRUD)

### GET /projects

**Description**: Récupérer tous les projets avec pagination et filtres optionnels

**Query Parameters** (optionnels):
- `status`: string (filter by status)
- `search`: string (search in title/description)
- `page`: number (pagination)
- `limit`: number (items per page)

**Response**: `200 OK`
```json
[
  {
    "id": "1",
    "title": "The Future of AI",
    "description": "...",
    "status": "video_ready",
    "images": [
      {"prompt": "AI brain", "url": "https://..."},
      {"prompt": "Future city", "url": "https://..."}
    ],
    ...
  }
]
```

**Service Architecture**:
```python
# routes/projects.py
@router.get("/projects")
async def get_projects(
    status: Optional[str] = None,
    search: Optional[str] = None,
    project_service: ProjectService = Depends()
):
    return await project_service.get_all(status, search)

# services/project_service.py
class ProjectService:
    async def get_all(self, status, search):
        # Accès DB uniquement, pas d'appel microservice
        query = db.query(Project)
        if status:
            query = query.filter(Project.status == status)
        if search:
            query = query.filter(...)
        return query.all()
```

---

### GET /projects/:id

**Description**: Récupérer un projet spécifique

**Response**: `200 OK` ou `404 Not Found`

---

### POST /projects

**Description**: Créer un nouveau projet

**Request Body**:
```json
{
  "title": "My New Project",
  "description": "Project description",
  "language": "en",
  "use_case": "explanation"
}
```

**Response**: `201 Created`
```json
{
  "id": "generated-id",
  "title": "My New Project",
  "status": "draft",
  "images": [],
  "created_at": "2025-11-29T10:00:00Z",
  ...
}
```

---

### PUT /projects/:id

**Description**: Mettre à jour un projet

**Request Body**: (partial update)
```json
{
  "title": "Updated Title",
  "images": [
    {"prompt": "Updated prompt", "url": null}
  ]
}
```

**Response**: `200 OK`

---

### DELETE /projects/:id

**Description**: Supprimer un projet

**Response**: `204 No Content`

---

## 2️⃣ DOMAINE: SCRIPT

### POST /projects/:id/generate-script

**Description**: Générer le script d'un projet (appelle le microservice Script)

**Request Body**:
```json
{
  "title": "string",
  "description": "string",
  "use_case": "explanation",
  "language": "en",
  "style": "educational"
}
```

**Response**: `200 OK`
```json
{
  "script_text": "Generated script content here...",
  "status": "script_generated",
  "updated_at": "2025-11-29T10:05:00Z"
}
```

**Architecture Service**:

```python
# routes/script.py
@router.post("/projects/{project_id}/generate-script")
async def generate_script(
    project_id: str,
    data: ScriptGenerationRequest,
    script_service: ScriptService = Depends(),
    project_service: ProjectService = Depends()
):
    # 1. Appel au microservice Script
    script_data = await script_service.generate(data)
    
    # 2. Mise à jour du projet
    project = await project_service.update(
        project_id,
        {
            "script_text": script_data["text"],
            "status": "script_generated"
        }
    )
    
    return project

# services/script_service.py
class ScriptService:
    async def generate(self, data):
        """Appel REST au microservice Script"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{SCRIPT_SERVICE_URL}/generate",
                json=data.dict()
            )
            return response.json()
```

---

## 3️⃣ DOMAINE: AUDIO

### POST /projects/:id/generate-audio

**Description**: Générer l'audio à partir du script (appelle le microservice Audio)

**Request Body**:
```json
{
  "script_text": "string",
  "voice_id": "alloy",
  "audio_speed": 1.0,
  "audio_pitch": 1.0,
  "language": "en"
}
```

**Response**: `200 OK`
```json
{
  "audio_path": "https://your-storage.com/audio/project-1.mp3",
  "status": "audio_generated",
  "updated_at": "2025-11-29T10:10:00Z"
}
```

**Architecture Service**:

```python
# routes/audio.py
@router.post("/projects/{project_id}/generate-audio")
async def generate_audio(
    project_id: str,
    data: AudioGenerationRequest,
    audio_service: AudioService = Depends(),
    project_service: ProjectService = Depends()
):
    # Appel au microservice Audio
    audio_data = await audio_service.generate(data)
    
    # Mise à jour du projet
    project = await project_service.update(
        project_id,
        {
            "audio_path": audio_data["url"],
            "status": "audio_generated"
        }
    )
    
    return project

# services/audio_service.py
class AudioService:
    async def generate(self, data):
        """Appel REST au microservice Audio"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{AUDIO_SERVICE_URL}/generate",
                json=data.dict()
            )
            return response.json()
```

---

## 4️⃣ DOMAINE: IMAGES

### POST /projects/:id/generate-images

**Description**: Générer toutes les images (appelle le microservice Image)

**Request Body**:
```json
{
  "images": [
    {"prompt": "A futuristic AI brain", "url": null},
    {"prompt": "Modern hospital with AI", "url": null}
  ],
  "style": "realistic"
}
```

**Response**: `200 OK`
```json
{
  "images": [
    {
      "prompt": "A futuristic AI brain",
      "url": "https://your-storage.com/images/project-1-scene-0.png"
    },
    {
      "prompt": "Modern hospital with AI",
      "url": "https://your-storage.com/images/project-1-scene-1.png"
    }
  ],
  "status": "images_ready",
  "updated_at": "2025-11-29T10:15:00Z"
}
```

**Architecture Service**:

```python
# routes/images.py
@router.post("/projects/{project_id}/generate-images")
async def generate_images(
    project_id: str,
    data: ImagesGenerationRequest,
    image_service: ImageService = Depends(),
    project_service: ProjectService = Depends()
):
    # Appel au microservice Image pour chaque image
    generated_images = await image_service.generate_batch(
        data.images,
        data.style
    )
    
    # Mise à jour du projet
    project = await project_service.update(
        project_id,
        {
            "images": generated_images,
            "image_style": data.style,
            "status": "images_ready"
        }
    )
    
    return project

# services/image_service.py
class ImageService:
    async def generate_batch(self, images, style):
        """Appel REST au microservice Image pour générer plusieurs images"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{IMAGE_SERVICE_URL}/generate-batch",
                json={
                    "images": [{"prompt": img["prompt"]} for img in images],
                    "style": style
                }
            )
            return response.json()["images"]
```

---

### POST /projects/:id/generate-images/:sceneIndex

**Description**: Générer/Régénérer une seule image (appelle le microservice Image)

**Request Body**:
```json
{
  "prompt": "A futuristic AI brain",
  "style": "realistic"
}
```

**Response**: `200 OK`
```json
{
  "image_url": "https://your-storage.com/images/project-1-scene-0.png",
  "scene_index": 0
}
```

**Architecture Service**:

```python
# routes/images.py
@router.post("/projects/{project_id}/generate-images/{scene_index}")
async def generate_single_image(
    project_id: str,
    scene_index: int,
    data: SingleImageRequest,
    image_service: ImageService = Depends(),
    project_service: ProjectService = Depends()
):
    # Appel au microservice Image
    image_data = await image_service.generate_single(
        data.prompt,
        data.style
    )
    
    # Récupérer le projet et mettre à jour l'image spécifique
    project = await project_service.get(project_id)
    project.images[scene_index]["url"] = image_data["url"]
    
    await project_service.update(project_id, {"images": project.images})
    
    return {"image_url": image_data["url"], "scene_index": scene_index}

# services/image_service.py
class ImageService:
    async def generate_single(self, prompt, style):
        """Appel REST au microservice Image pour une seule image"""
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{IMAGE_SERVICE_URL}/generate",
                json={"prompt": prompt, "style": style}
            )
            return response.json()
```

---

## 5️⃣ DOMAINE: VIDÉO

### POST /projects/:id/generate-video

**Description**: Assembler et rendre la vidéo finale (appelle le microservice Vidéo)

**Request Body**:
```json
{
  "resolution": "1080p",
  "fps": 30,
  "template": "basic_fade",
  "background_music": "cinematic"
}
```

**Response**: `200 OK`
```json
{
  "video_url": "https://your-storage.com/videos/project-1.mp4",
  "thumbnail": "https://your-storage.com/thumbnails/project-1.jpg",
  "duration": 45,
  "status": "video_ready",
  "updated_at": "2025-11-29T10:30:00Z"
}
```

**Architecture Service**:

```python
# routes/video.py
@router.post("/projects/{project_id}/generate-video")
async def generate_video(
    project_id: str,
    data: VideoGenerationRequest,
    background_tasks: BackgroundTasks,
    video_service: VideoService = Depends(),
    project_service: ProjectService = Depends()
):
    project = await project_service.get(project_id)
    
    # Validation
    if not project.audio_path or not project.images:
        raise HTTPException(400, "Audio and images required")
    
    # Lancer génération vidéo en arrière-plan (processus long)
    background_tasks.add_task(
        video_service.render,
        project_id,
        project,
        data
    )
    
    return {"message": "Video generation started", "status": "processing"}

# services/video_service.py
class VideoService:
    async def render(self, project_id, project, config):
        """Appel REST au microservice Vidéo"""
        async with httpx.AsyncClient(timeout=300.0) as client:
            response = await client.post(
                f"{VIDEO_SERVICE_URL}/render",
                json={
                    "audio_path": project.audio_path,
                    "images": project.images,
                    "resolution": config.resolution,
                    "fps": config.fps,
                    "template": config.template,
                    "background_music": config.background_music
                }
            )
            video_data = response.json()
            
            # Mise à jour du projet
            await project_service.update(
                project_id,
                {
                    "video_url": video_data["url"],
                    "thumbnail": video_data["thumbnail"],
                    "duration": video_data["duration"],
                    "status": "video_ready"
                }
            )
```

---

## 🔐 Configuration et Sécurité

### Variables d'Environnement (.env)

```env
# Database
DATABASE_URL=mongodb://localhost:27017/ai_studio


# Microservices URLs
SCRIPT_SERVICE_URL=http://script-service:8001
AUDIO_SERVICE_URL=http://audio-service:8002
IMAGE_SERVICE_URL=http://image-service:8003
VIDEO_SERVICE_URL=http://video-service:8004

# Storage
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=ai-studio-media

# CORS
FRONTEND_URL=http://localhost:3000
```

### CORS Configuration

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 📦 Microservices Recommandés

### 1. Script Service
- **Technologie**: OpenAI GPT-4, Claude, Gemini
- **Endpoint**: POST /generate
- **Responsabilité**: Génération de scripts créatifs

### 2. Audio Service
- **Technologie**: ElevenLabs, OpenAI TTS, Google Cloud TTS
- **Endpoint**: POST /generate
- **Responsabilité**: Text-to-Speech

### 3. Image Service
- **Technologie**: DALL-E 3, Stable Diffusion, Midjourney
- **Endpoints**: 
  - POST /generate (single)
  - POST /generate-batch (multiple)
- **Responsabilité**: Génération d'images

### 4. Video Service
- **Technologie**: FFmpeg, RunwayML, Pika Labs
- **Endpoint**: POST /render
- **Responsabilité**: Assemblage vidéo, transitions, effets

---

## 🚀 Déploiement

### Docker Compose Exemple

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8001:8001"
    environment:
      - DATABASE_URL=mongodb://mongo:27017/ai_studio
      - SCRIPT_SERVICE_URL=http://script-service:8001
      - AUDIO_SERVICE_URL=http://audio-service:8002
      - IMAGE_SERVICE_URL=http://image-service:8003
      - VIDEO_SERVICE_URL=http://video-service:8004
    depends_on:
      - mongo
      - script-service
      - audio-service
      - image-service
      - video-service
  
  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
  
  script-service:
    image: your-org/script-service:latest
    environment:
      - OPENAI_API_KEY=${OPENAI_API_KEY}
  
  audio-service:
    image: your-org/audio-service:latest
    environment:
      - ELEVENLABS_API_KEY=${ELEVENLABS_API_KEY}
  
  image-service:
    image: your-org/image-service:latest
    environment:
      - STABILITY_API_KEY=${STABILITY_API_KEY}
  
  video-service:
    image: your-org/video-service:latest
    volumes:
      - /tmp/ffmpeg:/tmp/ffmpeg

volumes:
  mongo_data:
```

---

## ✅ Checklist d'Implémentation

### Backend Core
- [ ] Configuration base de données (MongoDB)
- [ ] Modèle Project avec nouveau format images
- [ ] CORS configuré pour frontend
- [ ] Gestion d'erreurs appropriée
- [ ] Logging et monitoring

### Routes par Domaine
- [ ] routes/projects.py - CRUD complet
- [ ] routes/script.py - Génération script
- [ ] routes/audio.py - Génération audio
- [ ] routes/images.py - Génération images (batch + single)
- [ ] routes/video.py - Assemblage vidéo

### Services (appels REST aux microservices)
- [ ] services/project_service.py - Gestion DB
- [ ] services/script_service.py - Appels microservice script
- [ ] services/audio_service.py - Appels microservice audio
- [ ] services/image_service.py - Appels microservice image
- [ ] services/video_service.py - Appels microservice vidéo

### Tests
- [ ] Tests unitaires des services
- [ ] Tests d'intégration des routes
- [ ] Tests end-to-end avec mock microservices

---

## 📚 Ressources Utiles

- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [HTTPX Async Client](https://www.python-httpx.org/)
- [MongoDB with FastAPI](https://www.mongodb.com/languages/python/pymongo-tutorial)
- [Microservices Architecture Patterns](https://microservices.io/patterns/)

---

**Bon développement ! N'oubliez pas : votre backend est un ORCHESTRATEUR, pas un processeur. Déléguez tout le traitement aux microservices !** 🎉
