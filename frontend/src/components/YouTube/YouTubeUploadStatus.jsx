import React from 'react';
import { Youtube, ExternalLink, Calendar, CheckCircle } from 'lucide-react';
import { formatDate } from '../../utils/helpers';

const YouTubeUploadStatus = ({ uploadInfo }) => {
  if (!uploadInfo || !uploadInfo.youtube_video_id) return null;

  return (
    <div className="p-4 bg-green-50 border border-green-200 rounded-lg" data-testid="youtube-upload-status">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle className="w-5 h-5 text-green-600" />
        <h4 className="font-semibold text-green-900">Uploaded to YouTube</h4>
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
      </div>
    </div>
  );
};

export default YouTubeUploadStatus;
