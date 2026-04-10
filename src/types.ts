export type MessageVariant = 'user' | 'assistant';

export interface ChatMessage {
  id: string;
  text: string;
  variant: MessageVariant;
}

export interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
}

export interface ChatState {
  chats: Chat[];
  activeChatId: string | null;
}
