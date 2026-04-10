import { Chat, ChatMessage, ChatState } from '../types';
import { loadChatState } from '../utils/storage';

export const DEFAULT_CHAT_ID = 'chat-1';

export const defaultState: ChatState = {
  chats: [
    {
      id: DEFAULT_CHAT_ID,
      title: 'Новый чат',
      messages: [
        {
          id: 'assistant-1',
          text: 'Привет! Это стартовое сообщение.',
          variant: 'assistant'
        }
      ]
    }
  ],
  activeChatId: DEFAULT_CHAT_ID
};

export type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: { chatId: string; message: ChatMessage } }
  | { type: 'CREATE_CHAT'; payload?: { id: string; title?: string } }
  | { type: 'DELETE_CHAT'; payload: string }
  | { type: 'RENAME_CHAT'; payload: { chatId: string; title: string } }
  | { type: 'SET_ACTIVE_CHAT'; payload: string };

export function createInitialState(): ChatState {
  return loadChatState() ?? defaultState;
}

function createChatNumber(chats: Chat[]) {
  return chats.length + 1;
}

export function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'ADD_MESSAGE': {
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat.id === action.payload.chatId
            ? {
                ...chat,
                messages: [...chat.messages, action.payload.message]
              }
            : chat
        )
      };
    }

    case 'CREATE_CHAT': {
      const newChat: Chat = {
        id: action.payload?.id ?? crypto.randomUUID(),
        title: action.payload?.title ?? `Чат ${createChatNumber(state.chats)}`,
        messages: []
      };

      return {
        ...state,
        chats: [...state.chats, newChat],
        activeChatId: newChat.id
      };
    }

    case 'DELETE_CHAT': {
      const nextChats = state.chats.filter((chat) => chat.id !== action.payload);
      const isDeletingActiveChat = state.activeChatId === action.payload;

      return {
        chats: nextChats,
        activeChatId: isDeletingActiveChat ? null : state.activeChatId
      };
    }

    case 'RENAME_CHAT': {
      return {
        ...state,
        chats: state.chats.map((chat) =>
          chat.id === action.payload.chatId ? { ...chat, title: action.payload.title } : chat
        )
      };
    }

    case 'SET_ACTIVE_CHAT': {
      return {
        ...state,
        activeChatId: action.payload
      };
    }

    default: {
      return state;
    }
  }
}
