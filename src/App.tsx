import { useEffect, useMemo, useRef, useState } from 'react';
import InputArea from './components/chat/InputArea';
import Message from './components/chat/Message';
import Toggle from './components/ui/Toggle';
import styles from './styles/App.module.css';

export type ChatRole = 'user' | 'assistant';

export interface ChatMessage {
  id: number;
  role: ChatRole;
  content: string;
}

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    role: 'assistant',
    content:
      'Привет! Это готовый учебный чат. Напиши сообщение — Enter отправит его, а Shift+Enter добавит новую строку.',
  },
];

function App() {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const nextId = useRef(2);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const theme = savedTheme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const assistantReply = useMemo(
    () => [
      'Сообщение принято. Контролируемая форма работает корректно.',
      'Кнопка «Стоп» тоже подключена: её можно нажать, пока идёт имитация ответа.',
      'Стили оформлены через CSS Modules и CSS-переменные, без inline-стилей.',
      'Интерфейс адаптирован под мобильные и десктопные экраны.',
    ],
    [],
  );

  const sendMessage = (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: nextId.current++,
      role: 'user',
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    timeoutRef.current = window.setTimeout(() => {
      const reply: ChatMessage = {
        id: nextId.current++,
        role: 'assistant',
        content: `${assistantReply[Math.floor(Math.random() * assistantReply.length)]}\n\nВаш текст: «${trimmed}».`,
      };
      setMessages((prev) => [...prev, reply]);
      setIsLoading(false);
      timeoutRef.current = null;
    }, 1800);
  };

  const stopGeneration = () => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    setIsLoading(false);
    setMessages((prev) => [
      ...prev,
      {
        id: nextId.current++,
        role: 'assistant',
        content: 'Генерация ответа остановлена пользователем.',
      },
    ]);
  };

  return (
    <div className={styles.page}>
      <main className={styles.chatShell}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Домашнее задание 5</p>
            <h1 className={styles.title}>Чат с формой, событиями и темами</h1>
          </div>
          <Toggle />
        </header>

        <section ref={listRef} className={styles.messageList} aria-label="Список сообщений">
          {messages.map((message) => (
            <Message key={message.id} variant={message.role} content={message.content} />
          ))}

          {isLoading ? (
            <div className={styles.typingWrap}>
              <div className={styles.typingBubble}>
                <span className={styles.typingDot} />
                <span className={styles.typingDot} />
                <span className={styles.typingDot} />
              </div>
            </div>
          ) : null}
        </section>

        <InputArea onSend={sendMessage} onStop={stopGeneration} isLoading={isLoading} />
      </main>
    </div>
  );
}

export default App;
