import { HttpError, readJsonSafe } from '../lib/http.js';
import { env } from '../config/env.js';
import { getAccessToken } from './tokenService.js';
import type { StreamChatBody } from '../types/chat.js';

const buildHeaders = async (accept: string = 'application/json') => {
  const token = await getAccessToken();
  return {
    Authorization: `Bearer ${token}`,
    Accept: accept,
  };
};

const fetchWithGigaChatError = async (input: string, init?: RequestInit) => {
  try {
    return await fetch(input, init);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown network error';
    throw new HttpError(502, `Ошибка подключения к GigaChat API: ${message}. Проверь TLS/сертификаты Минцифры.`);
  }
};

export const getModels = async () => {
  const headers = await buildHeaders();
  const response = await fetchWithGigaChatError(`${env.gigachatApiBaseUrl}/models`, { headers });

  if (!response.ok) {
    const error = await readJsonSafe<{ message?: string }>(response);
    throw new HttpError(response.status, error?.message ?? 'Не удалось получить модели');
  }

  return response.json();
};

export const uploadFileToGigaChat = async (file: Express.Multer.File) => {
  const headers = await buildHeaders();
  const formData = new FormData();
  const bytes = new Uint8Array(file.buffer);
  const blob = new Blob([bytes], { type: file.mimetype || 'application/octet-stream' });
  formData.append('file', blob, file.originalname);
  formData.append('purpose', 'general');

  const response = await fetchWithGigaChatError(`${env.gigachatApiBaseUrl}/files`, {
    method: 'POST',
    headers,
    body: formData,
  });

  if (!response.ok) {
    const error = await readJsonSafe<{ message?: string }>(response);
    throw new HttpError(response.status, error?.message ?? 'Не удалось загрузить файл в GigaChat');
  }

  return response.json();
};

export const streamChatCompletion = async (body: StreamChatBody) => {
  const headers = await buildHeaders('text/event-stream');
  const payload = {
    model: body.settings.model,
    messages: body.messages,
    temperature: body.settings.temperature,
    top_p: body.settings.top_p,
    max_tokens: body.settings.max_tokens,
    repetition_penalty: body.settings.repetition_penalty,
    function_call: body.settings.function_call,
    attachments: body.attachments?.map((item) => item.gigaFileId).filter(Boolean),
    stream: true,
  };

  const response = await fetchWithGigaChatError(`${env.gigachatApiBaseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok || !response.body) {
    const error = await readJsonSafe<{ message?: string }>(response);
    throw new HttpError(response.status, error?.message ?? 'Не удалось запустить генерацию');
  }

  return response;
};
