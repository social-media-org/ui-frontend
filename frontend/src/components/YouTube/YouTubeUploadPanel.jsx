import React, { useState, useEffect } from 'react';
import { Youtube, Upload, Loader, AlertCircle, XCircle, Settings, Clock, Zap } from 'lucide-react';
import { youtubeAuthAPI, youtubeVideosAPI, youtubeThumbnailAPI, youtubeScheduleAPI } from '../../services/youtube.api';
import YouTubeUploadStatus from './YouTubeUploadStatus';
import YouTubeMetadataForm from './YouTubeMetadataForm';
import YouTubeScheduleForm from './YouTubeScheduleForm';

const YouTubeUploadPanel = ({ project }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [scheduling, setScheduling] = useState(false);
  const [updatingThumbnail, setUpdatingThumbnail] = useState(false);
  const [error, setError] = useState(null);
  const [uploadInfo, setUploadInfo] = useState(null);
  const [showMetadataForm, setShowMetadataForm] = useState(false);
  
  // Scheduling states
  const [publishMode, setPublishMode] = useState('immediate'); // 'immediate' or 'scheduled'
  const [scheduleData, setScheduleData] = useState({
    publish_at: '',
    is_premiere: false,
    final_privacy_status: 'public',
  });

  // Check authentication status
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Load upload info from project if already uploaded
  useEffect(() => {
    if (project?.youtube_video_id) {
      setUploadInfo({
        youtube_video_id: project.youtube_video_id,
        youtube_url: project.youtube_url,
        uploaded_at: project.youtube_uploaded_at,
        scheduled_publish_at: project.youtube_scheduled_publish_at,
        is_premiere: project.youtube_is_premiere,
      });
    }
  }, [project]);

  const checkAuthStatus = async () => {
    try {
      setCheckingAuth(true);
      const response = await youtubeAuthAPI.getAuthStatus();
      setIsAuthenticated(response.is_authenticated);
    } catch (err) {
      console.error('Error checking auth status:', err);
      setIsAuthenticated(false);
    } finally {
      setCheckingAuth(false);
    }
  };

  const handleUpload = async () => {
    try {
      setUploading(true);
      setError(null);

      const response = await youtubeVideosAPI.uploadVideo(project.id, 'public');
      
      setUploadInfo({
        youtube_video_id: response.youtube_video_id,
        youtube_url: response.youtube_url,
        uploaded_at: response.uploaded_at,
      });

      // Optionally update project thumbnail on YouTube
      try {
        await youtubeThumbnailAPI.updateThumbnailByProject(project.id);
      } catch (thumbErr) {
        console.warn('Failed to update thumbnail, but upload succeeded:', thumbErr);
      }
    } catch (err) {
      console.error('Error uploading to YouTube:', err);
      const errorMessage = err.response?.data?.detail || 'Failed to upload video to YouTube';
      setError(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateThumbnail = async () => {
    try {
      setUpdatingThumbnail(true);
      setError(null);

      await youtubeThumbnailAPI.updateThumbnailByProject(project.id);
      
      alert('Thumbnail updated successfully!');
    } catch (err) {
      console.error('Error updating thumbnail:', err);
      setError(err.response?.data?.detail || 'Failed to update thumbnail');
    } finally {
      setUpdatingThumbnail(false);
    }
  };

  // Check if project is ready for upload
  const isVideoReady = project?.status === 'video_ready' && project?.video_url;
  const isAlreadyUploaded = !!uploadInfo?.youtube_video_id;

  if (checkingAuth) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader className="w-6 h-6 text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6" data-testid="youtube-upload-panel">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
          <Youtube className="w-6 h-6 text-red-600" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-900">YouTube Upload</h2>
          <p className="text-sm text-gray-600">Upload and manage your video on YouTube</p>
        </div>
      </div>

      {/* Not Authenticated Warning */}
      {!isAuthenticated && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3" data-testid="not-authenticated-warning">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-yellow-800">
              You need to connect your YouTube account before uploading videos.
            </p>
            <a href="/settings" className="text-sm text-yellow-900 underline font-medium">
              Go to Settings to connect YouTube
            </a>
          </div>
        </div>
      )}

      {/* Video Not Ready Warning */}
      {isAuthenticated && !isVideoReady && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3" data-testid="video-not-ready-warning">
          <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-blue-800">
              Your video must be generated before uploading to YouTube.
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Current status: <strong>{project?.status || 'unknown'}</strong>
            </p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3" data-testid="error-message">
          <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Upload Status or Upload Button */}
      {isAuthenticated && isVideoReady && (
        <div className="space-y-4">
          {isAlreadyUploaded ? (
            <>
              {/* Already Uploaded - Show Status */}
              <YouTubeUploadStatus uploadInfo={uploadInfo} />

              {/* Actions for uploaded video */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowMetadataForm(!showMetadataForm)}
                  className="btn-secondary flex items-center gap-2"
                  data-testid="toggle-metadata-form-button"
                >
                  <Settings className="w-4 h-4" />
                  {showMetadataForm ? 'Hide' : 'Edit'} Metadata
                </button>

                <button
                  onClick={handleUpdateThumbnail}
                  disabled={updatingThumbnail}
                  className="btn-secondary flex items-center gap-2"
                  data-testid="update-thumbnail-button"
                >
                  {updatingThumbnail ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    'Update Thumbnail'
                  )}
                </button>
              </div>

              {/* Metadata Form (collapsible) */}
              {showMetadataForm && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Edit Video Metadata</h3>
                  <YouTubeMetadataForm
                    youtubeVideoId={uploadInfo.youtube_video_id}
                    initialData={{
                      title: project.title,
                      description: project.description,
                      tags: project.tags || [],
                    }}
                    onUpdate={(updatedData) => {
                      console.log('Metadata updated:', updatedData);
                    }}
                  />
                </div>
              )}
            </>
          ) : (
            <>
              {/* Upload Button */}
              <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <Youtube className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Ready to Upload
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Your video is ready to be uploaded to YouTube
                </p>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="btn-primary flex items-center gap-2 mx-auto"
                  data-testid="upload-to-youtube-button"
                >
                  {uploading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      Uploading to YouTube...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Upload to YouTube
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Video Preview (if exists) */}
      {project?.video_url && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Video Preview</h3>
          <video
            src={project.video_url}
            controls
            className="w-full rounded-lg border border-gray-200"
            data-testid="video-preview"
          />
        </div>
      )}
    </div>
  );
};

export default YouTubeUploadPanel;
