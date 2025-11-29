import React from 'react';
import { Image, Loader, Plus, X, RefreshCw } from 'lucide-react';

const ImagesTab = ({ project, onChange, onGenerate, onGenerateSingle, loading }) => {
  const handleAddScenePrompt = () => {
    const newPrompts = [...(project.images_prompts || []), ''];
    const newUrls = [...(project.images_urls || []), null];
    onChange({ images_prompts: newPrompts, images_urls: newUrls });
  };

  const handlePromptChange = (index, value) => {
    const newPrompts = [...project.images_prompts];
    newPrompts[index] = value;
    onChange({ images_prompts: newPrompts });
  };

  const handleRemoveScene = (index) => {
    const newPrompts = project.images_prompts.filter((_, i) => i !== index);
    const newUrls = project.images_urls.filter((_, i) => i !== index);
    onChange({ images_prompts: newPrompts, images_urls: newUrls });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Image Generation</h3>
        <button
          onClick={onGenerate}
          disabled={loading || (project.images_prompts || []).length === 0}
          className="btn-primary flex items-center gap-2"
          data-testid="generate-all-images-button"
        >
          {loading ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Image className="w-4 h-4" />
              Generate All Images
            </>
          )}
        </button>
      </div>

      {/* Visual Style */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Visual Style
        </label>
        <select
          value={project.image_style || 'realistic'}
          onChange={(e) => onChange({ image_style: e.target.value })}
          className="input-field"
          data-testid="image-style-select"
        >
          <option value="realistic">Realistic</option>
          <option value="pixar">Pixar / 3D</option>
          <option value="anime">Anime</option>
          <option value="flat_design">Flat Design</option>
          <option value="watercolor">Watercolor</option>
          <option value="oil_painting">Oil Painting</option>
          <option value="sketch">Sketch</option>
        </select>
      </div>

      {/* Scene Prompts */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Scene Prompts & Images
        </label>
        <p className="text-xs text-gray-500 mb-4">One prompt per scene</p>

        <div className="space-y-4">
          {(project.images_prompts || []).map((prompt, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => handlePromptChange(index, e.target.value)}
                    className="input-field"
                    placeholder={`Describe scene ${index + 1}...`}
                    data-testid={`scene-prompt-input-${index}`}
                  />
                </div>
                <button
                  onClick={() => handleRemoveScene(index)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  data-testid={`delete-scene-${index}`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Image Preview */}
              {project.images_urls && project.images_urls[index] && (
                <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={project.images_urls[index]}
                    alt={`Scene ${index + 1}`}
                    className="w-full h-full object-cover"
                    data-testid={`scene-image-${index}`}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => onGenerateSingle(index)}
                  disabled={loading || !prompt}
                  className="btn-secondary text-sm flex items-center gap-2"
                  data-testid={`generate-scene-${index}`}
                >
                  <Image className="w-4 h-4" />
                  Generate
                </button>
                {project.images_urls && project.images_urls[index] && (
                  <button
                    onClick={() => onGenerateSingle(index)}
                    disabled={loading}
                    className="btn-secondary text-sm flex items-center gap-2"
                    data-testid={`regenerate-scene-${index}`}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Regenerate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleAddScenePrompt}
          className="mt-4 flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
          data-testid="add-scene-prompt-button"
        >
          <Plus className="w-4 h-4" />
          Add Scene Prompt
        </button>
      </div>
    </div>
  );
};

export default ImagesTab;
