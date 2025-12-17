import React, { useState, useEffect } from 'react';
import { Video, Loader, Play, Subtitles } from 'lucide-react';
import { projectsAPI } from '../../services/api';

const VideoTab = ({ project, onChange, onGenerate, loading }) => {
  const fpsOptions = [24, 30, 60];
  const [templates, setTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [addingSubtitles, setAddingSubtitles] = useState(false);
  const [subtitleStyles, setSubtitleStyles] = useState([]);
  const [subtitlePositions, setSubtitlePositions] = useState([]);
  const [loadingStyles, setLoadingStyles] = useState(false);
  const [loadingPositions, setLoadingPositions] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('classic');
  const [selectedPosition, setSelectedPosition] = useState('bottom');
  
  // Load video templates, subtitle styles and positions on component mount
  useEffect(() => {
    const loadTemplates = async () => {
      try {
        setLoadingTemplates(true);
        const response = await projectsAPI.getVideoTemplates();
        setTemplates(response.templates || []);
      } catch (error) {
        console.error('Error loading video templates:', error);
      } finally {
        setLoadingTemplates(false);
      }
    };

    const loadSubtitleStyles = async () => {
      try {
        setLoadingStyles(true);
        const response = await projectsAPI.getSubtitleStyles();
        setSubtitleStyles(response.styles || []);
      } catch (error) {
        console.error('Error loading subtitle styles:', error);
      } finally {
        setLoadingStyles(false);
      }
    };

    const loadSubtitlePositions = async () => {
      try {
        setLoadingPositions(true);
        const response = await projectsAPI.getSubtitlePositions();
        setSubtitlePositions(response.positions || []);
      } catch (error) {
        console.error('Error loading subtitle positions:', error);
      } finally {
        setLoadingPositions(false);
      }
    };
    
    loadTemplates();
    loadSubtitleStyles();
    loadSubtitlePositions();
  }, []);

  const handleAddSubtitles = async () => {
    if (!project.video_url || !project.subtitle_path) {
      alert('Video and subtitles are required to add subtitles to video');
      return;
    }
    
    try {
      setAddingSubtitles(true);
      const data = {
        style_name: selectedStyle,
        position_name: selectedPosition,
        async_processing: false,
      };
      const updatedProject = await projectsAPI.addSubtitlesToVideo(project.id, data);
      // Notify parent component about the update
      onChange(updatedProject);
      alert('Subtitles added successfully!');
    } catch (error) {
      console.error('Error adding subtitles:', error);
      alert('Failed to add subtitles: ' + (error.response?.data?.detail || error.message));
    } finally {
      setAddingSubtitles(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Video Configuration</h3>
        <div className="flex gap-2">
          <button
            onClick={onGenerate}
            disabled={loading || !project.script_text || !project.audio_path}
            className="btn-primary flex items-center gap-2"
            data-testid="render-video-button"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Rendering...
              </>
            ) : (
              <>
                <Video className="w-4 h-4" />
                Render Video
              </>
            )}
          </button>
          <button
            onClick={handleAddSubtitles}
            disabled={addingSubtitles || !project.video_url || !project.subtitle_path}
            className="btn-secondary flex items-center gap-2"
            data-testid="add-subtitles-button"
          >
            {addingSubtitles ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Adding Subtitles...
              </>
            ) : (
              <>
                <Subtitles className="w-4 h-4" />
                Add Subtitles
              </>
            )}
          </button>
        </div>
      </div>

      {(!project.script_text || !project.audio_path) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
          <p>⚠️ Please generate script and audio before rendering video.</p>
        </div>
      )}

      {project.video_url && !project.subtitle_path && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <p>ℹ️ Video rendered but no subtitles available. Generate subtitles from Audio tab first.</p>
        </div>
      )}

      {project.video_url && project.subtitle_path && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-sm text-green-800">
          <p>✅ Video and subtitles ready. Click "Add Subtitles" to render subtitles on video.</p>
        </div>
      )}

      {/* Resolution */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Resolution
        </label>
        <select
          value={project.resolution || '1080p'}
          onChange={(e) => onChange({ resolution: e.target.value })}
          className="input-field"
          data-testid="video-resolution-select"
        >
          <option value="720p">720p (HD)</option>
          <option value="1080p">1080p (Full HD)</option>
          <option value="1440p">1440p (2K)</option>
          <option value="2160p">2160p (4K)</option>
        </select>
      </div>

      {/* Frame Rate */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Frame Rate (FPS)
        </label>
        <div className="flex gap-3">
          {fpsOptions.map((fps) => (
            <button
              key={fps}
              onClick={() => onChange({ fps })}
              className={`px-6 py-3 rounded-lg border-2 font-medium transition-all ${
                project.fps === fps
                  ? 'border-primary-600 bg-primary-50 text-primary-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
              data-testid={`fps-${fps}-button`}
            >
              {fps}
            </button>
          ))}
        </div>
      </div>

      {/* Motion Template */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Video Template
        </label>
        {loadingTemplates ? (
          <div className="input-field flex items-center gap-2">
            <Loader className="w-4 h-4 animate-spin" />
            Loading templates...
          </div>
        ) : templates.length === 0 ? (
          <div className="input-field text-gray-500">
            No video templates available
          </div>
        ) : (
          <select
            value={project.video_template_path || ''}
            onChange={(e) => onChange({ video_template_path: e.target.value })}
            className="input-field"
            data-testid="video-template-select"
          >
            <option value="">Select a video template...</option>
            {templates.map((template) => (
              <option key={template.absolute_path} value={template.absolute_path}>
                {template.label}
              </option>
            ))}
          </select>
        )}
        {project.video_template_path && (
          <p className="text-xs text-gray-500 mt-1">
            Selected: {project.video_template_path}
          </p>
        )}
      </div>

      {/* Background Music */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Background Music
        </label>
        <select
          value={project.background_music || ''}
          onChange={(e) => onChange({ background_music: e.target.value })}
          className="input-field"
          data-testid="background-music-select"
        >
          <option value="">None</option>
          <option value="soft">Soft</option>
          <option value="upbeat">Upbeat</option>
          <option value="cinematic">Cinematic</option>
          <option value="corporate">Corporate</option>
          <option value="ambient">Ambient</option>
        </select>
      </div>

      {/* Subtitle Style */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subtitle Style
        </label>
        {loadingStyles ? (
          <div className="input-field flex items-center gap-2">
            <Loader className="w-4 h-4 animate-spin" />
            Loading styles...
          </div>
        ) : subtitleStyles.length === 0 ? (
          <div className="input-field text-gray-500">
            No subtitle styles available
          </div>
        ) : (
          <select
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value)}
            className="input-field"
            data-testid="subtitle-style-select"
          >
            {subtitleStyles.map((style) => (
              <option key={style.name} value={style.name}>
                {style.name} - {style.description}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Subtitle Position */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Subtitle Position
        </label>
        {loadingPositions ? (
          <div className="input-field flex items-center gap-2">
            <Loader className="w-4 h-4 animate-spin" />
            Loading positions...
          </div>
        ) : subtitlePositions.length === 0 ? (
          <div className="input-field text-gray-500">
            No subtitle positions available
          </div>
        ) : (
          <select
            value={selectedPosition}
            onChange={(e) => setSelectedPosition(e.target.value)}
            className="input-field"
            data-testid="subtitle-position-select"
          >
            {subtitlePositions.map((position) => (
              <option key={position.name} value={position.name}>
                {position.name} - {position.description}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Video Preview */}
      {project.video_url && (
        <div className="bg-gray-50 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Video Preview
          </label>
          <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
            <video controls className="w-full h-full" data-testid="video-preview-player">
              <source src={project.video_url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-gray-600">Duration: {project.duration}s</span>
            <span className="text-gray-600">{project.resolution} • {project.fps} FPS</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoTab;
