import axios from 'axios';

// Base URL for API - easily changeable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const version = "/api/v1"
const api = axios.create({
  baseURL: API_BASE_URL + version,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Projects API
export const projectsAPI = {
  // Get all projects
  getAll: async (params = {}) => {
    const response = await api.get('/projects', { params });
    return response.data;
  },

  // Get single project by ID
  getById: async (id) => {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  },

  // Create new project
  create: async (data) => {
    const response = await api.post('/projects', data);
    return response.data;
  },

  // Update project
  update: async (id, data) => {
    const response = await api.put(`/projects/${id}`, data);
    return response.data;
  },

  // Delete project
  delete: async (id) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },

  // Generate script
  generateScript: async (projectId, data) => {
    const response = await api.post(`/scripts/${projectId}`, data);
    return response.data;
  },

  // Generate description
  generateDescription: async (data) => {
    const response = await api.post(`/scripts/description/generate`, data);
    return response.data;
  },
  // Generate audio
  generateAudio: async (projectId, data) => {
    const response = await api.post(`/audios/${projectId}`, data);
    return response.data;
  },

  // Generate images
  generateImages: async (projectId, data) => {
    const response = await api.post(`/images/${projectId}`, data);
    return response.data;
  },

  // Generate single image for a scene
  generateSingleImage: async (projectId, sceneIndex, data) => {
    const response = await api.post(`/images/${projectId}/${sceneIndex}`, data);
    return response.data;
  },

  // Generate video
  generateVideo: async (projectId, data) => {
    const response = await api.post(`/video/${projectId}`, data);
    return response.data;
  },
};

export default api;
