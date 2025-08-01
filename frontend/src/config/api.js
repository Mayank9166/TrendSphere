// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://trendsphere-first.onrender.com';

// Helper function for API calls
export const apiFetch = (endpoint, options = {}) => {
  return fetch(`${API_BASE_URL}${endpoint}`, options);
};