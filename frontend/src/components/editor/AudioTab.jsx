import React from 'react';
import { Mic, Loader, Volume2, FileText } from 'lucide-react';

const AudioTab = ({ project, onChange, onGenerate, onGenerateSubtitle, loading, generatingSubtitle }) => {
  const voices = [
    { id: 'alloy', label: 'Alloy', description: 'Neutral' },
    { id: 'echo', label: 'Echo', description: 'Male, clear' },
    { id: 'fable', label: 'Fable', description: 'British, warm' },
    { id: 'onyx', label: 'Onyx', description: 'Deep, authoritative' },
    { id: 'nova', label: 'Nova', description: 'Female, friendly' },
    { id: 'shimmer', label: 'Shimmer', description: 'Soft, gentle' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Audio Settings</h3>
        <div className="flex gap-2">
          <button
            onClick={onGenerate}
            disabled={loading || !project.script_text}
            className="btn-primary flex items-center gap-2"
            data-testid="generate-audio-button"
          >
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Mic className="w-4 h-4" />
                Generate Audio
              </>
            )}
          </button>
          <button
            onClick={onGenerateSubtitle}
            disabled={generatingSubtitle || !project.audio_path}
            className="btn-secondary flex items-center gap-2"
            data-testid="generate-subtitle-button"
          >
            {generatingSubtitle ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Generate Subtitle
              </>
            )}
          </button>
        </div>
      </div>

      {!project.script_text && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
          <p>⚠️ Please generate or enter a script first before generating audio.</p>
        </div>
      )}

      {/* Voice Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Voice Selection
        </label>
        <div className="grid grid-cols-2 gap-3">
          {voices.map((voice) => (
            <button
              key={voice.id}
              onClick={() => onChange({ voice_id: voice.id })}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                project.voice_id === voice.id
                  ? 'border-primary-600 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
              data-testid={`voice-${voice.id}-button`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Volume2 className="w-4 h-4" />
                <span className="font-medium text-gray-900">{voice.label}</span>
              </div>
              <p className="text-xs text-gray-500">{voice.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Speed Control */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Speed: {project.audio_speed || 1.0}x
        </label>
        <input
          type="range"
          min="0.7"
          max="1.3"
          step="0.1"
          value={project.audio_speed || 1.0}
          onChange={(e) => onChange({ audio_speed: parseFloat(e.target.value) })}
          className="w-full"
          data-testid="audio-speed-slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0.7x (Slow)</span>
          <span>1.0x (Normal)</span>
          <span>1.3x (Fast)</span>
        </div>
      </div>

      {/* Pitch Control */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pitch: {project.audio_pitch || 1.0}
        </label>
        <input
          type="range"
          min="0.7"
          max="1.3"
          step="0.1"
          value={project.audio_pitch || 1.0}
          onChange={(e) => onChange({ audio_pitch: parseFloat(e.target.value) })}
          className="w-full"
          data-testid="audio-pitch-slider"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0.7 (Lower)</span>
          <span>1.0 (Normal)</span>
          <span>1.3 (Higher)</span>
        </div>
      </div>

      {/* Audio Preview */}
      {(project.audio_url || project.audio_path) && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <label className="block text-sm font-medium text-gray-700">
            Audio Preview
          </label>
          
          {/* Audio Player */}
          <div className="bg-white rounded-lg p-4">
            <audio controls className="w-full" data-testid="audio-player">
              <source src={project.audio_url || project.audio_path} type="audio/mpeg" />
              <source src={project.audio_url || project.audio_path} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
          </div>
          
          {/* Audio Info */}
          <div className="bg-white rounded-lg p-4 space-y-2">
            <h5 className="font-medium text-gray-800 mb-3">Audio Information</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Voice:</span>
                <span className="ml-2 font-medium">{project.voice_id || 'Alloy'}</span>
              </div>
              <div>
                <span className="text-gray-600">Speed:</span>
                <span className="ml-2 font-medium">{project.audio_speed || 1.0}x</span>
              </div>
              <div>
                <span className="text-gray-600">Pitch:</span>
                <span className="ml-2 font-medium">{project.audio_pitch || 1.0}</span>
              </div>
              {(project.audio_url || project.audio_path) && (
                <div className="sm:col-span-2 lg:col-span-3">
                  <span className="text-gray-600">Audio URL:</span>
                  <span className="ml-2 font-mono text-xs bg-gray-100 px-2 py-1 rounded break-all">
                    {project.audio_url || project.audio_path}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Subtitle Info */}
      {project.subtitle_path && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <label className="block text-sm font-medium text-green-700 mb-2">
            Subtitle Available
          </label>
          <p className="text-sm text-green-600">
            Subtitle file: {project.subtitle_path}
          </p>
        </div>
      )}
    </div>
  );
};

export default AudioTab;
