import type { UserProfile } from './types';

const STORAGE_KEY = 'movement-quest:profile';

export function loadProfile(): UserProfile | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function saveProfile(profile: UserProfile): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
}

export function clearProfile(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function createProfile(name: string): UserProfile {
  return {
    name,
    createdAt: new Date().toISOString(),
    onboarding: null,
    exp: 0,
    skills: {
      strength: 1,
      endurance: 1,
      mobility: 1,
      balance: 1,
      movement: 1,
      consistency: 1,
    },
    activeQuests: [],
    activeQuestDate: '',
    completedQuests: [],
    unlockedAchievements: [],
    checkInDates: [],
  };
}
