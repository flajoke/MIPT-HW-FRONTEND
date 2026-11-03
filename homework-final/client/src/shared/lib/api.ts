import type { ChatSettings, LocalAttachment, Message, ModelInfo } from '@/shared/types/chat';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8787';

export interface StreamHandlers {
  onDelta: (delta: string) => void;
  onDone: (payload?: unknown) => void;
  onError: (message: string) => void;
}

interface StreamRequestPayload {
  messages: Pick<Message, 'role' | 'content'>[];
  settings: ChatSettings;
  attachments: LocalAttachment[];
}

export const fetchModels = async (): Promise<ModelInfo[]> => {
  const response = await fetch(`${API_BASE_URL}/api/models`);
  if (!response.ok) {
    throw new Error('Не удалось загрузить модели');
  }

  const data = (await response.json()) as { data?: ModelInfo[] };
  return data.data ?? [];
};

export const uploadAttachment = async (file: File): Promise<LocalAttachment> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/api/files/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(error?.message ?? 'Не удалось загрузить файл');
  }

  const data = (await response.json()) as { id: string };

  return {
    id: crypto.randomUUID(),
    fileName: file.name,
    mimeType: file.type || 'application/octet-stream',
    size: file.size,
    gigaFileId: data.id,
    kind: file.type.startsWith('image/') ? 'image' : 'file',
  };
};

export const streamChatCompletion = async (
  payload: StreamRequestPayload,
  handlers: StreamHandlers,
  signal: AbortSignal,
) => {
  const response = await fetch(`${API_BASE_URL}/api/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'text/event-stream',
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok || !response.body) {
    const error = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(error?.message ?? 'Ошибка запуска стриминга');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  const processEvent = (chunk: string) => {
    const lines = chunk.split('\n');
    const dataLines = lines
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.replace(/^data:\s?/, ''));

    if (!dataLines.length) return;

    const payloadText = dataLines.join('\n').trim();
    if (!payloadText) return;

    if (payloadText === '[DONE]') {
      handlers.onDone();
      return;
    }

    try {
      const parsed = JSON.parse(payloadText) as {
        type?: 'delta' | 'done' | 'error';
        delta?: string;
        message?: string;
        payload?: unknown;
      };

      if (parsed.type === 'delta' && parsed.delta) {
        handlers.onDelta(parsed.delta);
        return;
      }

      if (parsed.type === 'done') {
        handlers.onDone(parsed.payload);
        return;
      }

      if (parsed.type === 'error') {
        handlers.onError(parsed.message ?? 'Ошибка стрима');
      }
    } catch {
      handlers.onDelta(payloadText);
    }
  };

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const parts = buffer.split('\n\n');
    buffer = parts.pop() ?? '';
    parts.forEach(processEvent);
  }

  if (buffer.trim()) {
    processEvent(buffer);
  }
};
