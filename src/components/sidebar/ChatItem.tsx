interface ChatItemProps {
  title: string
  date: string
  active?: boolean
}

function ChatItem({ title, date, active = false }: ChatItemProps) {
  return (
    <div className={`chat-item ${active ? 'chat-item--active' : ''}`} role="button" tabIndex={0}>
      <div className="chat-item__content">
        <span className="chat-item__title">{title}</span>
        <span className="chat-item__date">{date}</span>
      </div>

      <div className="chat-item__actions">
        <button className="icon-button" type="button" aria-label="Редактировать">
          ✎
        </button>
        <button className="icon-button" type="button" aria-label="Удалить">
          🗑
        </button>
      </div>
    </div>
  )
}

export default ChatItem
