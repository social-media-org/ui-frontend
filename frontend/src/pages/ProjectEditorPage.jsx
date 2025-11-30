import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader } from 'lucide-react';
import clsx from 'clsx';
import StatusBadge from '../components/StatusBadge';
import ScriptTab from '../components/editor/ScriptTab';
import AudioTab from '../components/editor/AudioTab';
import ImagesTab from '../components/editor/ImagesTab';
import VideoTab from '../components/editor/VideoTab';
import PreviewPanel from '../components/editor/PreviewPanel';
import { projectsAPI } from '../services/api';
import { formatTime } from '../utils/helpers';

const ProjectEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewProject = id === 'new';

  const [project, setProject] = useState({
    title: 'Untitled Project',
    description: '',
    language: 'en',
    use_case: 'explanation',
    status: 'draft',
    script_text: '',
    script_style: 'educational',
    voice_id: 'alloy',
    audio_speed: 1.0,
    audio_pitch: 1.0,
    audio_url: null,
    image_style: 'realistic',
    images: [], // New format: array of {prompt: string, url: string}
    resolution: '1080p',
    fps: 30,
    video_template_id: 'basic_fade',
    background_music: 'none',
    video_url: null,
    keywords: '',
    video_description: '',
    video_inspirations: [],
    duration: 0,
    nb_section: 1, // Default value for number of sections
  });

  const [activeTab, setActiveTab] = useState('script');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState({});
  const [lastSaved, setLastSaved] = useState(null);

  const tabs = [
    { id: 'script', label: 'Script' },
    { id: 'audio', label: 'Audio' },
    { id: 'images', label: 'Images' },
    { id: 'video', label: 'Video' },
  ];

  // Load project if editing
  useEffect(() => {
    if (!isNewProject) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const data = await projectsAPI.getById(id);
      setProject(data);
      setLastSaved(data.updatedAt);
    } catch (error) {
      console.error('Error fetching project:', error);
      alert('Failed to load project');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (updates) => {
    setProject({ ...project, ...updates });
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      let savedProject;
      if (isNewProject) {
        savedProject = await projectsAPI.create(project);
        // Navigate to the new project's edit page
        navigate(`/projects/${savedProject.id}`, { replace: true });
      } else {
        savedProject = await projectsAPI.update(id, project);
      }

      setProject(savedProject);
      setLastSaved(new Date().toISOString());
      alert('Project saved successfully!');
    } catch (error) {
      console.error('Error saving project:', error);
      alert('Failed to save project');
    } finally {
      setSaving(false);
    }
  };

  const handleGenerateScript = async () => {
    try {
      setGenerating({ ...generating, script: true });

      const updatedProject = await projectsAPI.generateScript(
        isNewProject ? 'temp' : id,
        {
          title: project.title,
          description: project.description,
          use_case: project.use_case,
          language: project.language,
          style: project.script_style,
          nb_section: project.nb_section,
          keywords: project.keywords,
          video_inspirations: project.video_inspirations,
        }
      );

      // Update project with generated script
      handleChange({
        script_text: updatedProject.script_text,
        status: 'script_generated',
      });

      alert('Script generated successfully!');
    } catch (error) {
      console.error('Error generating script:', error);
      alert('Failed to generate script');
    } finally {
      setGenerating({ ...generating, script: false });
    }
  };

  const handleGenerateAudio = async () => {
    try {
      setGenerating({ ...generating, audio: true });

      const updatedProject = await projectsAPI.generateAudio(
        isNewProject ? 'temp' : id,
        {
          script_text: project.script_text,
          voice_id: project.voice_id,
          audio_speed: project.audio_speed,
          audio_pitch: project.audio_pitch,
          language: project.language,
        }
      );

      handleChange({
        audio_url: updatedProject.audio_url,
        status: 'audio_generated',
      });

      alert('Audio generated successfully!');
    } catch (error) {
      console.error('Error generating audio:', error);
      alert('Failed to generate audio');
    } finally {
      setGenerating({ ...generating, audio: false });
    }
  };

  const handleGenerateImages = async () => {
    try {
      setGenerating({ ...generating, images: true });

      const updatedProject = await projectsAPI.generateImages(
        isNewProject ? 'temp' : id,
        {
          images: project.images,
          style: project.image_style,
        }
      );

      handleChange({
        images: updatedProject.images,
        status: 'images_ready',
      });

      alert('Images generated successfully!');
    } catch (error) {
      console.error('Error generating images:', error);
      alert('Failed to generate images');
    } finally {
      setGenerating({ ...generating, images: false });
    }
  };

  const handleGenerateSingleImage = async (sceneIndex) => {
    try {
      setGenerating({ ...generating, [`image-${sceneIndex}`]: true });

      const updatedProject = await projectsAPI.generateSingleImage(
        isNewProject ? 'temp' : id,
        sceneIndex,
        {
          prompt: project.images[sceneIndex].prompt,
          style: project.image_style,
        }
      );

      // Update only the specific image URL
      const newImages = [...project.images];
      newImages[sceneIndex] = {
        ...newImages[sceneIndex],
        url: updatedProject.image_url
      };

      handleChange({ images: newImages });

      alert(`Image for scene ${sceneIndex + 1} generated successfully!`);
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image');
    } finally {
      setGenerating({ ...generating, [`image-${sceneIndex}`]: false });
    }
  };

  const handleGenerateVideo = async () => {
    try {
      setGenerating({ ...generating, video: true });

      const updatedProject = await projectsAPI.generateVideo(
        isNewProject ? 'temp' : id,
        {
          resolution: project.resolution,
          fps: project.fps,
          template: project.video_template_id,
          background_music: project.background_music,
        }
      );

      handleChange({
        video_url: updatedProject.video_url,
        duration: updatedProject.duration,
        thumbnail: updatedProject.thumbnail,
        status: 'video_ready',
      });

      alert('Video rendered successfully!');
    } catch (error) {
      console.error('Error generating video:', error);
      alert('Failed to render video');
    } finally {
      setGenerating({ ...generating, video: false });
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader className="w-8 h-8 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-gray-900 transition-colors"
              data-testid="back-button"
            >
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900" data-testid="project-title-header">
                  {project.title}
                </h1>
                <StatusBadge status={project.status} />
              </div>
              {lastSaved && (
                <p className="text-sm text-gray-500 mt-1" data-testid="last-saved-time">
                  Last saved: {formatTime(lastSaved)}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="btn-secondary flex items-center gap-2"
              data-testid="save-button"
            >
              {saving ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save
                </>
              )}
            </button>

            <button
              onClick={handleGenerateVideo}
              disabled={generating.video || !project.script_text || !project.audio_url}
              className="btn-primary"
              data-testid="generate-video-header-button"
            >
              {generating.video ? 'Rendering...' : 'Generate Video'}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-4 border-b border-gray-200 -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx('tab-button', activeTab === tab.id && 'active')}
              data-testid={`tab-${tab.id}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content - Two Columns */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex">
          {/* Left Column - Form */}
          <div className="w-1/2 overflow-y-auto p-8 border-r border-gray-200" data-testid="form-column">
            {activeTab === 'script' && (
              <ScriptTab
                project={project}
                onChange={handleChange}
                onGenerate={handleGenerateScript}
                loading={generating.script}
              />
            )}
            {activeTab === 'audio' && (
              <AudioTab
                project={project}
                onChange={handleChange}
                onGenerate={handleGenerateAudio}
                loading={generating.audio}
              />
            )}
            {activeTab === 'images' && (
              <ImagesTab
                project={project}
                onChange={handleChange}
                onGenerate={handleGenerateImages}
                onGenerateSingle={handleGenerateSingleImage}
                loading={generating.images}
              />
            )}
            {activeTab === 'video' && (
              <VideoTab
                project={project}
                onChange={handleChange}
                onGenerate={handleGenerateVideo}
                loading={generating.video}
              />
            )}
          </div>

          {/* Right Column - Preview or Script Content */}
          <div className="w-1/2 overflow-y-auto p-8 pt-6 bg-gray-50" data-testid="preview-column">
            {activeTab === 'script' ? (
              /* Script Content */
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Script Content</h3>
                <textarea
                  value={project.script_text || ''}
                  onChange={(e) => handleChange({ script_text: e.target.value })}
                  className="input-field font-mono text-sm w-full"
                  rows={25}
                  placeholder="Enter your script here or generate one..."
                  data-testid="script-content-area"
                />
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{(project.script_text || '').length} characters</span>
                  <span>~{Math.ceil((project.script_text || '').length / 2.5)} seconds</span>
                </div>
              </div>
            ) : (
              /* Preview Panel for other tabs */
              <PreviewPanel project={project} activeTab={activeTab} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectEditorPage;
