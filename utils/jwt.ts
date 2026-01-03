
/**
 * JWT Utility for stateless authentication
 * This utility simulates JWT handling in the frontend.
 * In a production environment, signing happens on the server.
 */

export interface JWTPayload {
  sub: string;
  name: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

const JWT_SECRET = "nursy_secret_key_2024"; // Mock secret

export const jwtUtils = {
  /**
   * Mocking a JWT sign function (Base64 encoding)
   */
  sign: (payload: Partial<JWTPayload>): string => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const iat = Math.floor(Date.now() / 1000);
    const exp = iat + (60 * 60 * 24); // 24 hours expiry
    
    const body = btoa(JSON.stringify({ ...payload, iat, exp }));
    const signature = btoa(JWT_SECRET); // Mock signature
    
    return `${header}.${body}.${signature}`;
  },

  /**
   * Decodes and verifies token structure
   */
  decode: (token: string): JWTPayload | null => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      
      const payload = JSON.parse(atob(parts[1]));
      return payload as JWTPayload;
    } catch (e) {
      return null;
    }
  },

  /**
   * Checks if the token is expired
   */
  isExpired: (token: string): boolean => {
    const payload = jwtUtils.decode(token);
    if (!payload) return true;
    
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  },

  /**
   * Persists token to secure storage
   */
  saveToken: (token: string) => {
    localStorage.setItem('nursy_auth_token', token);
  },

  /**
   * Retrieves token from storage
   */
  getToken: () => {
    return localStorage.getItem('nursy_auth_token');
  },

  /**
   * Removes token
   */
  removeToken: () => {
    localStorage.removeItem('nursy_auth_token');
  }
};
