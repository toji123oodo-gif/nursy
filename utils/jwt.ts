
/**
 * JWT Utility for stateless authentication
 * This utility simulates JWT handling in the frontend.
 */

export interface JWTPayload {
  sub: string;
  name: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

const JWT_SECRET = "nursy_secret_key_2024";

export const jwtUtils = {
  sign: (payload: Partial<JWTPayload>): string => {
    try {
      const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
      const iat = Math.floor(Date.now() / 1000);
      const exp = iat + (60 * 60 * 24); // 24 hours expiry
      const body = btoa(JSON.stringify({ ...payload, iat, exp }));
      const signature = btoa(JWT_SECRET);
      return `${header}.${body}.${signature}`;
    } catch (e) {
      return "";
    }
  },

  decode: (token: string | null): JWTPayload | null => {
    if (!token) return null;
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;
      const payload = JSON.parse(atob(parts[1]));
      return payload as JWTPayload;
    } catch (e) {
      console.warn("JWT Decode failed", e);
      return null;
    }
  },

  isExpired: (token: string | null): boolean => {
    if (!token) return true;
    const payload = jwtUtils.decode(token);
    if (!payload) return true;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  },

  saveToken: (token: string) => {
    try {
      localStorage.setItem('nursy_auth_token', token);
    } catch (e) {}
  },

  getToken: () => {
    try {
      return localStorage.getItem('nursy_auth_token');
    } catch (e) {
      return null;
    }
  },

  removeToken: () => {
    try {
      localStorage.removeItem('nursy_auth_token');
    } catch (e) {}
  }
};
