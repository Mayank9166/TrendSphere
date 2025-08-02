// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://trendsphere-first.onrender.com';

console.log('API_BASE_URL:', API_BASE_URL);
console.log('VITE_API_URL from env:', import.meta.env.VITE_API_URL);

// Helper function for API calls
export const apiFetch = (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  console.log('apiFetch called with:', { url, options });
  
  return fetch(url, {
    ...options,
    credentials: 'include', // Add credentials for cookies
  });
};

// Token refresh utility
export const refreshTokenIfNeeded = async () => {
  try {
    const response = await apiFetch('/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Token refreshed successfully');
      return data.user;
    }
  } catch (error) {
    console.log('Token refresh failed:', error);
  }
  return null;
};