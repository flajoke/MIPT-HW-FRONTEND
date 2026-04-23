# GigaChat Chat App

Готовый full-stack проект под итоговое ДЗ: интерфейс в стиле ChatGPT на **React 18 + TypeScript**, хранение истории чатов в **localStorage**, серверный прокси на **Node.js + Express + TypeScript** для безопасной работы с **GigaChat API**.

## Что реализовано

### Интерфейс чата
- главный экран с лентой сообщений и полем ввода;
- разный дизайн сообщений пользователя и ассистента;
- markdown-рендеринг ответов;
- подсветка кода;
- индикатор генерации;
- автоскролл к последнему сообщению;
- копирование ответа ассистента;
- кнопка **«Остановить генерацию»**;
- загрузка изображений и файлов в запрос.

### Управление чатами
- sidebar со списком чатов;
- новый чат;
- автоназвание по первому сообщению;
- переключение между чатами без потери данных;
- редактирование названия;
- удаление с подтверждением;
- поиск по названиям и содержимому;
- сохранение истории в `localStorage`.

### Работа с GigaChat API
- получение access token через `POST /api/v2/oauth`;
- список моделей через `GET /api/v1/models`;
- чат через `POST /api/v1/chat/completions`;
- streaming-режим через SSE;
- проксирование стрима с backend на frontend;
- параметры `temperature`, `top_p`, `max_tokens`, `repetition_penalty`;
- загрузка файлов и изображений в GigaChat Storage, передача их через `attachments`.

## Технологии

### Frontend
- React 18
- TypeScript
- Vite
- Zustand
- Tailwind CSS
- react-markdown
- react-syntax-highlighter
- lucide-react

### Backend
- Node.js
- Express
- TypeScript
- native `fetch` / `FormData`
- SSE proxy

## Быстрый старт

### 1. Установка

```bash
npm install
```

### 2. Настройка env

Скопируй пример:

```bash
cp .env.example .env
```

Заполни `.env`:

```env
PORT=8787
GIGACHAT_AUTH_KEY=Basic xxxxxxxxxxxxxxxxx
GIGACHAT_SCOPE=GIGACHAT_API_PERS
GIGACHAT_API_BASE_URL=https://gigachat.devices.sberbank.ru/api/v1
GIGACHAT_OAUTH_URL=https://ngw.devices.sberbank.ru:9443/api/v2/oauth
VITE_API_BASE_URL=http://localhost:8787
GIGACHAT_SKIP_TLS_VERIFY=true
```

> `GIGACHAT_AUTH_KEY` — это значение заголовка `Authorization` для OAuth-запроса.

### 3. Запуск dev

```bash
npm run dev
```

- frontend: `http://localhost:5173`
- backend: `http://localhost:8787`


## Как пользоваться

1. Открыть приложение.
2. При желании выбрать модель.
3. Настроить `temperature`, `top_p`, `max_tokens`, `repetition_penalty`.
4. Ввести сообщение.
5. При необходимости прикрепить изображение/файл.
6. Получать ответ в потоковом режиме.
7. Нажать **Stop**, если надо прервать генерацию.

## Структура проекта

```text
gigachat-chat-app/
  client/                 # React frontend
  server/                 # Express backend proxy
  .env.example
  README.md
```