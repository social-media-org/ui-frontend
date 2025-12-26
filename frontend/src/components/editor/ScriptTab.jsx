import React from 'react';
import { FileText, Loader, Plus, X, Sparkles } from 'lucide-react';
import { estimateDuration } from '../../utils/helpers';

const ScriptTab = ({ project, onChange, onGenerate, loading, onGenerateDescription, generatingDescription }) => {
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
      {/* Header with full width */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Script & Project Details</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={onGenerateDescription}
            disabled={generatingDescription}
            className="btn-tertiary text-sm flex items-center gap-1"
            data-testid="generate-description-button-header"
          >
            {generatingDescription ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Generating Description...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Preremplir la description
              </>
            )}
          </button>
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
      </div>

      {/* Title and Language - Same line on md+ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Title takes more space */}
        <div className="md:col-span-2">
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

      {/* Type de Video, Nombre de sections and Durée */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Type de Video */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Type de Vidéo
          </label>
          <select
            value={project.type_video || ''}
            onChange={(e) => onChange({ type_video: e.target.value })}
            className="input-field"
            data-testid="project-type-video-select"
          >
            <option value="">Aucune valeur</option>
            <option value="LIFE_LESSON">Leçons de vie</option>
            <option value="STOICISM">Stoïcisme</option>
            <option value="X_THINGS_TO_DO">X choses à faire</option>
          </select>
        </div>

        {/* Number of Sections */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de sections
          </label>
          <input
            type="number"
            value={project.nb_section || 3}
            onChange={(e) => onChange({ nb_section: parseInt(e.target.value, 10) || 1 })}
            className="input-field"
            min="1"
            placeholder="Nombre de sections"
            data-testid="nb-section-input"
          />
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Durée (minutes)
          </label>
          <input
            type="number"
            value={project.duration || ''}
            onChange={(e) => onChange({ duration: parseInt(e.target.value, 10) || '' })}
            className="input-field"
            min="1"
            placeholder="Durée estimée"
            data-testid="duration-input"
          />
        </div>
      </div>

      {/* Keywords */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Keywords (séparés par des virgules)
        </label>
        <input
          type="text"
          value={project.keywords || ''}
          onChange={(e) => onChange({ keywords: e.target.value })}
          className="input-field"
          placeholder="mot1, mot2, mot3"
          data-testid="project-keywords-input"
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

      {/* Video Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Video Description
        </label>
        <textarea
          value={project.video_description || ''}
          onChange={(e) => onChange({ video_description: e.target.value })}
          className="input-field"
          rows={3}
          placeholder="Enter a generated video description"
          data-testid="video-description-input"
        />
      </div>

      {/* Thumbnail Prompt */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Thumbnail Prompt
        </label>
        <textarea
          value={project.thumbnail_prompt || ''}
          onChange={(e) => onChange({ thumbnail_prompt: e.target.value })}
          className="input-field"
          rows={3}
          placeholder="Enter thumbnail generation prompt"
          data-testid="thumbnail-prompt-input"
        />
      </div>

    </div>
  );
};

export default ScriptTab;
