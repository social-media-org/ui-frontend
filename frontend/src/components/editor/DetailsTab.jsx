import React from 'react';
import { Plus, X } from 'lucide-react';

const DetailsTab = ({ project, onChange }) => {
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
      <h3 className="text-lg font-semibold text-gray-900">Project Details</h3>

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
    </div>
  );
};

export default DetailsTab;
