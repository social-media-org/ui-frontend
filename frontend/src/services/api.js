import axios from 'axios';

// Base URL for API - easily changeable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8001';

const api = axios.create({
  baseURL: API_BASE_URL,
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
  generateScript: async (id, data) => {
    const response = await api.post(`/projects/${id}/generate-script`, data);
    return response.data;
  },

  // Generate audio
  generateAudio: async (id, data) => {
    const response = await api.post(`/projects/${id}/generate-audio`, data);
    return response.data;
  },

  // Generate images
  generateImages: async (id, data) => {
    const response = await api.post(`/projects/${id}/generate-images`, data);
    return response.data;
  },

  // Generate single image for a scene
  generateSingleImage: async (id, sceneIndex, data) => {
    const response = await api.post(`/projects/${id}/generate-images/${sceneIndex}`, data);
    return response.data;
  },

  // Generate video
  generateVideo: async (id, data) => {
    const response = await api.post(`/projects/${id}/generate-video`, data);
    return response.data;
  },
};

export default api;
