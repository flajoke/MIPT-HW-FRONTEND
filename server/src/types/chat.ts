export interface IncomingMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface IncomingSettings {
  model: string;
  temperature: number;
  top_p: number;
  max_tokens: number;
  repetition_penalty: number;
  function_call: 'none' | 'auto';
}

export interface IncomingAttachment {
  gigaFileId?: string;
}

export interface StreamChatBody {
  messages: IncomingMessage[];
  settings: IncomingSettings;
  attachments?: IncomingAttachment[];
}
