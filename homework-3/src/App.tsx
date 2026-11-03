import { useMemo, useState } from 'react'
import AppLayout from './components/layout/AppLayout'
import AuthForm from './components/auth/AuthForm'

export type ChatItemData = {
  id: string
  title: string
  date: string
  active?: boolean
}

export type MessageData = {
  id: string
  role: 'user' | 'assistant'
  author: string
  content: string
}

export type ScopeOption = 'GIGACHAT_API_PERS' | 'GIGACHAT_API_B2B' | 'GIGACHAT_API_CORP'
export type ThemeMode = 'light' | 'dark'
export type ModelOption = 'GigaChat' | 'GigaChat-Plus' | 'GigaChat-Pro' | 'GigaChat-Max'

const mockChats: ChatItemData[] = [
  { id: '1', title: 'Новый диалог по React и TypeScript', date: '12.03.2026', active: true },
  { id: '2', title: 'Подготовка к собеседованию frontend developer', date: '11.03.2026' },
  { id: '3', title: 'Список задач на неделю для проекта', date: '10.03.2026' },
  { id: '4', title: 'Идеи для pet-проекта с ИИ ассистентом', date: '08.03.2026' },
  { id: '5', title: 'Разбор ошибок в JSX и props', date: '05.03.2026' },
]

const mockMessages: MessageData[] = [
  {
    id: '1',
    role: 'assistant',
    author: 'GigaChat',
    content: 'Привет. Я помогу собрать **статичный интерфейс** чата на React + TypeScript.',
  },
  {
    id: '2',
    role: 'user',
    author: 'Вы',
    content: 'Нужен список шагов:\n- layout\n- sidebar\n- chat window\n- settings',
  },
  {
    id: '3',
    role: 'assistant',
    author: 'GigaChat',
    content: 'Сначала сделай компонент `AppLayout`, затем разбей UI на переиспользуемые компоненты.',
  },
  {
    id: '4',
    role: 'user',
    author: 'Вы',
    content: 'Добавь пример markdown с *курсивом* и блоком кода.',
  },
  {
    id: '5',
    role: 'assistant',
    author: 'GigaChat',
    content: 'Пример:\n```tsx\nconst title = "GigaChat UI"\n```',
  },
  {
    id: '6',
    role: 'user',
    author: 'Вы',
    content: 'Хорошо, ещё нужен адаптив и тёмная тема.',
  },
]

const initialSettings = {
  model: 'GigaChat' as ModelOption,
  temperature: 1,
  topP: 0.8,
  maxTokens: 1024,
  systemPrompt: 'Ты полезный ИИ-ассистент.',
}

function App() {
  const [isAuth, setIsAuth] = useState(false)
  const [theme, setTheme] = useState<ThemeMode>('light')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settings, setSettings] = useState(initialSettings)

  const currentChat = useMemo(() => mockChats.find((chat) => chat.active), [])

  return (
    <div className="app" data-theme={theme}>
      {isAuth ? (
        <AppLayout
          chats={mockChats}
          currentChatTitle={currentChat?.title ?? 'Новый чат'}
          messages={mockMessages}
          typingVisible
          settingsOpen={settingsOpen}
          onOpenSettings={() => setSettingsOpen(true)}
          onCloseSettings={() => setSettingsOpen(false)}
          settings={settings}
          onSaveSettings={setSettings}
          onResetSettings={() => setSettings(initialSettings)}
          theme={theme}
          onToggleTheme={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
        />
      ) : (
        <AuthForm onLogin={() => setIsAuth(true)} />
      )}
    </div>
  )
}

export default App
