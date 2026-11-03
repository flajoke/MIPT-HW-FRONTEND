export type Role = 'system' | 'user' | 'assistant';

export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: number;
  status?: 'pending' | 'done' | 'error';
}

export interface Chat {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
}

export interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
  isLoading: boolean;
  error: string | null;
}

export type ChatAction =
  | { type: 'INIT_STATE'; payload: ChatState }
  | { type: 'CREATE_CHAT'; payload?: { id?: string; title?: string } }
  | { type: 'DELETE_CHAT'; payload: { chatId: string } }
  | { type: 'SET_ACTIVE_CHAT'; payload: { chatId: string | null } }
  | { type: 'RENAME_CHAT'; payload: { chatId: string; title: string } }
  | { type: 'ADD_MESSAGE'; payload: { chatId: string; message: Message } }
  | { type: 'UPDATE_MESSAGE'; payload: { chatId: string; messageId: string; patch: Partial<Message> } }
  | { type: 'UPSERT_ASSISTANT_PLACEHOLDER'; payload: { chatId: string; message: Message } }
  | { type: 'APPEND_TO_MESSAGE'; payload: { chatId: string; messageId: string; chunk: string } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };
