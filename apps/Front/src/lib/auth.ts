import type { User } from '@/types';

const TOKEN_KEY = 'chamados_access_token';
const USER_KEY = 'chamados_user';

export function getToken() {
  return typeof window === 'undefined' ? null : localStorage.getItem(TOKEN_KEY);
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const value = localStorage.getItem(USER_KEY);
  return value ? JSON.parse(value) : null;
}

export function saveSession(accessToken: string, user: User) {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}