import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidebar } from './Sidebar';
import { Chat } from '../../types';

const chats: Chat[] = [
  { id: '1', title: 'React чат', messages: [] },
  { id: '2', title: 'TypeScript заметки', messages: [] },
  { id: '3', title: 'Тестирование', messages: [] }
];

describe('Sidebar', () => {
  it('фильтрует список чатов по названию во время ввода', async () => {
    const user = userEvent.setup();

    render(
      <Sidebar
        chats={chats}
        activeChatId="1"
        onSelectChat={vi.fn()}
        onDeleteChat={vi.fn()}
        onCreateChat={vi.fn()}
      />
    );

    await user.type(screen.getByLabelText('Поиск чатов'), 'type');

    expect(screen.queryByText('React чат')).not.toBeInTheDocument();
    expect(screen.getByText('TypeScript заметки')).toBeInTheDocument();
    expect(screen.queryByText('Тестирование')).not.toBeInTheDocument();
  });

  it('при пустом поиске показывает все чаты', () => {
    render(
      <Sidebar
        chats={chats}
        activeChatId="1"
        onSelectChat={vi.fn()}
        onDeleteChat={vi.fn()}
        onCreateChat={vi.fn()}
      />
    );

    expect(screen.getByText('React чат')).toBeInTheDocument();
    expect(screen.getByText('TypeScript заметки')).toBeInTheDocument();
    expect(screen.getByText('Тестирование')).toBeInTheDocument();
  });

  it('запрашивает подтверждение при удалении', async () => {
    const user = userEvent.setup();
    const onDeleteChat = vi.fn();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

    render(
      <Sidebar
        chats={chats}
        activeChatId="1"
        onSelectChat={vi.fn()}
        onDeleteChat={onDeleteChat}
        onCreateChat={vi.fn()}
      />
    );

    await user.click(screen.getByLabelText('Удалить React чат'));

    expect(confirmSpy).toHaveBeenCalledWith('Удалить чат?');
    expect(onDeleteChat).toHaveBeenCalledWith('1');

    confirmSpy.mockRestore();
  });
});
