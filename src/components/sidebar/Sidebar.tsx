import type { ChatItemData } from '../../App'
import ChatList from './ChatList'
import SearchInput from './SearchInput'

interface SidebarProps {
  chats: ChatItemData[]
  onCloseMobile?: () => void
}

function Sidebar({ chats, onCloseMobile }: SidebarProps) {
  return (
    <aside className="sidebar">
      <div className="sidebar__top">
        <div className="sidebar__header">
          <button className="primary-button" type="button">
            <span>+</span>
            <span>Новый чат</span>
          </button>

          <button className="icon-button mobile-only" type="button" onClick={onCloseMobile}>
            ✕
          </button>
        </div>

        <SearchInput placeholder="Поиск по чатам" />
      </div>

      <ChatList chats={chats} />
    </aside>
  )
}

export default Sidebar
