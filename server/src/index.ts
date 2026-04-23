import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { HttpError } from './lib/http.js';
import { chatRoutes } from './routes/chatRoutes.js';
import { setupTlsForGigaChat } from './lib/tls.js';

setupTlsForGigaChat();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/api', chatRoutes);

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  if (error instanceof HttpError) {
    res.status(error.status).json({ message: error.message });
    return;
  }

  if (error instanceof Error) {
    console.error(error);
    res.status(500).json({ message: error.message });
    return;
  }

  res.status(500).json({ message: 'Unexpected server error' });
});

app.listen(env.port, () => {
  console.log(`Server started on http://localhost:${env.port}`);
});
