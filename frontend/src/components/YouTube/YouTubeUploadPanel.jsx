import React, { useState, useEffect } from 'react';
import { Youtube, Upload, Loader, AlertCircle, XCircle, Settings, Clock, Zap, Calendar, Lock, Video, CheckCircle } from 'lucide-react';
import { youtubeAuthAPI, youtubeVideosAPI, youtubeThumbnailAPI } from '../../services/youtube.api';
import YouTubeUploadStatus from './YouTubeUploadStatus';
import YouTubeMetadataForm from './YouTubeMetadataForm';

const YouTubeUploadPanel = ({ project }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [uploading, setUploading] = useState(false);
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

  // Helper functions for schedule data handling
  const handleDateTimeChange = (value) => {
    const newData = { ...scheduleData, publish_at: value };
    setScheduleData(newData);
  };

  const handlePremiereChange = (checked) => {
    const newData = { ...scheduleData, is_premiere: checked };
    setScheduleData(newData);
  };

  const handlePrivacyChange = (value) => {
    const newData = { ...scheduleData, final_privacy_status: value };
    setScheduleData(newData);
  };

  const handleUpload = async () => {
    try {
      setUploading(true);
      setError(null);

      // Determine parameters based on publish mode
      const privacyStatus = publishMode === 'scheduled' ? 'private' : 'public';
      const publishAt = publishMode === 'scheduled' ? scheduleData.publish_at : null;
      const isPremiere = publishMode === 'scheduled' ? scheduleData.is_premiere : false;
      
      const response = await youtubeVideosAPI.uploadVideo(
        project.id, 
        privacyStatus, 
        publishAt, 
        isPremiere
      );
      
      setUploadInfo({
        youtube_video_id: response.youtube_video_id,
        youtube_url: response.youtube_url,
        uploaded_at: response.uploaded_at,
        scheduled_publish_at: response.scheduled_publish_at,
        is_premiere: response.is_premiere,
      });

      // Optionally update project thumbnail on YouTube for immediate uploads
      if (publishMode === 'immediate') {
        try {
          await youtubeThumbnailAPI.updateThumbnailByProject(project.id);
        } catch (thumbErr) {
          console.warn('Failed to update thumbnail, but upload succeeded:', thumbErr);
        }
      }
      
      alert(publishMode === 'immediate' 
        ? 'Video uploaded successfully!' 
        : 'Video uploaded and scheduled successfully!');
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

  // Format date for display
  const formatScheduleSummary = () => {
    if (!scheduleData.publish_at) return null;
    
    const date = new Date(scheduleData.publish_at);
    const formattedDate = date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit'
    });
    
    // Get privacy label
    const privacyLabels = {
      'public': 'Public',
      'unlisted': 'Non répertorié',
      'private': 'Privé'
    };
    
    return {
      date: formattedDate,
      time: formattedTime,
      privacy: privacyLabels[scheduleData.final_privacy_status] || scheduleData.final_privacy_status,
      isPremiere: scheduleData.is_premiere
    };
  };

  // Get minimum date (now + 1 hour)
  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  // Check if project is ready for upload
  const isVideoReady = (['video_ready', 'video_subtitled', 'scheduled_for_publish'].includes(project?.status)) && project?.video_url;
  const isAlreadyUploaded = !!uploadInfo?.youtube_video_id;
  const scheduleSummary = formatScheduleSummary();

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
          <h2 className="text-xl font-semibold text-gray-900">Planifier la publication de la vidéo</h2>
          <p className="text-sm text-gray-600">Configurez et planifiez la publication de votre vidéo sur YouTube</p>
        </div>
      </div>

      {/* Not Authenticated Warning */}
      {!isAuthenticated && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-3" data-testid="not-authenticated-warning">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-yellow-800">
              Vous devez connecter votre compte YouTube avant de pouvoir publier des vidéos.
            </p>
            <a href="/settings" className="text-sm text-yellow-900 underline font-medium">
              Aller aux paramètres pour connecter YouTube
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
              Votre vidéo doit être générée avant de pouvoir être publiée sur YouTube.
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Statut actuel : <strong>{project?.status || 'inconnu'}</strong>
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
        <div className="space-y-6">
          {isAlreadyUploaded ? (
            <>
              {/* Already Uploaded - Show Status */}
              <YouTubeUploadStatus uploadInfo={uploadInfo} />

              {/* Actions for uploaded video */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setShowMetadataForm(!showMetadataForm)}
                  className="btn-secondary flex items-center gap-2"
                  data-testid="toggle-metadata-form-button"
                >
                  <Settings className="w-4 h-4" />
                  {showMetadataForm ? 'Masquer' : 'Modifier'} les métadonnées
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
                      Mise à jour...
                    </>
                  ) : (
                    'Mettre à jour la miniature'
                  )}
                </button>
              </div>

              {/* Metadata Form (collapsible) */}
              {showMetadataForm && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Modifier les métadonnées de la vidéo</h3>
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Configuration (60%) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Configuration Card */}
                <div className="card space-y-6">
                  {/* Publish Mode Toggle */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration de la Planification</h3>
                    <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg w-fit">
                      <button
                        onClick={() => setPublishMode('immediate')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                          publishMode === 'immediate'
                            ? 'bg-white text-red-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                        data-testid="publish-mode-immediate"
                      >
                        <Zap className="w-4 h-4" />
                        Publier Maintenant
                      </button>
                      <button
                        onClick={() => setPublishMode('scheduled')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${
                          publishMode === 'scheduled'
                            ? 'bg-white text-red-600 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                        data-testid="publish-mode-scheduled"
                      >
                        <Clock className="w-4 h-4" />
                        Planifier
                      </button>
                    </div>
                  </div>

                  {/* Scheduling Form (if scheduled mode) */}
                  {publishMode === 'scheduled' && (
                    <div className="space-y-6">
                      {/* Date and Time Picker */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-600" />
                          Date & Heure de Publication
                        </label>
                        <div className="flex gap-4">
                          <input
                            type="date"
                            value={scheduleData.publish_at ? scheduleData.publish_at.split('T')[0] : ''}
                            onChange={(e) => {
                              const time = scheduleData.publish_at ? scheduleData.publish_at.split('T')[1] : '12:00';
                              handleDateTimeChange(`${e.target.value}T${time}`);
                            }}
                            min={new Date().toISOString().split('T')[0]}
                            className="input-field w-1/2"
                          />
                          <input
                            type="time"
                            value={scheduleData.publish_at ? scheduleData.publish_at.split('T')[1] : ''}
                            onChange={(e) => {
                              const date = scheduleData.publish_at ? scheduleData.publish_at.split('T')[0] : new Date().toISOString().split('T')[0];
                              handleDateTimeChange(`${date}T${e.target.value}`);
                            }}
                            className="input-field w-1/2"
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Sélectionnez une date au moins 1 heure dans le futur
                        </p>
                      </div>

                      {/* Privacy Status */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                          <Lock className="w-4 h-4 text-gray-600" />
                          Confidentialité après Publication
                        </label>
                        <select
                          value={scheduleData.final_privacy_status}
                          onChange={(e) => handlePrivacyChange(e.target.value)}
                          className="input-field w-1/2"
                          data-testid="schedule-privacy-select"
                        >
                          <option value="public">Public - Tout le monde peut voir</option>
                          <option value="unlisted">Non répertorié - Seulement avec le lien</option>
                          <option value="private">Privé - Seulement moi</option>
                        </select>
                      </div>

                      {/* Premiere Option */}
                      <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <input
                          type="checkbox"
                          id="is-premiere"
                          checked={scheduleData.is_premiere}
                          onChange={(e) => handlePremiereChange(e.target.checked)}
                          className="mt-1 w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                          data-testid="schedule-premiere-checkbox"
                        />
                        <div className="flex-1">
                          <label htmlFor="is-premiere" className="block text-sm font-medium text-gray-900 cursor-pointer">
                            Définir comme Première
                          </label>
                          <p className="text-xs text-gray-600 mt-1">
                            La Première permet de regarder la vidéo en même temps que vos spectateurs en temps réel, avec chat en direct et réactions.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Video Preview Card */}
                {project?.video_url && (
                  <div className="card">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Video className="w-5 h-5 text-gray-600" />
                      Aperçu de la Vidéo
                    </h3>
                    <video
                      src={project.video_url}
                      controls
                      className="w-full rounded-lg border border-gray-200"
                      data-testid="video-preview"
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Fichier :</strong> {project.video_url.split('/').pop() || 'video.mp4'}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column - Preview & Action (40%) */}
              <div className="space-y-6">
                {/* Preview Card */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Aperçu et Action</h3>
                  
                  {/* Video Ready Status */}
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                    <div className="flex items-center gap-3">
                      <Youtube className="w-8 h-8 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800">Vidéo Prête</p>
                        <p className="text-sm text-green-600">
                          {project?.video_url ? project.video_url.split('/').pop() : 'video.mp4'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Schedule Summary */}
                  {publishMode === 'scheduled' && scheduleSummary && (
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg mb-4">
                      <h4 className="font-medium text-blue-900 mb-2">Résumé de la Planification</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-blue-700">Publiera le :</span>
                          <span className="font-medium">{scheduleSummary.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">À :</span>
                          <span className="font-medium">{scheduleSummary.time}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">Confidentialité :</span>
                          <span className="font-medium">
                            {scheduleSummary.privacy} {scheduleSummary.isPremiere && '(Première)'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="mt-6">
                    <button
                      onClick={handleUpload}
                      disabled={uploading || (publishMode === 'scheduled' && !scheduleData.publish_at)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-3 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      data-testid="upload-to-youtube-button"
                    >
                      {uploading ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          {publishMode === 'immediate' ? 'Publication en cours...' : 'Planification en cours...'}
                        </>
                      ) : (
                        <>
                          {publishMode === 'immediate' ? (
                            <>
                              <Upload className="w-5 h-5" />
                              Publier sur YouTube
                            </>
                          ) : (
                            <>
                              <Clock className="w-5 h-5" />
                              Planifier la Vidéo
                            </>
                          )}
                        </>
                      )}
                    </button>
                    
                    <p className="text-xs text-gray-500 mt-2 text-center">
                      {publishMode === 'immediate' 
                        ? 'La vidéo sera publiée immédiatement sur votre chaîne YouTube'
                        : 'La vidéo sera téléchargée et publiée à la date planifiée'}
                    </p>
                  </div>
                </div>

                {/* Info Card */}
                <div className="card">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Informations Importantes
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5"></div>
                      <span>La vidéo est déjà sur nos serveurs, prête à être publiée</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5"></div>
                      <span>Pour les publications planifiées, la vidéo sera privée jusqu'à l'heure de publication</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5"></div>
                      <span>Vous pouvez modifier les métadonnées après la publication</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Video Preview (if exists) - Fallback for mobile */}
      {project?.video_url && (
        <div className="lg:hidden">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Aperçu de la Vidéo</h3>
          <video
            src={project.video_url}
            controls
            className="w-full rounded-lg border border-gray-200"
            data-testid="video-preview-mobile"
          />
        </div>
      )}
    </div>
  );
};

export default YouTubeUploadPanel;
