import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InputArea } from './InputArea';

describe('InputArea', () => {
  it('вызывает onSend при клике по кнопке с непустым значением', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();

    render(<InputArea onSend={onSend} />);

    await user.type(screen.getByLabelText('Поле ввода сообщения'), 'Привет');
    await user.click(screen.getByRole('button', { name: 'Отправить' }));

    expect(onSend).toHaveBeenCalledTimes(1);
    expect(onSend).toHaveBeenCalledWith('Привет');
    expect(screen.getByLabelText('Поле ввода сообщения')).toHaveValue('');
  });

  it('вызывает onSend по Enter с непустым значением', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();

    render(<InputArea onSend={onSend} />);

    await user.type(screen.getByLabelText('Поле ввода сообщения'), 'Сообщение{enter}');

    expect(onSend).toHaveBeenCalledTimes(1);
    expect(onSend).toHaveBeenCalledWith('Сообщение');
  });

  it('держит кнопку отправки disabled при пустом поле', () => {
    render(<InputArea onSend={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Отправить' })).toBeDisabled();
  });
});
