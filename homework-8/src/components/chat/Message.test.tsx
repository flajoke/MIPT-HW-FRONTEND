import { render, screen } from '@testing-library/react';
import { Message } from './Message';

describe('Message', () => {
  it('рендерит пользовательское сообщение с нужным классом', () => {
    render(<Message text="Сообщение пользователя" variant="user" />);

    expect(screen.getByText('Сообщение пользователя')).toBeInTheDocument();
    expect(screen.getByTestId('message')).toHaveClass('message--user');
    expect(screen.queryByRole('button', { name: 'Копировать' })).not.toBeInTheDocument();
  });

  it('рендерит сообщение ассистента с нужным классом и кнопкой копирования', () => {
    render(<Message text="Ответ ассистента" variant="assistant" />);

    expect(screen.getByText('Ответ ассистента')).toBeInTheDocument();
    expect(screen.getByTestId('message')).toHaveClass('message--assistant');
    expect(screen.getByRole('button', { name: 'Копировать' })).toBeInTheDocument();
  });
});
