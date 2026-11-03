interface MessageProps {
  content: string;
  timestamp: string;
  variant: 'user' | 'assistant';
}

export default function Message({ content, timestamp, variant }: MessageProps) {
  return (
    <article className={`message message--${variant}`}>
      <div className="message__meta">
        <span>{variant === 'user' ? 'Вы' : 'Ассистент'}</span>
        <time>{timestamp}</time>
      </div>
      <p className="message__content">{content}</p>
    </article>
  );
}
