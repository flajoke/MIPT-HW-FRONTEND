import { useEffect, useRef, useState } from 'react';
import type { Message } from '../../types/message';
import InputArea from './InputArea';
import MessageList from './MessageList';

const assistantReplies = [
  'Понял вас. Могу помочь ещё с чем-нибудь?',
  'Спасибо за сообщение. Я уже обработал ваш запрос.',
  'Готово. Вот моковый ответ ассистента для домашнего задания.',
  'Отлично, сообщение получено. Продолжим диалог!',
];

const formatTime = (date: Date) =>
  new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);

const createMessage = (role: Message['role'], content: string): Message => ({
  id: crypto.randomUUID(),
  role,
  content,
  timestamp: formatTime(new Date()),
});

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    createMessage('assistant', 'Здравствуйте! Это стартовое сообщение чата.'),
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleSendMessage = (content: string) => {
    const userMessage = createMessage('user', content);
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    const randomReply =
      assistantReplies[Math.floor(Math.random() * assistantReplies.length)];
    const randomDelay = 1000 + Math.floor(Math.random() * 1000);

    timeoutRef.current = window.setTimeout(() => {
      setMessages((prevMessages) => [...prevMessages, createMessage('assistant', randomReply)]);
      setIsLoading(false);
    }, randomDelay);
  };

  return (
    <section className="chat-window">
      <header className="chat-window__header">
        <h1>Учебный чат</h1>
        <p>Домашнее задание 4: useState, useEffect, useRef</p>
      </header>

      <MessageList messages={messages} isLoading={isLoading} bottomRef={bottomRef} />
      <InputArea isLoading={isLoading} onSendMessage={handleSendMessage} />
    </section>
  );
}
