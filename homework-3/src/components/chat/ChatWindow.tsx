import type { MessageData } from '../../App'
import InputArea from './InputArea'
import MessageList from './MessageList'

interface ChatWindowProps {
  title: string
  messages: MessageData[]
  typingVisible?: boolean
  onOpenSettings: () => void
}

function ChatWindow({ title, messages, typingVisible = false, onOpenSettings }: ChatWindowProps) {
  return (
    <main className="chat-window">
      <header className="chat-window__header">
        <h1>{title}</h1>
        <button className="icon-button" type="button" onClick={onOpenSettings} aria-label="Настройки">
          ⚙
        </button>
      </header>

      <MessageList messages={messages} typingVisible={typingVisible} />
      <InputArea />
    </main>
  )
}

export default ChatWindow
