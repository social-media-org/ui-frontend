import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Play, FileText, Mic, Image as ImageIcon, Video } from 'lucide-react';
import StatusBadge from './StatusBadge';
import { formatDate } from '../utils/helpers';

const ProjectCard = ({ project, onDelete, onPreview, onGenerate }) => {
  const [showActions, setShowActions] = useState(false);

  return (
    <div
      className="card relative"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      data-testid={`project-card-${project.id}`}
    >
      {/* Thumbnail */}
      <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover"
            data-testid="project-thumbnail"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <Video className="w-12 h-12" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1" data-testid="project-title">
            {project.title}
          </h3>
          <StatusBadge status={project.status} />
        </div>

        {project.description && (
          <p className="text-sm text-gray-600 line-clamp-2" data-testid="project-description">
            {project.description}
          </p>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span data-testid="project-updated-date">Updated: {formatDate(project.updatedAt)}</span>
          {project.duration > 0 && (
            <span data-testid="project-duration">{project.duration}s</span>
          )}
        </div>

        {/* YouTube Publication Info */}
        {(project.status === 'scheduled_for_publish' || project.status === 'uploaded_to_youtube') && (
          <div className="pt-2 border-t border-gray-200">
            {project.youtube_scheduled_publish_at && (
              <p className="text-xs text-purple-700 font-medium">
                📅 Publication: {new Date(project.youtube_scheduled_publish_at).toLocaleString('fr-FR', { 
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            )}
            {project.youtube_is_premiere && (
              <p className="text-xs text-purple-700 font-medium mt-1">📺 Mode Première</p>
            )}
            {project.youtube_url && project.status === 'uploaded_to_youtube' && (
              <p className="text-xs text-green-700">✅ En ligne sur YouTube</p>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons - Show on hover */}
      {showActions && (
        <div className="absolute inset-0 bg-black bg-opacity-60 rounded-xl flex items-center justify-center gap-2 transition-all">
          <Link
            to={`/projects/${project.id}`}
            className="bg-white text-gray-900 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            data-testid="edit-project-button"
            title="Edit"
          >
            <Edit className="w-5 h-5" />
          </Link>

          {project.video_url && (
            <button
              onClick={() => onPreview(project)}
              className="bg-white text-gray-900 p-3 rounded-lg hover:bg-gray-100 transition-colors"
              data-testid="preview-video-button"
              title="Preview Video"
            >
              <Play className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={() => onGenerate(project.id, 'script')}
            className="bg-white text-gray-900 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            data-testid="generate-script-button"
            title="Generate Script"
          >
            <FileText className="w-5 h-5" />
          </button>

          <button
            onClick={() => onGenerate(project.id, 'audio')}
            className="bg-white text-gray-900 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            data-testid="generate-audio-button"
            title="Generate Audio"
          >
            <Mic className="w-5 h-5" />
          </button>

          <button
            onClick={() => onGenerate(project.id, 'images')}
            className="bg-white text-gray-900 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            data-testid="generate-images-button"
            title="Generate Images"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          <button
            onClick={() => onGenerate(project.id, 'video')}
            className="bg-white text-gray-900 p-3 rounded-lg hover:bg-gray-100 transition-colors"
            data-testid="generate-video-button"
            title="Generate Video"
          >
            <Video className="w-5 h-5" />
          </button>

          <button
            onClick={() => onDelete(project)}
            className="bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 transition-colors"
            data-testid="delete-project-button"
            title="Delete"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
