import { FormEvent, useState } from 'react';

interface InputAreaProps {
  isLoading: boolean;
  onSendMessage: (content: string) => void;
}

export default function InputArea({ isLoading, onSendMessage }: InputAreaProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedValue = value.trim();
    if (!trimmedValue || isLoading) {
      return;
    }

    onSendMessage(trimmedValue);
    setValue('');
  };

  return (
    <form className="input-area" onSubmit={handleSubmit}>
      <input
        className="input-area__field"
        type="text"
        placeholder="Введите сообщение..."
        value={value}
        onChange={(event) => setValue(event.target.value)}
        disabled={isLoading}
      />
      <button
        className="input-area__button"
        type="submit"
        disabled={!value.trim() || isLoading}
      >
        {isLoading ? 'Ждём ответ...' : 'Отправить'}
      </button>
    </form>
  );
}
