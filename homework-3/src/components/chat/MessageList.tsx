import type { MessageData } from '../../App'
import EmptyState from './EmptyState'
import Message from './Message'
import TypingIndicator from './TypingIndicator'

interface MessageListProps {
  messages: MessageData[]
  typingVisible?: boolean
}

function MessageList({ messages, typingVisible = false }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="message-list">
        <EmptyState />
      </div>
    )
  }

  return (
    <div className="message-list">
      {messages.map((message) => (
        <Message
          key={message.id}
          author={message.author}
          content={message.content}
          variant={message.role}
        />
      ))}

      <TypingIndicator isVisible={typingVisible} />
    </div>
  )
}

export default MessageList
