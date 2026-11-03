import { ChatState } from '../types';

export const STORAGE_KEY = 'chat-app-state';

export function saveChatState(state: ChatState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadChatState(): ChatState | null {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as ChatState;
  } catch {
    return null;
  }
}
