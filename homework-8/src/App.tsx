import { useMemo, useReducer } from 'react';
import { InputArea } from './components/chat/InputArea';
import { Message } from './components/chat/Message';
import { Sidebar } from './components/sidebar/Sidebar';
import { chatReducer, createInitialState } from './store/chatReducer';
import { saveChatState } from './utils/storage';

export default function App() {
  const [state, dispatch] = useReducer(chatReducer, undefined, createInitialState);

  const activeChat = useMemo(
    () => state.chats.find((chat) => chat.id === state.activeChatId) ?? null,
    [state.activeChatId, state.chats]
  );

  const persist = (nextState = state) => saveChatState(nextState);

  const handleCreateChat = () => {
    const nextAction = {
      type: 'CREATE_CHAT',
      payload: { id: crypto.randomUUID(), title: `Чат ${state.chats.length + 1}` }
    } as const;
    const nextState = chatReducer(state, nextAction);
    dispatch(nextAction);
    persist(nextState);
  };

  const handleDeleteChat = (chatId: string) => {
    const nextAction = { type: 'DELETE_CHAT', payload: chatId } as const;
    const nextState = chatReducer(state, nextAction);
    dispatch(nextAction);
    persist(nextState);
  };

  const handleSelectChat = (chatId: string) => {
    dispatch({ type: 'SET_ACTIVE_CHAT', payload: chatId });
  };

  const handleSend = (text: string) => {
    if (!state.activeChatId) return;

    const nextAction = {
      type: 'ADD_MESSAGE',
      payload: {
        chatId: state.activeChatId,
        message: {
          id: crypto.randomUUID(),
          text,
          variant: 'user' as const
        }
      }
    } as const;

    const nextState = chatReducer(state, nextAction);
    dispatch(nextAction);
    persist(nextState);
  };

  return (
    <div className="app-shell">
      <Sidebar
        chats={state.chats}
        activeChatId={state.activeChatId}
        onCreateChat={handleCreateChat}
        onDeleteChat={handleDeleteChat}
        onSelectChat={handleSelectChat}
      />

      <main className="chat-layout">
        <h1>Домашнее задание 8</h1>
        <div className="messages-list">
          {activeChat?.messages.map((message) => (
            <Message key={message.id} text={message.text} variant={message.variant} />
          ))}
        </div>

        <InputArea onSend={handleSend} />
      </main>
    </div>
  );
}
