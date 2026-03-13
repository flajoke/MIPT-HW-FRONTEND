import type { ChatItemData } from '../../App'
import ChatItem from './ChatItem'

interface ChatListProps {
  chats: ChatItemData[]
}

function ChatList({ chats }: ChatListProps) {
  return (
    <div className="chat-list">
      {chats.map((chat) => (
        <ChatItem key={chat.id} title={chat.title} date={chat.date} active={chat.active} />
      ))}
    </div>
  )
}

export default ChatList
