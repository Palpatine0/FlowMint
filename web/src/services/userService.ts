import type { UserProfile } from '../types';

const STORAGE_KEY = 'flowmint_user';

const DEFAULT_PROFILE: UserProfile = {
  name: 'User',
  email: '',
  avatarUrl: '',
  defaultCurrency: 'USD',
  dateFormat: 'MM/DD/YYYY',
  theme: 'system',
};

export function getUserProfile(): UserProfile {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return { ...DEFAULT_PROFILE };
  return { ...DEFAULT_PROFILE, ...JSON.parse(data) };
}

export function saveUserProfile(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}
