import { useEffect, useState } from 'react';
import styles from '../../styles/Message.module.css';

interface MessageProps {
  variant: 'user' | 'assistant';
  content: string;
}

function Message({ variant, content }: MessageProps) {
  const [copied, setCopied] = useState(false);
  const isAssistant = variant === 'assistant';

  useEffect(() => {
    if (!copied) return;

    const timer = window.setTimeout(() => {
      setCopied(false);
    }, 2000);

    return () => window.clearTimeout(timer);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <article className={`${styles.message} ${variant === 'user' ? styles.user : styles.assistant}`}>
      <div className={styles.meta}>{variant === 'user' ? 'Вы' : 'Ассистент'}</div>
      <div className={styles.bubble}>
        {isAssistant ? (
          <button type="button" className={styles.copyButton} onClick={handleCopy}>
            {copied ? 'Скопировано' : 'Копировать'}
          </button>
        ) : null}
        <p className={styles.content}>{content}</p>
      </div>
    </article>
  );
}

export default Message;
