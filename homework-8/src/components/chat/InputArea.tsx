import { KeyboardEvent, useState } from 'react';

interface InputAreaProps {
  onSend: (text: string) => void;
}

export function InputArea({ onSend }: InputAreaProps) {
  const [value, setValue] = useState('');
  const trimmedValue = value.trim();

  const submit = () => {
    if (!trimmedValue) return;
    onSend(trimmedValue);
    setValue('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className="input-area">
      <label htmlFor="message-input">Сообщение</label>
      <textarea
        id="message-input"
        aria-label="Поле ввода сообщения"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        rows={3}
      />
      <button type="button" onClick={submit} disabled={!trimmedValue}>
        Отправить
      </button>
    </div>
  );
}
