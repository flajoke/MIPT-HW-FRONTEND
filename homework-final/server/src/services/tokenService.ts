import { randomUUID } from 'node:crypto';
import { env } from '../config/env.js';
import { HttpError, readJsonSafe } from '../lib/http.js';

interface TokenResponse {
  access_token: string;
  expires_at?: number;
}

let cachedToken: { value: string; expiresAt: number } | null = null;

const now = () => Date.now();

const buildOAuthAuthorizationHeader = (value: string) => {
  return value.startsWith('Basic ') ? value : `Basic ${value}`;
};

export const getAccessToken = async () => {
  if (cachedToken && cachedToken.expiresAt > now() + 60_000) {
    return cachedToken.value;
  }

  const body = new URLSearchParams({ scope: env.gigachatScope });

  let response: Response;

  try {
    response = await fetch(env.gigachatOauthUrl, {
      method: 'POST',
      headers: {
        Authorization: buildOAuthAuthorizationHeader(env.gigachatAuthKey),
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        RqUID: randomUUID(),
      },
      body,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown network error';
    throw new HttpError(502, `Ошибка подключения к OAuth GigaChat: ${message}. Проверь TLS/сертификаты Минцифры.`);
  }

  if (!response.ok) {
    const error = await readJsonSafe<{ message?: string }>(response);
    throw new HttpError(response.status, error?.message ?? 'Не удалось получить OAuth token');
  }

  const data = (await response.json()) as TokenResponse;
  const expiresAt = data.expires_at ? data.expires_at * 1000 : now() + 29 * 60_000;
  cachedToken = { value: data.access_token, expiresAt };
  return data.access_token;
};
