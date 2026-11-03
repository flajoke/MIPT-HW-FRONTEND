import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';
import type { Message } from '../../types/chat';
import '../../styles/markdown.css';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="message-list">
      {messages.map((message) => (
        <div key={message.id} className={`message message--${message.role}`}>
          <div className="message__meta">
            <strong>{message.role === 'user' ? 'Вы' : 'Ассистент'}</strong>
            {message.status === 'pending' && <span className="message__status">печатает...</span>}
          </div>

          {message.role === 'assistant' ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {message.content || '...'}
            </ReactMarkdown>
          ) : (
            <p>{message.content}</p>
          )}
        </div>
      ))}
    </div>
  );
}
