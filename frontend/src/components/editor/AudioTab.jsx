import React from 'react';
import { Mic, Loader, Volume2 } from 'lucide-react';

const AudioTab = ({ project, onChange, onGenerate, loading }) => {
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
      {project.audio_path && (
        <div className="bg-gray-50 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Audio Preview
          </label>
          <audio controls className="w-full" data-testid="audio-player">
            <source src={project.audio_path} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
};

export default AudioTab;
