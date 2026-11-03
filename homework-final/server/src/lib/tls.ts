import fs from 'node:fs';
import { Agent, setGlobalDispatcher } from 'undici';
import { env } from '../config/env.js';

let configured = false;

export const setupTlsForGigaChat = () => {
  if (configured) return;

  const connect: { ca?: string; rejectUnauthorized?: boolean } = {};

  if (env.gigachatCaCertPath) {
    try {
      connect.ca = fs.readFileSync(env.gigachatCaCertPath, 'utf-8');
      console.log(`Loaded GigaChat CA certificate from ${env.gigachatCaCertPath}`);
    } catch (error) {
      console.warn(`Failed to read GigaChat CA cert at ${env.gigachatCaCertPath}`, error);
    }
  }

  if (env.gigachatSkipTlsVerify) {
    connect.rejectUnauthorized = false;
    console.warn('WARNING: GIGACHAT_SKIP_TLS_VERIFY=true. TLS certificate verification is disabled. Use only for local development.');
  }

  if (connect.ca || connect.rejectUnauthorized === false)
    {
    setGlobalDispatcher(new Agent({ connect }));
  }

  configured = true;
};

