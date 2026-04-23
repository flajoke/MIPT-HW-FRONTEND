import type { PersistedState } from '@/shared/types/chat';

const STORAGE_KEY = 'gigachat-chat-state';

export const loadState = (): PersistedState | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedState;
  } catch {
    return null;
  }
};

export const saveState = (value: PersistedState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
};
