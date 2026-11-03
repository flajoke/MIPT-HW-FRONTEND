import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';
import type { PropsWithChildren } from 'react';
import { completeChat, streamChat } from '../../api/gigachat';
import type { Chat, ChatAction, ChatState, Message, Role } from '../../types/chat';
import { buildChatTitle } from '../../utils/chatTitle';
import { generateId } from '../../utils/ids';
import { loadChatState, saveChatState } from '../../utils/storage';

interface ChatContextValue {
  state: ChatState;
  activeChat: Chat | null;
  createChat: (title?: string) => string;
  deleteChat: (chatId: string) => void;
  setActiveChat: (chatId: string | null) => void;
  renameChat: (chatId: string, title: string) => void;
  sendMessage: (text: string) => Promise<string | null>;
}

const initialState: ChatState = {
  chats: [],
  activeChatId: null,
  isLoading: false,
  error: null,
};

function sortChats(chats: Chat[]): Chat[] {
  return [...chats].sort((a, b) => b.updatedAt - a.updatedAt);
}

function reducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'INIT_STATE':
      return action.payload;

    case 'CREATE_CHAT': {
      const id = action.payload?.id ?? generateId();
      const now = Date.now();
      const newChat: Chat = {
        id,
        title: action.payload?.title?.trim() || 'Новый чат',
        createdAt: now,
        updatedAt: now,
        messages: [],
      };

      return {
        ...state,
        chats: sortChats([newChat, ...state.chats]),
        activeChatId: id,
        error: null,
      };
    }

    case 'DELETE_CHAT': {
      const chats = state.chats.filter((chat) => chat.id !== action.payload.chatId);
      const nextActiveChatId = state.activeChatId === action.payload.chatId ? null : state.activeChatId;
      return { ...state, chats, activeChatId: nextActiveChatId };
    }

    case 'SET_ACTIVE_CHAT':
      return { ...state, activeChatId: action.payload.chatId };

    case 'RENAME_CHAT': {
      const chats = state.chats.map((chat) =>
        chat.id === action.payload.chatId
          ? { ...chat, title: action.payload.title.trim() || chat.title, updatedAt: Date.now() }
          : chat,
      );
      return { ...state, chats: sortChats(chats) };
    }

    case 'ADD_MESSAGE': {
      const chats = state.chats.map((chat) => {
        if (chat.id !== action.payload.chatId) return chat;

        const nextMessages = [...chat.messages, action.payload.message];
        const nextTitle =
          chat.messages.length === 0 && action.payload.message.role === 'user'
            ? buildChatTitle(action.payload.message.content, state.chats)
            : chat.title;

        return {
          ...chat,
          title: nextTitle,
          messages: nextMessages,
          updatedAt: Date.now(),
        };
      });

      return { ...state, chats: sortChats(chats) };
    }

    case 'UPSERT_ASSISTANT_PLACEHOLDER': {
      const chats = state.chats.map((chat) => {
        if (chat.id !== action.payload.chatId) return chat;

        const existing = chat.messages.find((message) => message.id === action.payload.message.id);
        const messages = existing
          ? chat.messages.map((message) =>
              message.id === action.payload.message.id ? action.payload.message : message,
            )
          : [...chat.messages, action.payload.message];

        return {
          ...chat,
          messages,
          updatedAt: Date.now(),
        };
      });

      return { ...state, chats: sortChats(chats) };
    }

    case 'APPEND_TO_MESSAGE': {
      const chats = state.chats.map((chat) => {
        if (chat.id !== action.payload.chatId) return chat;

        return {
          ...chat,
          updatedAt: Date.now(),
          messages: chat.messages.map((message) =>
            message.id === action.payload.messageId
              ? { ...message, content: message.content + action.payload.chunk }
              : message,
          ),
        };
      });

      return { ...state, chats: sortChats(chats) };
    }

    case 'UPDATE_MESSAGE': {
      const chats = state.chats.map((chat) => {
        if (chat.id !== action.payload.chatId) return chat;

        return {
          ...chat,
          updatedAt: Date.now(),
          messages: chat.messages.map((message) =>
            message.id === action.payload.messageId
              ? { ...message, ...action.payload.patch }
              : message,
          ),
        };
      });

      return { ...state, chats: sortChats(chats) };
    }

    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };

    case 'SET_ERROR':
      return { ...state, error: action.payload };

    default:
      return state;
  }
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const stored = loadChatState();
    if (stored) {
      dispatch({ type: 'INIT_STATE', payload: stored });
    }
  }, []);

  useEffect(() => {
    saveChatState(state);
  }, [state]);

  const activeChat = useMemo(
    () => state.chats.find((chat) => chat.id === state.activeChatId) ?? null,
    [state.chats, state.activeChatId],
  );

  const createChat = useCallback((title?: string) => {
    const id = generateId();
    dispatch({ type: 'CREATE_CHAT', payload: { id, title } });
    return id;
  }, []);

  const deleteChat = useCallback((chatId: string) => {
    dispatch({ type: 'DELETE_CHAT', payload: { chatId } });
  }, []);

  const setActiveChat = useCallback((chatId: string | null) => {
    dispatch({ type: 'SET_ACTIVE_CHAT', payload: { chatId } });
  }, []);

  const renameChat = useCallback((chatId: string, title: string) => {
    dispatch({ type: 'RENAME_CHAT', payload: { chatId, title } });
  }, []);

  const sendMessage = useCallback(async (text: string) => {
    const content = text.trim();
    if (!content) return null;

    let chatId = state.activeChatId;
    if (!chatId) {
      chatId = createChat();
    }

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content,
      createdAt: Date.now(),
      status: 'done',
    };

    const assistantMessage: Message = {
      id: generateId(),
      role: 'assistant',
      content: '',
      createdAt: Date.now(),
      status: 'pending',
    };

    dispatch({ type: 'ADD_MESSAGE', payload: { chatId, message: userMessage } });
    dispatch({ type: 'UPSERT_ASSISTANT_PLACEHOLDER', payload: { chatId, message: assistantMessage } });
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      const currentChat = state.chats.find((chat) => chat.id === chatId);
      const history = [...(currentChat?.messages ?? []), userMessage];

      const apiMessages: { role: Role; content: string }[] = history.map((message) => ({
        role: message.role,
        content: message.content,
      }));

      try {
        await streamChat(
          {
            model: 'GigaChat',
            messages: apiMessages,
            stream: true,
          },
          (chunk) => {
            dispatch({
              type: 'APPEND_TO_MESSAGE',
              payload: { chatId: chatId!, messageId: assistantMessage.id, chunk },
            });
          },
        );

        dispatch({
          type: 'UPDATE_MESSAGE',
          payload: {
            chatId,
            messageId: assistantMessage.id,
            patch: { status: 'done' },
          },
        });
      } catch (streamError) {
        console.warn('Streaming failed, fallback to REST', streamError);

        const answer = await completeChat({
          model: 'GigaChat',
          messages: apiMessages,
          stream: false,
        });

        dispatch({
          type: 'UPDATE_MESSAGE',
          payload: {
            chatId,
            messageId: assistantMessage.id,
            patch: { content: answer, status: 'done' },
          },
        });
      }

      return chatId;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Неизвестная ошибка';
      dispatch({ type: 'SET_ERROR', payload: message });
      dispatch({
        type: 'UPDATE_MESSAGE',
        payload: {
          chatId,
          messageId: assistantMessage.id,
          patch: { content: `Ошибка: ${message}`, status: 'error' },
        },
      });
      return chatId;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [createChat, state.activeChatId, state.chats]);

  const value = useMemo<ChatContextValue>(
    () => ({ state, activeChat, createChat, deleteChat, setActiveChat, renameChat, sendMessage }),
    [state, activeChat, createChat, deleteChat, setActiveChat, renameChat, sendMessage],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat(): ChatContextValue {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
}
