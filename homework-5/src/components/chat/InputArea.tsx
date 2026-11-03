import { ChangeEvent, KeyboardEvent, useState } from 'react';
import styles from '../../styles/InputArea.module.css';

interface InputAreaProps {
  onSend: (message: string) => void;
  onStop: () => void;
  isLoading: boolean;
}

function InputArea({ onSend, onStop, isLoading }: InputAreaProps) {
  const [value, setValue] = useState('');

  const isDisabled = value.trim().length === 0;

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(event.target.value);
  };

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;

    onSend(value);
    setValue('');
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!isLoading) {
        handleSubmit();
      }
    }
  };

  return (
    <div className={styles.wrapper}>
      <label className={styles.label} htmlFor="chat-input">
        Сообщение
      </label>
      <div className={styles.controls}>
        <textarea
          id="chat-input"
          className={styles.textarea}
          placeholder="Введите сообщение..."
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          rows={3}
        />

        <div className={styles.actions}>
          {isLoading ? (
            <button type="button" className={styles.stopButton} onClick={onStop}>
              Стоп
            </button>
          ) : (
            <button
              type="button"
              className={styles.sendButton}
              onClick={handleSubmit}
              disabled={isDisabled}
            >
              Отправить
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default InputArea;
