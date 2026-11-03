import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });
dotenv.config();

const required = ['GIGACHAT_AUTH_KEY'] as const;

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`Missing required env var: ${key}`);
  }
}

export const env = {
  port: Number(process.env.PORT ?? 8787),
  gigachatAuthKey: process.env.GIGACHAT_AUTH_KEY as string,
  gigachatScope: process.env.GIGACHAT_SCOPE ?? 'GIGACHAT_API_PERS',
  gigachatApiBaseUrl: process.env.GIGACHAT_API_BASE_URL ?? 'https://gigachat.devices.sberbank.ru/api/v1',
  gigachatOauthUrl: process.env.GIGACHAT_OAUTH_URL ?? 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth',
  gigachatCaCertPath: process.env.GIGACHAT_CA_CERT_PATH,
  gigachatSkipTlsVerify: process.env.GIGACHAT_SKIP_TLS_VERIFY === 'true',
};
