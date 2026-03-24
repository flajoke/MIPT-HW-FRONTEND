import type { RefObject } from 'react';
import type { Message as MessageType } from '../../types/message';
import Message from './Message';
import TypingIndicator from './TypingIndicator';

interface MessageListProps {
  messages: MessageType[];
  isLoading: boolean;
  bottomRef: RefObject<HTMLDivElement>;
}

export default function MessageList({ messages, isLoading, bottomRef }: MessageListProps) {
  return (
    <section className="chat-window__messages" aria-label="Список сообщений">
      {messages.map((message) => (
        <Message
          key={message.id}
          content={message.content}
          timestamp={message.timestamp}
          variant={message.role}
        />
      ))}

      <TypingIndicator isVisible={isLoading} />
      <div ref={bottomRef} />
    </section>
  );
}
