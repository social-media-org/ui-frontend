import axios from 'axios';

// YouTube Service Base URL - configurable for Docker Compose
const YOUTUBE_API_BASE_URL = import.meta.env.VITE_YOUTUBE_API_BASE_URL || 'http://localhost:8005';

const youtubeApi = axios.create({
  baseURL: `${YOUTUBE_API_BASE_URL}/api/youtube`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// YouTube Authentication API
export const youtubeAuthAPI = {
  // Get OAuth authorization URL
  getAuthUrl: async () => {
    const response = await youtubeApi.get('/auth/url');
    return response.data;
  },

  // Check authentication status
  getAuthStatus: async () => {
    const response = await youtubeApi.get('/auth/status');
    return response.data;
  },

  // Disconnect YouTube account
  disconnect: async () => {
    const response = await youtubeApi.post('/auth/disconnect');
    return response.data;
  },
};

// YouTube Channel API
export const youtubeChannelAPI = {
  // Get channel information
  getChannelInfo: async () => {
    const response = await youtubeApi.get('/channel/info');
    return response.data;
  },
};

// YouTube Videos API
export const youtubeVideosAPI = {
  // Upload video to YouTube
  uploadVideo: async (projectId, privacyStatus = 'public') => {
    const response = await youtubeApi.post(
      `/videos/upload/${projectId}`,
      null,
      {
        params: { privacy_status: privacyStatus },
      }
    );
    return response.data;
  },

  // Update video metadata
  updateMetadata: async (youtubeVideoId, metadata) => {
    const response = await youtubeApi.patch(`/videos/${youtubeVideoId}`, metadata);
    return response.data;
  },

  // Get video information
  getVideoInfo: async (youtubeVideoId) => {
    const response = await youtubeApi.get(`/videos/${youtubeVideoId}`);
    return response.data;
  },
};

// YouTube Thumbnail API
export const youtubeThumbnailAPI = {
  // Update thumbnail by YouTube video ID
  updateThumbnail: async (youtubeVideoId, thumbnailPath) => {
    const response = await youtubeApi.post(`/thumbnail/update/${youtubeVideoId}`, {
      thumbnail_path: thumbnailPath,
    });
    return response.data;
  },

  // Update thumbnail by project ID
  updateThumbnailByProject: async (projectId) => {
    const response = await youtubeApi.post(`/thumbnail/update-by-project/${projectId}`);
    return response.data;
  },

  // Get thumbnail info
  getThumbnailInfo: async (youtubeVideoId) => {
    const response = await youtubeApi.get(`/thumbnail/info/${youtubeVideoId}`);
    return response.data;
  },
};

export default youtubeApi;
