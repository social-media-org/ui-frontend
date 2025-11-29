# Guide d'Intégration API - AI Studio Backend

## 📌 Vue d'ensemble

Ce document décrit en détail comment implémenter le backend pour l'application AI Studio. Le frontend est déjà complet et fonctionnel avec JSON Server comme API mock. Vous devez créer un backend qui respecte exactement les mêmes endpoints et formats de données.

## 🎯 Objectif

Créer un backend orchestrateur (UI-Service) qui :
1. Gère les projets dans une base de données
2. Orchestre les appels aux microservices de génération IA
3. Respecte les contrats API définis par le frontend

## 🗂️ Structure Recommandée

```
backend/
├── app/
│   ├── main.py              # FastAPI app principale
│   ├── models/
│   │   └── project.py       # Modèles Pydantic/DB
│   ├── routes/
│   │   ├── projects.py      # CRUD endpoints
│   │   └── generation.py    # AI generation endpoints
│   ├── services/
│   │   ├── script_service.py    # Génération script
│   │   ├── audio_service.py     # Génération audio
│   │   ├── image_service.py     # Génération images
│   │   └── video_service.py     # Génération vidéo
│   └── database.py          # Configuration DB
├── requirements.txt
└── .env
```

## 📊 Modèle de Données (MongoDB/PostgreSQL)

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
  "audio_url": "string | null",
  
  // Images
  "image_style": "string (realistic, pixar, anime, flat_design, watercolor, oil_painting, sketch)",
  "images_prompts": ["string"],
  "images_urls": ["string"],
  
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

## 🔌 Endpoints à Implémenter

### 1. GET /projects

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
    ...
  }
]
```

**Exemple d'implémentation (FastAPI):**
```python
@router.get("/projects")
async def get_projects(
    status: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Project)
    
    if status:
        query = query.filter(Project.status == status)
    
    if search:
        query = query.filter(
            or_(
                Project.title.ilike(f"%{search}%"),
                Project.description.ilike(f"%{search}%")
            )
        )
    
    projects = query.order_by(Project.updated_at.desc()).all()
    return projects
```

---

### 2. GET /projects/:id

**Description**: Récupérer un projet spécifique

**Response**: `200 OK` ou `404 Not Found`
```json
{
  "id": "1",
  "title": "The Future of AI",
  ...
}
```

---

### 3. POST /projects

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
  "created_at": "2025-11-29T10:00:00Z",
  ...
}
```

**Exemple d'implémentation:**
```python
@router.post("/projects", status_code=201)
async def create_project(project_data: ProjectCreate, db: Session = Depends(get_db)):
    new_project = Project(
        id=str(uuid.uuid4()),
        title=project_data.title,
        description=project_data.description,
        language=project_data.language,
        use_case=project_data.use_case,
        status="draft",
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project
```

---

### 4. PUT /projects/:id

**Description**: Mettre à jour un projet

**Request Body**: (partial update)
```json
{
  "title": "Updated Title",
  "description": "Updated description"
}
```

**Response**: `200 OK`

---

### 5. DELETE /projects/:id

**Description**: Supprimer un projet

**Response**: `204 No Content` ou `200 OK`

---

### 6. POST /projects/:id/generate-script

**Description**: Générer le script d'un projet

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

**Implémentation recommandée:**

```python
@router.post("/projects/{project_id}/generate-script")
async def generate_script(
    project_id: str,
    data: ScriptGenerationRequest,
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Appel au service de génération de script (OpenAI, Claude, etc.)
    script_text = await script_service.generate(
        title=data.title,
        description=data.description,
        use_case=data.use_case,
        language=data.language,
        style=data.style
    )
    
    # Mise à jour du projet
    project.script_text = script_text
    project.status = "script_generated"
    project.updated_at = datetime.utcnow()
    db.commit()
    
    return {
        "script_text": script_text,
        "status": project.status,
        "updated_at": project.updated_at
    }
```

---

### 7. POST /projects/:id/generate-audio

**Description**: Générer l'audio à partir du script

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
  "audio_url": "https://your-storage.com/audio/project-1.mp3",
  "status": "audio_generated",
  "updated_at": "2025-11-29T10:10:00Z"
}
```

**Implémentation avec ElevenLabs ou OpenAI TTS:**

```python
@router.post("/projects/{project_id}/generate-audio")
async def generate_audio(
    project_id: str,
    data: AudioGenerationRequest,
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Génération audio (ElevenLabs, OpenAI TTS, etc.)
    audio_file = await audio_service.generate(
        text=data.script_text,
        voice_id=data.voice_id,
        speed=data.audio_speed,
        language=data.language
    )
    
    # Upload vers S3/Cloudinary
    audio_url = await storage_service.upload(audio_file, f"audio/{project_id}.mp3")
    
    # Mise à jour du projet
    project.audio_url = audio_url
    project.voice_id = data.voice_id
    project.audio_speed = data.audio_speed
    project.audio_pitch = data.audio_pitch
    project.status = "audio_generated"
    project.updated_at = datetime.utcnow()
    db.commit()
    
    return {
        "audio_url": audio_url,
        "status": project.status,
        "updated_at": project.updated_at
    }
```

---

### 8. POST /projects/:id/generate-images

**Description**: Générer toutes les images pour les scènes

**Request Body**:
```json
{
  "prompts": [
    "A futuristic AI brain",
    "Modern hospital with AI"
  ],
  "style": "realistic"
}
```

**Response**: `200 OK`
```json
{
  "images_urls": [
    "https://your-storage.com/images/project-1-scene-0.png",
    "https://your-storage.com/images/project-1-scene-1.png"
  ],
  "status": "images_ready",
  "updated_at": "2025-11-29T10:15:00Z"
}
```

**Implémentation avec DALL-E, Stable Diffusion, etc.:**

```python
@router.post("/projects/{project_id}/generate-images")
async def generate_images(
    project_id: str,
    data: ImagesGenerationRequest,
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    images_urls = []
    
    # Générer chaque image
    for i, prompt in enumerate(data.prompts):
        # Appel à l'API d'image (DALL-E, SD, etc.)
        image_data = await image_service.generate(
            prompt=f"{prompt}, {data.style} style",
            style=data.style
        )
        
        # Upload vers storage
        image_url = await storage_service.upload(
            image_data, 
            f"images/{project_id}-scene-{i}.png"
        )
        images_urls.append(image_url)
    
    # Mise à jour du projet
    project.images_prompts = data.prompts
    project.images_urls = images_urls
    project.image_style = data.style
    project.status = "images_ready"
    project.updated_at = datetime.utcnow()
    db.commit()
    
    return {
        "images_urls": images_urls,
        "status": project.status,
        "updated_at": project.updated_at
    }
```

---

### 9. POST /projects/:id/generate-images/:sceneIndex

**Description**: Générer/Régénérer une seule image pour une scène spécifique

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

---

### 10. POST /projects/:id/generate-video

**Description**: Assembler et rendre la vidéo finale

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

**Implémentation avec FFmpeg ou service vidéo:**

```python
@router.post("/projects/{project_id}/generate-video")
async def generate_video(
    project_id: str,
    data: VideoGenerationRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    # Vérifier que script, audio et images sont prêts
    if not project.audio_url or not project.images_urls:
        raise HTTPException(
            status_code=400, 
            detail="Audio and images must be generated first"
        )
    
    # Lancer la génération vidéo en arrière-plan (long process)
    background_tasks.add_task(
        video_service.render_video,
        project_id=project_id,
        audio_url=project.audio_url,
        images_urls=project.images_urls,
        resolution=data.resolution,
        fps=data.fps,
        template=data.template,
        background_music=data.background_music
    )
    
    return {
        "message": "Video generation started",
        "status": "processing"
    }

# Dans video_service.py
async def render_video(project_id, audio_url, images_urls, resolution, fps, template, background_music):
    # 1. Télécharger audio et images
    # 2. Créer la vidéo avec FFmpeg
    # 3. Ajouter transitions selon template
    # 4. Ajouter background_music si nécessaire
    # 5. Générer thumbnail
    # 6. Upload vers storage
    # 7. Mettre à jour le projet dans la DB
    
    video_path = f"/tmp/{project_id}.mp4"
    
    # Exemple FFmpeg command
    ffmpeg_command = [
        "ffmpeg",
        "-framerate", str(fps),
        "-pattern_type", "glob",
        "-i", "images/*.png",
        "-i", audio_url,
        "-c:v", "libx264",
        "-preset", "medium",
        "-crf", "23",
        "-c:a", "aac",
        "-b:a", "192k",
        "-pix_fmt", "yuv420p",
        "-vf", f"scale={get_resolution_dimensions(resolution)}",
        video_path
    ]
    
    # Exécuter FFmpeg
    subprocess.run(ffmpeg_command, check=True)
    
    # Upload
    video_url = await storage_service.upload(video_path, f"videos/{project_id}.mp4")
    
    # Mettre à jour le projet
    db = get_db_session()
    project = db.query(Project).filter(Project.id == project_id).first()
    project.video_url = video_url
    project.status = "video_ready"
    project.updated_at = datetime.utcnow()
    db.commit()
```

---

## 🔐 Configuration et Sécurité

### Variables d'Environnement (.env)

```env
# Database
DATABASE_URL=mongodb://localhost:27017/ai_studio
# ou
DATABASE_URL=postgresql://user:password@localhost/ai_studio

# AI Services
OPENAI_API_KEY=sk-...
ELEVENLABS_API_KEY=...
STABILITY_API_KEY=...

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

## 🧪 Testing des Endpoints

### Avec cURL

```bash
# Get all projects
curl http://localhost:8001/projects

# Create project
curl -X POST http://localhost:8001/projects \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Project", "language": "en", "use_case": "explanation"}'

# Generate script
curl -X POST http://localhost:8001/projects/1/generate-script \
  -H "Content-Type: application/json" \
  -d '{"title": "Test", "use_case": "explanation", "style": "educational"}'
```

---

## 📦 Services de Génération IA Recommandés

### Script Generation
- **OpenAI GPT-4/GPT-3.5**: Excellent pour du contenu créatif
- **Claude (Anthropic)**: Très bon pour des scripts structurés
- **Google Gemini**: Alternative gratuite/économique

**Exemple OpenAI:**
```python
import openai

async def generate_script(title, description, use_case, style):
    prompt = f"""
    Create a video script for:
    Title: {title}
    Description: {description}
    Use Case: {use_case}
    Style: {style}
    
    Write a compelling, engaging script suitable for video narration.
    """
    
    response = await openai.ChatCompletion.acreate(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}]
    )
    
    return response.choices[0].message.content
```

### Audio Generation
- **ElevenLabs**: Meilleure qualité vocale
- **OpenAI TTS**: Bon rapport qualité/prix
- **Google Cloud TTS**: Option économique

**Exemple ElevenLabs:**
```python
import elevenlabs

async def generate_audio(text, voice_id, speed):
    audio = elevenlabs.generate(
        text=text,
        voice=voice_id,
        model="eleven_monolingual_v1",
        stability=0.5,
        similarity_boost=0.75,
        style=speed
    )
    return audio
```

### Image Generation
- **DALL-E 3**: Haute qualité
- **Stable Diffusion**: Open-source, personnalisable
- **Midjourney API**: Excellent style artistique

**Exemple DALL-E:**
```python
async def generate_image(prompt, style):
    response = await openai.Image.acreate(
        model="dall-e-3",
        prompt=f"{prompt}, {style} style, high quality",
        size="1024x1024",
        quality="hd",
        n=1
    )
    return response.data[0].url
```

### Video Assembly
- **FFmpeg**: Assemblage local
- **RunwayML API**: Effets avancés
- **Pika Labs**: Génération vidéo IA

---

## 🚀 Déploiement

### Docker

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install FFmpeg
RUN apt-get update && apt-get install -y ffmpeg

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8001"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8001:8001"
    environment:
      - DATABASE_URL=mongodb://mongo:27017/ai_studio
    depends_on:
      - mongo
  
  mongo:
    image: mongo:7
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

---

## ✅ Checklist d'Implémentation

- [ ] Configuration base de données (MongoDB/PostgreSQL)
- [ ] Modèle Project avec tous les champs
- [ ] Endpoints CRUD (GET, POST, PUT, DELETE /projects)
- [ ] Service de génération de script (OpenAI/Claude)
- [ ] Service de génération audio (ElevenLabs/OpenAI TTS)
- [ ] Service de génération d'images (DALL-E/SD)
- [ ] Service d'assemblage vidéo (FFmpeg)
- [ ] Upload vers storage (S3/Cloudinary)
- [ ] CORS configuré pour frontend
- [ ] Gestion d'erreurs appropriée
- [ ] Logging et monitoring
- [ ] Tests unitaires et d'intégration
- [ ] Documentation API (Swagger/OpenAPI)

---

## 📚 Resources Utiles

- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [OpenAI API](https://platform.openai.com/docs)
- [ElevenLabs API](https://docs.elevenlabs.io)
- [FFmpeg Documentation](https://ffmpeg.org/documentation.html)
- [MongoDB with FastAPI](https://www.mongodb.com/languages/python/pymongo-tutorial)

---

**Bon développement ! N'hésitez pas à adapter ce guide selon vos besoins spécifiques.** 🎉
