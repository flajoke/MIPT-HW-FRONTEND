import type { ChatState } from '../types/chat';

const STORAGE_KEY = 'gigachat-chat-state-v1';

export function loadChatState(): ChatState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<ChatState>;
    if (!parsed || !Array.isArray(parsed.chats)) {
      return null;
    }

    return {
      chats: parsed.chats,
      activeChatId: parsed.activeChatId ?? null,
      isLoading: false,
      error: null,
    };
  } catch (error) {
    console.error('Failed to parse chat state from localStorage', error);
    return null;
  }
}

export function saveChatState(state: ChatState): void {
  try {
    const safeState: ChatState = {
      chats: state.chats,
      activeChatId: state.activeChatId,
      isLoading: false,
      error: null,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(safeState));
  } catch (error) {
    console.error('Failed to save chat state to localStorage', error);
  }
}
