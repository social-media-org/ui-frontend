// Vérifie si la variable a été remplacée par envsubst
const isRuntimeConfigured = window.ENV?.VITE_API_BASE_URL && 
                           !window.ENV.VITE_API_BASE_URL.includes('${');

const backendUrl = isRuntimeConfigured 
  ? window.ENV.VITE_API_BASE_URL 
  : (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000');

export const API_BASE_URL = backendUrl;

// Vérifie si la variable YouTube a été remplacée par envsubst
const isYouTubeRuntimeConfigured = window.ENV?.VITE_YOUTUBE_API_BASE_URL && 
                                  !window.ENV.VITE_YOUTUBE_API_BASE_URL.includes('${');

const youtubeApiUrl = isYouTubeRuntimeConfigured
  ? window.ENV.VITE_YOUTUBE_API_BASE_URL
  : (import.meta.env.VITE_YOUTUBE_API_BASE_URL || 'http://localhost:8005');

export const YOUTUBE_API_BASE_URL = youtubeApiUrl;
