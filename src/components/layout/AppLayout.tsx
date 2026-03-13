import { useState } from 'react'
import type { ChatItemData, MessageData, ModelOption, ThemeMode } from '../../App'
import Sidebar from '../sidebar/Sidebar'
import ChatWindow from '../chat/ChatWindow'
import SettingsPanel from '../settings/SettingsPanel'

interface AppLayoutProps {
  chats: ChatItemData[]
  currentChatTitle: string
  messages: MessageData[]
  typingVisible?: boolean
  settingsOpen: boolean
  onOpenSettings: () => void
  onCloseSettings: () => void
  settings: {
    model: ModelOption
    temperature: number
    topP: number
    maxTokens: number
    systemPrompt: string
  }
  onSaveSettings: (settings: {
    model: ModelOption
    temperature: number
    topP: number
    maxTokens: number
    systemPrompt: string
  }) => void
  onResetSettings: () => void
  theme: ThemeMode
  onToggleTheme: () => void
}

function AppLayout(props: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="layout">
      <button className="burger-button" type="button" onClick={() => setSidebarOpen(true)}>
        ☰
      </button>

      <div className={`sidebar-wrapper ${sidebarOpen ? 'sidebar-wrapper--open' : ''}`}>
        <Sidebar chats={props.chats} onCloseMobile={() => setSidebarOpen(false)} />
      </div>

      {sidebarOpen && <button className="sidebar-overlay" type="button" onClick={() => setSidebarOpen(false)} />}

      <ChatWindow
        title={props.currentChatTitle}
        messages={props.messages}
        typingVisible={props.typingVisible}
        onOpenSettings={props.onOpenSettings}
      />

      <SettingsPanel
        isOpen={props.settingsOpen}
        onClose={props.onCloseSettings}
        settings={props.settings}
        onSave={props.onSaveSettings}
        onReset={props.onResetSettings}
        theme={props.theme}
        onToggleTheme={props.onToggleTheme}
      />
    </div>
  )
}

export default AppLayout
