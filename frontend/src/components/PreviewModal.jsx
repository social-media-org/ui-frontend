import React from 'react';
import { X, Play } from 'lucide-react';

const PreviewModal = ({ isOpen, onClose, videoUrl, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" data-testid="preview-modal">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title || 'Video Preview'}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            data-testid="preview-modal-close-button"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player */}
        <div className="p-6 bg-gray-900">
          {videoUrl ? (
            <video
              controls
              className="w-full rounded-lg"
              data-testid="video-player"
              key={project.video_url}
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="aspect-video bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-400">
                <Play className="w-16 h-16 mx-auto mb-4" />
                <p>No video available</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreviewModal;
