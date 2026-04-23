export type Role = 'system' | 'user' | 'assistant';

export type AttachmentKind = 'image' | 'file';

export interface LocalAttachment {
  id: string;
  fileName: string;
  mimeType: string;
  size: number;
  kind: AttachmentKind;
  gigaFileId?: string;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  createdAt: string;
  attachments?: LocalAttachment[];
  isStreaming?: boolean;
  error?: boolean;
}

export interface ChatSettings {
  model: string;
  systemPrompt: string;
  temperature: number;
  top_p: number;
  max_tokens: number;
  repetition_penalty: number;
  function_call: 'none' | 'auto';
}

export interface ChatItem {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  settings: ChatSettings;
}

export interface PersistedState {
  chats: ChatItem[];
  activeChatId: string | null;
}

export interface ModelInfo {
  id: string;
  owned_by?: string;
  object?: string;
}
