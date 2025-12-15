import React from 'react';
import { Youtube, ExternalLink, Calendar, CheckCircle, Clock, Sparkles } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const YouTubeUploadStatus = ({ uploadInfo }) => {
  if (!uploadInfo || !uploadInfo.youtube_video_id) return null;

  const isScheduled = !!uploadInfo.scheduled_publish_at;

  return (
    <div 
      className={`p-4 border rounded-lg ${
        isScheduled 
          ? 'bg-blue-50 border-blue-200' 
          : 'bg-green-50 border-green-200'
      }`}
      data-testid="youtube-upload-status"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        {isScheduled ? (
          <>
            <Clock className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-blue-900">Scheduled for Publication</h4>
          </>
        ) : (
          <>
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h4 className="font-semibold text-green-900">Published on YouTube</h4>
          </>
        )}
      </div>

      {/* Upload Details */}
      <div className="space-y-2 text-sm">
        {/* YouTube URL */}
        <div className="flex items-center gap-2">
          <Youtube className="w-4 h-4 text-gray-600 flex-shrink-0" />
          <a
            href={uploadInfo.youtube_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
            data-testid="youtube-video-link"
          >
            <span>View on YouTube</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Scheduled Publication Date */}
        {isScheduled && (
          <div className="flex items-center gap-2 text-blue-700 font-medium" data-testid="scheduled-publish-date">
            <Clock className="w-4 h-4 flex-shrink-0" />
            <span>Will publish on {formatDate(uploadInfo.scheduled_publish_at)}</span>
          </div>
        )}

        {/* Premiere Badge */}
        {uploadInfo.is_premiere && (
          <div className="flex items-center gap-2 text-purple-700" data-testid="premiere-badge">
            <Sparkles className="w-4 h-4 flex-shrink-0" />
            <span className="font-medium">Premiere Event</span>
          </div>
        )}

        {/* Upload Date */}
        {uploadInfo.uploaded_at && (
          <div className="flex items-center gap-2 text-gray-600" data-testid="upload-date">
            <Calendar className="w-4 h-4 flex-shrink-0" />
            <span>Uploaded on {formatDate(uploadInfo.uploaded_at)}</span>
          </div>
        )}

        {/* Video ID */}
        <div className="text-gray-500 text-xs" data-testid="youtube-video-id">
          Video ID: {uploadInfo.youtube_video_id}
        </div>

        {/* Scheduled Status Info */}
        {isScheduled && (
          <div className="mt-3 pt-3 border-t border-blue-200">
            <p className="text-xs text-blue-800">
              The video is currently <strong>private</strong> and will automatically become public at the scheduled time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubeUploadStatus;
