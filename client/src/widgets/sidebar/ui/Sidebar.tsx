import { MessageSquarePlus } from 'lucide-react';
import { ChatList } from '@/features/chat-list/ui/ChatList';
import { ChatSearch } from '@/features/chat-search/ui/ChatSearch';
import { Button } from '@/shared/ui/Button';
import type { ChatItem } from '@/shared/types/chat';

interface Props {
  chats: ChatItem[];
  activeChatId: string;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onCreateChat: () => void;
  onSelectChat: (chatId: string) => void;
  onRenameChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
}

export const Sidebar = ({
  chats,
  activeChatId,
  searchQuery,
  onSearchChange,
  onCreateChat,
  onSelectChat,
  onRenameChat,
  onDeleteChat,
}: Props) => (
  <aside className="flex h-full w-full max-w-sm flex-col gap-4 rounded-[2rem] border border-white/10 bg-slate-950/40 p-4 backdrop-blur">
    <div className="flex items-center justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold text-white">Chats</h1>
        <p className="text-sm text-slate-400">История хранится локально</p>
      </div>
      <Button type="button" variant="primary" onClick={onCreateChat}>
        <MessageSquarePlus className="size-4" /> Новый
      </Button>
    </div>

    <ChatSearch value={searchQuery} onChange={onSearchChange} />

    <ChatList chats={chats} activeChatId={activeChatId} onSelect={onSelectChat} onRename={onRenameChat} onDelete={onDeleteChat} />
  </aside>
);
