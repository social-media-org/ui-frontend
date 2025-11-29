import React from 'react';
import { FileText, Loader } from 'lucide-react';
import { estimateDuration } from '../../utils/helpers';

const ScriptTab = ({ project, onChange, onGenerate, loading }) => {
  const characterCount = (project.script_text || '').length;
  const estimatedDuration = estimateDuration(project.script_text || '');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Script Generation</h3>
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
