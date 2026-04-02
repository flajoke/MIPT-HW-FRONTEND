import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useChat } from '../../app/providers/ChatProvider';

export function Sidebar() {
  const { state, createChat, deleteChat, renameChat, setActiveChat } = useChat();
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftTitle, setDraftTitle] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const filteredChats = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return state.chats;

    return state.chats.filter((chat) => {
      const lastMessage = chat.messages.at(-1)?.content.toLowerCase() ?? '';
      return chat.title.toLowerCase().includes(query) || lastMessage.includes(query);
    });
  }, [search, state.chats]);

  const handleCreateChat = () => {
    const id = createChat();
    setActiveChat(id);
    navigate(`/chat/${id}`);
  };

  const handleOpenChat = (chatId: string) => {
    setActiveChat(chatId);
    navigate(`/chat/${chatId}`);
  };

  const handleDeleteChat = (chatId: string) => {
    const confirmed = window.confirm('Удалить чат? Это действие нельзя отменить.');
    if (!confirmed) return;

    const wasActive = location.pathname === `/chat/${chatId}`;
    deleteChat(chatId);

    if (wasActive) {
      navigate('/');
    }
  };

  const startEditing = (chatId: string, currentTitle: string) => {
    setEditingId(chatId);
    setDraftTitle(currentTitle);
  };

  const submitRename = (chatId: string) => {
    renameChat(chatId, draftTitle);
    setEditingId(null);
    setDraftTitle('');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__header">
        <button className="primary-button" onClick={handleCreateChat}>Новый чат</button>
        <input
          className="search-input"
          type="text"
          placeholder="Поиск по чатам"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="sidebar__list">
        {filteredChats.length === 0 ? (
          <p className="sidebar__empty">Чаты не найдены</p>
        ) : (
          filteredChats.map((chat) => {
            const isActive = location.pathname === `/chat/${chat.id}`;
            const lastMessage = chat.messages.at(-1)?.content ?? 'Сообщений пока нет';

            return (
              <div key={chat.id} className={`sidebar__item ${isActive ? 'active' : ''}`}>
                <button className="sidebar__open" onClick={() => handleOpenChat(chat.id)}>
                  {editingId === chat.id ? (
                    <input
                      autoFocus
                      className="edit-input"
                      value={draftTitle}
                      onChange={(e) => setDraftTitle(e.target.value)}
                      onBlur={() => submitRename(chat.id)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') submitRename(chat.id);
                        if (e.key === 'Escape') {
                          setEditingId(null);
                          setDraftTitle('');
                        }
                      }}
                    />
                  ) : (
                    <>
                      <div className="sidebar__title">{chat.title}</div>
                      <div className="sidebar__preview">{lastMessage}</div>
                    </>
                  )}
                </button>

                <div className="sidebar__actions">
                  <button type="button" onClick={() => startEditing(chat.id, chat.title)} title="Переименовать">
                    ✏️
                  </button>
                  <button type="button" onClick={() => handleDeleteChat(chat.id)} title="Удалить">
                    🗑
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
