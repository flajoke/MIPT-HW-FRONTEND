import { create } from 'zustand';
import { createId } from '@/shared/lib/id';
import { loadState, saveState } from '@/shared/lib/storage';
import type { ChatItem, ChatSettings, LocalAttachment, Message, PersistedState } from '@/shared/types/chat';

const defaultSettings: ChatSettings = {
  model: 'GigaChat',
  systemPrompt: 'Ты полезный ассистент. Отвечай структурированно и по делу.',
  temperature: 1,
  top_p: 0.9,
  max_tokens: 2048,
  repetition_penalty: 1,
  function_call: 'auto',
};

const createEmptyChat = (): ChatItem => ({
  id: createId(),
  title: 'Новый чат',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  messages: [],
  settings: { ...defaultSettings },
});

const persisted = loadState();
const initialChat = persisted?.chats?.[0] ?? createEmptyChat();

interface ChatState {
  chats: ChatItem[];
  activeChatId: string;
  searchQuery: string;
  isGenerating: boolean;
  availableModels: string[];
  setAvailableModels: (models: string[]) => void;
  setSearchQuery: (value: string) => void;
  createChat: () => string;
  deleteChat: (chatId: string) => void;
  renameChat: (chatId: string, title: string) => void;
  setActiveChat: (chatId: string) => void;
  updateSettings: (chatId: string, patch: Partial<ChatSettings>) => void;
  addUserMessage: (chatId: string, content: string, attachments: LocalAttachment[]) => string;
  startAssistantMessage: (chatId: string) => string;
  appendToAssistantMessage: (chatId: string, messageId: string, chunk: string) => void;
  finalizeAssistantMessage: (chatId: string, messageId: string) => void;
  failAssistantMessage: (chatId: string, messageId: string, error: string) => void;
  setGenerating: (value: boolean) => void;
}

const persist = (state: Pick<ChatState, 'chats' | 'activeChatId'>) => {
  const payload: PersistedState = {
    chats: state.chats,
    activeChatId: state.activeChatId,
  };
  saveState(payload);
};

const deriveTitle = (content: string) => content.replace(/\s+/g, ' ').trim().slice(0, 40) || 'Новый чат';

export const useChatStore = create<ChatState>((set) => ({
  chats: persisted?.chats?.length ? persisted.chats : [initialChat],
  activeChatId: persisted?.activeChatId ?? initialChat.id,
  searchQuery: '',
  isGenerating: false,
  availableModels: ['GigaChat'],
  setAvailableModels: (models) => set({ availableModels: models.length ? models : ['GigaChat'] }),
  setSearchQuery: (value) => set({ searchQuery: value }),
  setGenerating: (value) => set({ isGenerating: value }),
  createChat: () => {
    const chat = createEmptyChat();
    set((state) => {
      const next = { ...state, chats: [chat, ...state.chats], activeChatId: chat.id };
      persist(next);
      return next;
    });
    return chat.id;
  },
  deleteChat: (chatId) => {
    set((state) => {
      const filtered = state.chats.filter((chat) => chat.id !== chatId);
      const fallback = filtered[0] ?? createEmptyChat();
      const chats = filtered.length ? filtered : [fallback];
      const activeChatId = state.activeChatId === chatId ? chats[0].id : state.activeChatId;
      const next = { ...state, chats, activeChatId };
      persist(next);
      return next;
    });
  },
  renameChat: (chatId, title) => {
    set((state) => {
      const chats = state.chats.map((chat) =>
        chat.id === chatId ? { ...chat, title: title.trim() || chat.title, updatedAt: new Date().toISOString() } : chat,
      );
      const next = { ...state, chats };
      persist(next);
      return next;
    });
  },
  setActiveChat: (chatId) => set((state) => {
    const next = { ...state, activeChatId: chatId };
    persist(next);
    return next;
  }),
  updateSettings: (chatId, patch) => {
    set((state) => {
      const chats = state.chats.map((chat) =>
        chat.id === chatId
          ? { ...chat, settings: { ...chat.settings, ...patch }, updatedAt: new Date().toISOString() }
          : chat,
      );
      const next = { ...state, chats };
      persist(next);
      return next;
    });
  },
  addUserMessage: (chatId, content, attachments) => {
    const messageId = createId();
    set((state) => {
      const chats = state.chats.map((chat) => {
        if (chat.id !== chatId) return chat;
        const firstUserMessage = !chat.messages.some((item) => item.role === 'user');
        const message: Message = {
          id: messageId,
          role: 'user',
          content,
          createdAt: new Date().toISOString(),
          attachments,
        };
        return {
          ...chat,
          title: firstUserMessage ? deriveTitle(content) : chat.title,
          updatedAt: new Date().toISOString(),
          messages: [...chat.messages, message],
        };
      });
      const next = { ...state, chats };
      persist(next);
      return next;
    });
    return messageId;
  },
  startAssistantMessage: (chatId) => {
    const messageId = createId();
    set((state) => {
      const chats = state.chats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              updatedAt: new Date().toISOString(),
              messages: [
                ...chat.messages,
                {
                  id: messageId,
                  role: 'assistant' as const,
                  content: '',
                  createdAt: new Date().toISOString(),
                  isStreaming: true,
                },
              ],
            }
          : chat,
      );
      const next = { ...state, chats };
      persist(next);
      return next;
    });
    return messageId;
  },
  appendToAssistantMessage: (chatId, messageId, chunk) => {
    set((state) => {
      const chats = state.chats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              updatedAt: new Date().toISOString(),
              messages: chat.messages.map((message) =>
                message.id === messageId ? { ...message, content: `${message.content}${chunk}` } : message,
              ),
            }
          : chat,
      );
      const next = { ...state, chats };
      persist(next);
      return next;
    });
  },
  finalizeAssistantMessage: (chatId, messageId) => {
    set((state) => {
      const chats = state.chats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              updatedAt: new Date().toISOString(),
              messages: chat.messages.map((message) =>
                message.id === messageId ? { ...message, isStreaming: false } : message,
              ),
            }
          : chat,
      );
      const next = { ...state, chats };
      persist(next);
      return next;
    });
  },
  failAssistantMessage: (chatId, messageId, error) => {
    set((state) => {
      const chats = state.chats.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              updatedAt: new Date().toISOString(),
              messages: chat.messages.map((message) =>
                message.id === messageId
                  ? {
                      ...message,
                      isStreaming: false,
                      error: true,
                      content: message.content || `Ошибка: ${error}`,
                    }
                  : message,
              ),
            }
          : chat,
      );
      const next = { ...state, chats };
      persist(next);
      return next;
    });
  },
}));

export const selectActiveChat = (state: ChatState) =>
  state.chats.find((chat) => chat.id === state.activeChatId) ?? state.chats[0];

export const selectFilteredChats = (state: ChatState) => {
  const query = state.searchQuery.trim().toLowerCase();
  if (!query) return state.chats;

  return state.chats.filter((chat) => {
    const inTitle = chat.title.toLowerCase().includes(query);
    const inMessages = chat.messages.some((message) => message.content.toLowerCase().includes(query));
    return inTitle || inMessages;
  });
};
