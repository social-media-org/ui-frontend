import React from 'react';
import { Video, Loader, Play } from 'lucide-react';

const VideoTab = ({ project, onChange, onGenerate, loading }) => {
  const fpsOptions = [24, 30, 60];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Video Configuration</h3>
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
      </div>

      {(!project.script_text || !project.audio_path) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
          <p>⚠️ Please generate script and audio before rendering video.</p>
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
          Motion Template
        </label>
        <select
          value={project.video_template_id || 'basic_fade'}
          onChange={(e) => onChange({ video_template_id: e.target.value })}
          className="input-field"
          data-testid="video-template-select"
        >
          <option value="basic_fade">Basic Fade</option>
          <option value="slide_left">Slide Left</option>
          <option value="slide_right">Slide Right</option>
          <option value="zoom_in">Zoom In</option>
          <option value="zoom_out">Zoom Out</option>
          <option value="ken_burns">Ken Burns Effect</option>
        </select>
      </div>

      {/* Background Music */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Background Music
        </label>
        <select
          value={project.background_music || 'none'}
          onChange={(e) => onChange({ background_music: e.target.value })}
          className="input-field"
          data-testid="background-music-select"
        >
          <option value="none">None</option>
          <option value="soft">Soft</option>
          <option value="upbeat">Upbeat</option>
          <option value="cinematic">Cinematic</option>
          <option value="corporate">Corporate</option>
          <option value="ambient">Ambient</option>
        </select>
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
