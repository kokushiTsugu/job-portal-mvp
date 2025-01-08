// Environment variable configuration
export const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

// Helper function to construct API URLs
export const getApiUrl = (path: string) => {
  const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${baseUrl}/${cleanPath}`;
};
