import React, { useState, useEffect } from 'react';
import { Youtube, Loader, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { youtubeAuthAPI, youtubeChannelAPI } from '../../services/youtube.api';
import YouTubeChannelInfo from './YouTubeChannelInfo';

const YouTubeConnectionCard = () => {
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [channelInfo, setChannelInfo] = useState(null);
  const [error, setError] = useState(null);

  // Check for OAuth callback status
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const authStatus = params.get('auth');

    if (authStatus === 'success') {
      setError(null);
      // Remove query params from URL
      window.history.replaceState({}, '', window.location.pathname);
      // Refresh auth status
      checkAuthStatus();
    } else if (authStatus === 'error') {
      setError('Failed to connect YouTube account. Please try again.');
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const statusResponse = await youtubeAuthAPI.getAuthStatus();
      setIsAuthenticated(statusResponse.is_authenticated);

      if (statusResponse.is_authenticated) {
        // Fetch channel info if authenticated
        const channelData = await youtubeChannelAPI.getChannelInfo();
        setChannelInfo(channelData);
      } else {
        setChannelInfo(null);
      }
    } catch (err) {
      console.error('Error checking auth status:', err);
      setError('Failed to check connection status');
      setIsAuthenticated(false);
      setChannelInfo(null);
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async () => {
    try {
      setConnecting(true);
      setError(null);

      const response = await youtubeAuthAPI.getAuthUrl();
      
      // Redirect to Google OAuth
      window.location.href = response.auth_url;
    } catch (err) {
      console.error('Error connecting to YouTube:', err);
      setError('Failed to initiate YouTube connection');
      setConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    if (!window.confirm('Are you sure you want to disconnect your YouTube account?')) {
      return;
    }

    try {
      setDisconnecting(true);
      setError(null);

      await youtubeAuthAPI.disconnect();
      
      setIsAuthenticated(false);
      setChannelInfo(null);
    } catch (err) {
      console.error('Error disconnecting from YouTube:', err);
      setError('Failed to disconnect YouTube account');
    } finally {
      setDisconnecting(false);
    }
  };

  if (loading) {
    return (
      <div className="card">
        <div className="flex items-center justify-center py-8">
          <Loader className="w-6 h-6 text-primary-600 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="card" data-testid="youtube-connection-card">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
          <Youtube className="w-5 h-5 text-red-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">YouTube Integration</h3>
          <p className="text-sm text-gray-600">
            {isAuthenticated ? 'Connected' : 'Connect your YouTube account to upload videos'}
          </p>
        </div>
        <div data-testid="connection-status-badge">
          {isAuthenticated ? (
            <CheckCircle className="w-6 h-6 text-green-600" />
          ) : (
            <XCircle className="w-6 h-6 text-gray-400" />
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-800" data-testid="error-message">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Channel Info (if connected) */}
      {isAuthenticated && channelInfo && (
        <div className="mb-4">
          <YouTubeChannelInfo channelInfo={channelInfo} />
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {isAuthenticated ? (
          <button
            onClick={handleDisconnect}
            disabled={disconnecting}
            className="btn-secondary flex items-center gap-2"
            data-testid="disconnect-youtube-button"
          >
            {disconnecting ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Disconnecting...
              </>
            ) : (
              'Disconnect YouTube'
            )}
          </button>
        ) : (
          <button
            onClick={handleConnect}
            disabled={connecting}
            className="btn-primary flex items-center gap-2"
            data-testid="connect-youtube-button"
          >
            {connecting ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Youtube className="w-4 h-4" />
                Connect YouTube
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default YouTubeConnectionCard;
