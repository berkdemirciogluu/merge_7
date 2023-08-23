import { redirect } from 'react-router-dom';

export function getAuthToken(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token') ?? '';
  }
}

export function setAuthToken(accessToken: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', accessToken);
  }
}

export function removeAuthToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
  }
}

export function setRefreshToken(refreshToken: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('refresh-token', refreshToken);
  }
}

export function getRefreshToken(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('refresh-token') ?? '';
  }
}

export function removeRefreshToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('refresh-token');
  }
}

export function setUserCredentials(token: string, refreshToken: string): void {
  setAuthToken(token);
  setRefreshToken(refreshToken);
}

export function removeUserCredentials(): void {
  removeAuthToken();
  removeRefreshToken();
}

export function checkAuthLoader() {
  const token = getAuthToken();
  if (!token) return redirect('/login');
}
