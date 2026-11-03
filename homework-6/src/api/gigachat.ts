import type { Role } from '../types/chat';

export interface GigaChatMessage {
  role: Role;
  content: string;
}

export interface ChatCompletionRequest {
  messages: GigaChatMessage[];
  model?: string;
  stream?: boolean;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8787';

export async function completeChat(payload: ChatCompletionRequest): Promise<string> {
  const response = await fetch(`${API_BASE}/api/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, stream: false }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Ошибка запроса к GigaChat');
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content ?? '';
}

export async function streamChat(
  payload: ChatCompletionRequest,
  onChunk: (chunk: string) => void,
): Promise<void> {
  const response = await fetch(`${API_BASE}/api/chat/completions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, stream: true }),
  });

  if (!response.ok || !response.body) {
    const text = await response.text().catch(() => '');
    throw new Error(text || 'Streaming недоступен');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split('\n\n');
    buffer = parts.pop() ?? '';

    for (const part of parts) {
      const lines = part.split('\n').map((line) => line.trim()).filter(Boolean);

      for (const line of lines) {
        if (!line.startsWith('data:')) continue;

        const raw = line.replace(/^data:\s*/, '');
        if (raw === '[DONE]') return;

        try {
          const json = JSON.parse(raw);
          const chunk = json?.choices?.[0]?.delta?.content ?? '';
          if (chunk) onChunk(chunk);
        } catch (error) {
          console.warn('Не удалось распарсить chunk', error, raw);
        }
      }
    }
  }
}
