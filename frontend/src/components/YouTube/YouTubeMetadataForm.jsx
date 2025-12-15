import React, { useState } from 'react';
import { Save, Loader, AlertCircle, CheckCircle } from 'lucide-react';
import { youtubeVideosAPI } from '../../services/youtube.api';

const YouTubeMetadataForm = ({ youtubeVideoId, initialData, onUpdate }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [tags, setTags] = useState(initialData?.tags?.join(', ') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const tagsArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0);

      const response = await youtubeVideosAPI.updateMetadata(youtubeVideoId, {
        title: title.trim(),
        description: description.trim(),
        tags: tagsArray,
      });

      setSuccess(true);
      
      if (onUpdate) {
        onUpdate(response);
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating metadata:', err);
      setError(err.response?.data?.detail || 'Failed to update video metadata');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-testid="youtube-metadata-form">
      {/* Success Message */}
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-800" data-testid="success-message">
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">Metadata updated successfully!</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800" data-testid="error-message">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Video title"
          maxLength={100}
          className="input-field"
          data-testid="metadata-title-input"
          required
        />
        <p className="text-xs text-gray-500 mt-1">{title.length}/100 characters</p>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Video description"
          rows={4}
          maxLength={5000}
          className="input-field resize-none"
          data-testid="metadata-description-input"
        />
        <p className="text-xs text-gray-500 mt-1">{description.length}/5000 characters</p>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tags
        </label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="tag1, tag2, tag3"
          className="input-field"
          data-testid="metadata-tags-input"
        />
        <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="btn-primary flex items-center gap-2"
        data-testid="update-metadata-button"
      >
        {loading ? (
          <>
            <Loader className="w-4 h-4 animate-spin" />
            Updating...
          </>
        ) : (
          <>
            <Save className="w-4 h-4" />
            Update Metadata
          </>
        )}
      </button>
    </form>
  );
};

export default YouTubeMetadataForm;
