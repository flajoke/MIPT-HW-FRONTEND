import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { randomUUID } from 'node:crypto';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = Number(process.env.PORT ?? 8787);
const AUTH_KEY = process.env.GIGACHAT_AUTH_KEY ?? '';
const SCOPE = process.env.GIGACHAT_SCOPE ?? 'GIGACHAT_API_PERS';
const MODEL = process.env.GIGACHAT_MODEL ?? 'GigaChat';

let cachedToken = '';
let tokenExpiresAt = 0;

async function getAccessToken(): Promise<string> {
  const now = Date.now();
  if (cachedToken && now < tokenExpiresAt - 60_000) {
    return cachedToken;
  }

  if (!AUTH_KEY) {
    throw new Error('Не заполнен GIGACHAT_AUTH_KEY в .env');
  }

  const body = new URLSearchParams({ scope: SCOPE });

  const response = await fetch('https://ngw.devices.sberbank.ru:9443/api/v2/oauth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
      Authorization: `Basic ${AUTH_KEY}`,
      RqUID: randomUUID(),
    },
    body,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OAuth error: ${text}`);
  }

  const data = (await response.json()) as { access_token: string; expires_at: number };
  cachedToken = data.access_token;
  tokenExpiresAt = Number(data.expires_at) * 1000;
  return cachedToken;
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/chat/completions', async (req, res) => {
  try {
    const token = await getAccessToken();
    const { messages, stream = false, model = MODEL } = req.body as {
      messages?: Array<{ role: string; content: string }>;
      stream?: boolean;
      model?: string;
    };

    if (!Array.isArray(messages) || messages.length === 0) {
      res.status(400).send('messages must be a non-empty array');
      return;
    }

    const response = await fetch('https://gigachat.devices.sberbank.ru/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: stream ? 'text/event-stream' : 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ model, messages, stream }),
    });

    if (!response.ok) {
      const text = await response.text();
      res.status(response.status).send(text);
      return;
    }

    if (stream) {
      res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
      res.setHeader('Cache-Control', 'no-cache, no-transform');
      res.setHeader('Connection', 'keep-alive');

      const reader = response.body?.getReader();
      if (!reader) {
        res.status(500).send('No stream body');
        return;
      }

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(decoder.decode(value, { stream: true }));
      }

      res.end();
      return;
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Server error';
    res.status(500).send(message);
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
