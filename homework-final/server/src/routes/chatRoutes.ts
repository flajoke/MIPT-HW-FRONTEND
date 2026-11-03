import { Router } from 'express';
import multer from 'multer';
import type { Request, Response } from 'express';
import { HttpError } from '../lib/http.js';
import { getModels, streamChatCompletion, uploadFileToGigaChat } from '../services/gigachatService.js';
import type { StreamChatBody } from '../types/chat.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 40 * 1024 * 1024 } });

router.get('/models', async (_req, res, next) => {
  try {
    const data = await getModels();
    res.json(data);
  } catch (error) {
    next(error);
  }
});

router.post('/files/upload', upload.single('file'), async (req, res, next) => {
  try {
    if (!req.file) {
      throw new HttpError(400, 'Файл не передан');
    }

    const data = await uploadFileToGigaChat(req.file);
    res.json(data);
  } catch (error) {
    next(error);
  }
});

const writeEvent = (res: Response, data: unknown) => {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
};

const extractDelta = (payload: unknown): string => {
  if (!payload || typeof payload !== 'object') return '';
  const data = payload as Record<string, unknown>;
  const choices = Array.isArray(data.choices) ? data.choices : [];
  const firstChoice = choices[0] as Record<string, unknown> | undefined;
  if (!firstChoice) return '';

  const delta = firstChoice.delta as Record<string, unknown> | undefined;
  if (delta && typeof delta.content === 'string') return delta.content;

  const message = firstChoice.message as Record<string, unknown> | undefined;
  if (message && typeof message.content === 'string') return message.content;

  return '';
};

router.post('/chat/stream', async (req: Request<unknown, unknown, StreamChatBody>, res, next) => {
  try {
    const upstream = await streamChatCompletion(req.body);
    const reader = upstream.body?.getReader();

    if (!reader) {
      throw new HttpError(500, 'Поток ответа недоступен');
    }

    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const decoder = new TextDecoder();
    let buffer = '';

    const processBuffer = (chunk: string) => {
      const lines = chunk.split('\n');
      const dataLines = lines
        .filter((line) => line.startsWith('data:'))
        .map((line) => line.replace(/^data:\s?/, '').trim())
        .filter(Boolean);

      for (const line of dataLines) {
        if (line === '[DONE]') {
          writeEvent(res, { type: 'done' });
          continue;
        }

        try {
          const parsed = JSON.parse(line);
          const delta = extractDelta(parsed);
          if (delta) {
            writeEvent(res, { type: 'delta', delta });
          }

          const record = parsed as Record<string, unknown>;
          if (record.choices && Array.isArray(record.choices)) {
            const firstChoice = record.choices[0] as Record<string, unknown> | undefined;
            if (firstChoice?.finish_reason) {
              writeEvent(res, { type: 'done', payload: parsed });
            }
          }
        } catch {
          writeEvent(res, { type: 'delta', delta: line });
        }
      }
    };

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      const parts = buffer.split('\n\n');
      buffer = parts.pop() ?? '';
      parts.forEach(processBuffer);
    }

    if (buffer.trim()) {
      processBuffer(buffer);
    }

    writeEvent(res, { type: 'done' });
    res.end();
  } catch (error) {
    next(error);
  }
});

export { router as chatRoutes };
