import React from 'react';
import { FileText, Loader, Plus, X } from 'lucide-react';
import { estimateDuration } from '../../utils/helpers';

const ScriptTab = ({ project, onChange, onGenerate, loading }) => {
  const characterCount = (project.script_text || '').length;
  const estimatedDuration = estimateDuration(project.script_text || '');

  const handleVideoInspirationAdd = () => {
    const newInspirations = [...(project.video_inspirations || []), ''];
    onChange({ video_inspirations: newInspirations });
  };

  const handleVideoInspirationChange = (index, value) => {
    const newInspirations = [...project.video_inspirations];
    newInspirations[index] = value;
    onChange({ video_inspirations: newInspirations });
  };

  const handleVideoInspirationRemove = (index) => {
    const newInspirations = project.video_inspirations.filter((_, i) => i !== index);
    onChange({ video_inspirations: newInspirations });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Script & Project Details</h3>
        <button
          onClick={onGenerate}
          disabled={loading}
          className="btn-primary flex items-center gap-2"
          data-testid="generate-script-button"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              Generate Script
            </>
          )}
        </button>
      </div>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Title *
        </label>
        <input
          type="text"
          value={project.title || ''}
          onChange={(e) => onChange({ title: e.target.value })}
          className="input-field"
          placeholder="Enter project title"
          data-testid="project-title-input"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={project.description || ''}
          onChange={(e) => onChange({ description: e.target.value })}
          className="input-field"
          rows={3}
          placeholder="Describe your project"
          data-testid="project-description-input"
        />
      </div>

      {/* Language */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Language *
        </label>
        <select
          value={project.language || 'en'}
          onChange={(e) => onChange({ language: e.target.value })}
          className="input-field"
          data-testid="project-language-select"
        >
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
          <option value="de">German</option>
          <option value="it">Italian</option>
          <option value="pt">Portuguese</option>
        </select>
      </div>

      {/* Use Case */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Use Case *
        </label>
        <select
          value={project.use_case || 'explanation'}
          onChange={(e) => onChange({ use_case: e.target.value })}
          className="input-field"
          data-testid="project-usecase-select"
        >
          <option value="storytelling">Storytelling</option>
          <option value="youtube_short">YouTube Short</option>
          <option value="explanation">Explanation</option>
          <option value="commercial">Commercial</option>
          <option value="inspirational">Inspirational</option>
          <option value="educational">Educational</option>
          <option value="tutorial">Tutorial</option>
        </select>
      </div>

      {/* Script Style */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Script Style
        </label>
        <select
          value={project.script_style || 'educational'}
          onChange={(e) => onChange({ script_style: e.target.value })}
          className="input-field"
          data-testid="script-style-select"
        >
          <option value="educational">Educational</option>
          <option value="inspirational">Inspirational</option>
          <option value="comedic">Comedic</option>
          <option value="dramatic">Dramatic</option>
          <option value="casual">Casual</option>
          <option value="professional">Professional</option>
        </select>
      </div>

      {/* Video Inspirations */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Video Inspiration
        </label>
        <p className="text-xs text-gray-500 mb-3">Reference videos or styles</p>
        
        <div className="space-y-2">
          {(project.video_inspirations || []).map((inspiration, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={inspiration}
                onChange={(e) => handleVideoInspirationChange(index, e.target.value)}
                className="input-field"
                placeholder={`Video inspiration ${index + 1}...`}
                data-testid={`video-inspiration-input-${index}`}
              />
              <button
                onClick={() => handleVideoInspirationRemove(index)}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                data-testid={`remove-inspiration-${index}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={handleVideoInspirationAdd}
          className="mt-3 flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
          data-testid="add-video-inspiration-button"
        >
          <Plus className="w-4 h-4" />
          Add Video Inspiration
        </button>
      </div>

      {/* Script Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Script Content
        </label>
        <textarea
          value={project.script_text || ''}
          onChange={(e) => onChange({ script_text: e.target.value })}
          className="input-field font-mono text-sm"
          rows={12}
          placeholder="Enter your script here or generate one..."
          data-testid="script-text-area"
        />
        
        <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
          <span data-testid="character-count">{characterCount} characters</span>
          <span data-testid="estimated-duration">~{estimatedDuration} seconds</span>
        </div>
      </div>
    </div>
  );
};

export default ScriptTab;
