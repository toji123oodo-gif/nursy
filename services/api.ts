
import { jwtUtils } from '../utils/jwt';

/**
 * Base API service that handles stateless authentication headers
 */
export const api = {
  /**
   * Wrapper for fetch that injects the JWT token
   */
  request: async (endpoint: string, options: RequestInit = {}) => {
    const token = jwtUtils.getToken();
    
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');
    
    if (token && !jwtUtils.isExpired(token)) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const response = await fetch(endpoint, {
      ...options,
      headers
    });

    if (response.status === 401) {
      // Handle unauthorized (expired token)
      jwtUtils.removeToken();
      window.location.href = '/login';
    }

    return response.json();
  },

  get: (endpoint: string) => api.request(endpoint, { method: 'GET' }),
  post: (endpoint: string, data: any) => api.request(endpoint, { method: 'POST', body: JSON.stringify(data) }),
  put: (endpoint: string, data: any) => api.request(endpoint, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (endpoint: string) => api.request(endpoint, { method: 'DELETE' }),
};
