import { useState } from 'react';

interface MessageInputProps {
  disabled?: boolean;
  onSend: (value: string) => Promise<void> | void;
}

export function MessageInput({ disabled, onSend }: MessageInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const text = value.trim();
    if (!text) return;

    setValue('');
    await onSend(text);
  };

  return (
    <form className="message-input" onSubmit={handleSubmit}>
      <textarea
        rows={4}
        placeholder="Напишите сообщение..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={disabled}
      />
      <button className="primary-button" type="submit" disabled={disabled || !value.trim()}>
        Отправить
      </button>
    </form>
  );
}
