import { useMemo, useState } from 'react';
import { Chat } from '../../types';

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onCreateChat: () => void;
}

export function Sidebar({
  chats,
  activeChatId,
  onSelectChat,
  onDeleteChat,
  onCreateChat
}: SidebarProps) {
  const [search, setSearch] = useState('');

  const filteredChats = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return chats;

    return chats.filter((chat) => chat.title.toLowerCase().includes(query));
  }, [chats, search]);

  const handleDelete = (chatId: string) => {
    const isConfirmed = window.confirm('Удалить чат?');
    if (isConfirmed) {
      onDeleteChat(chatId);
    }
  };

  return (
    <aside className="sidebar">
      <button type="button" onClick={onCreateChat}>
        Новый чат
      </button>

      <input
        type="text"
        aria-label="Поиск чатов"
        placeholder="Поиск"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <ul>
        {filteredChats.map((chat) => (
          <li key={chat.id}>
            <button
              type="button"
              className={chat.id === activeChatId ? 'chat-item chat-item--active' : 'chat-item'}
              onClick={() => onSelectChat(chat.id)}
            >
              {chat.title}
            </button>
            <button type="button" aria-label={`Удалить ${chat.title}`} onClick={() => handleDelete(chat.id)}>
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}
