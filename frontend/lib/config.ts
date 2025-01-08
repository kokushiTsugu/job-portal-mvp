// Environment variable configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Helper function to construct API URLs
export const getApiUrl = (path: string) => {
  const baseUrl = API_URL.endsWith('/') ? API_URL.slice(0, -1) : API_URL;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${baseUrl}/${cleanPath}`;
};

// Helper function to get common fetch options
export const getFetchOptions = (options: RequestInit = {}): RequestInit => {
  return {
    ...options,
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(options.headers || {})
    }
  };
};
