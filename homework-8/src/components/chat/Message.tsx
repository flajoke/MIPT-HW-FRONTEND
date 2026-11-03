import { useState } from 'react';
import { MessageVariant } from '../../types';

interface MessageProps {
  text: string;
  variant: MessageVariant;
}

export function Message({ text, variant }: MessageProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
  };

  return (
    <article className={`message message--${variant}`} data-testid="message">
      <p>{text}</p>
      {variant === 'assistant' ? (
        <button type="button" onClick={handleCopy}>
          {copied ? 'Скопировано' : 'Копировать'}
        </button>
      ) : null}
    </article>
  );
}
