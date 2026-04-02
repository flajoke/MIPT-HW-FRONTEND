import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useChat } from '../app/providers/ChatProvider';
import { ChatWindow } from '../components/chat/ChatWindow';

export function ChatPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, setActiveChat } = useChat();

  useEffect(() => {
    if (!id) return;

    const exists = state.chats.some((chat) => chat.id === id);
    if (!exists) {
      navigate('/', { replace: true });
      return;
    }

    setActiveChat(id);
  }, [id, navigate, setActiveChat, state.chats]);

  return <ChatWindow />;
}
