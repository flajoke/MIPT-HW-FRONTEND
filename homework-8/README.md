# Домашнее задание 8 — Тестирование React-приложения

Готовый минимальный проект на React + TypeScript + Vite + Vitest + React Testing Library.

## Что покрыто тестами

### Юнит-тесты
- `chatReducer`
  - `ADD_MESSAGE`
  - `CREATE_CHAT`
  - `DELETE_CHAT`
  - `RENAME_CHAT`

### Компонентные тесты
- `InputArea`
  - отправка по кнопке
  - отправка по Enter
  - блокировка кнопки при пустом вводе
- `Message`
  - рендер для `user`
  - рендер для `assistant`
  - кнопка `Копировать` только для `assistant`
- `Sidebar`
  - фильтрация чатов по поиску
  - показ всех чатов при пустом запросе
  - подтверждение удаления через `window.confirm`

### LocalStorage
- сохранение состояния
- восстановление состояния
- защита от битого JSON

## Структура

```text
src/
├── components/
│   ├── chat/
│   │   ├── InputArea.tsx
│   │   ├── InputArea.test.tsx
│   │   ├── Message.tsx
│   │   └── Message.test.tsx
│   └── sidebar/
│       ├── Sidebar.tsx
│       └── Sidebar.test.tsx
├── store/
│   ├── chatReducer.ts
│   └── chatReducer.test.ts
├── utils/
│   ├── storage.ts
│   └── storage.test.ts
```

## Как запустить проект

1. Установите зависимости:

```bash
npm install
```

2. Запустите приложение в режиме разработки:

```bash
npm run dev
```

3. Откройте адрес, который покажет Vite в терминале.

## Как запустить тесты

Одноразовый запуск:

```bash
npm test
```

Режим наблюдения:

```bash
npm run test:watch
```

Покрытие:

```bash
npm run coverage
```

## Как проверить, что всё сделано правильно

После `npm test` должны пройти все тесты без ошибок.

Проверьте чек-лист:
- тестовое окружение запускается без ошибок;
- reducer покрыт юнит-тестами;
- `InputArea` тестирует кнопку, Enter и disabled-состояние;
- `Message` тестирует `user` и `assistant`;
- `Sidebar` тестирует поиск и подтверждение удаления;
- `localStorage` замокирован через `vi.stubGlobal`.

## Что приложить преподавателю

1. Загрузите проект в GitHub.
2. Убедитесь, что репозиторий публичный.
3. Отправьте ссылку на репозиторий.
