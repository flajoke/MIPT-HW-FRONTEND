import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChat } from '../../app/providers/ChatProvider';
import { MessageInput } from './MessageInput';
import { MessageList } from './MessageList';

export function ChatWindow() {
  const { activeChat, state, sendMessage } = useChat();
  const navigate = useNavigate();
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  if (!activeChat) {
    return (
      <section className="chat-window empty-state">
        <h2>Чат не выбран</h2>
      </section>
    );
  }

  const handleSend = async (text: string) => {
    const chatId = await sendMessage(text);
    if (chatId) {
      navigate(`/chat/${chatId}`);
    }
  };

  return (
    <section className="chat-window">
      <header className="chat-window__header">
        <h2>{activeChat.title}</h2>
        {state.error && <p className="chat-window__error">{state.error}</p>}
      </header>

      <MessageList messages={activeChat.messages} />
      <div ref={bottomRef} />
      <MessageInput onSend={handleSend} disabled={state.isLoading} />
    </section>
  );
}
