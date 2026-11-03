import { Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { formatDateTime } from '@/shared/lib/date';
import type { ChatItem } from '@/shared/types/chat';

interface Props {
  chats: ChatItem[];
  activeChatId: string;
  onSelect: (chatId: string) => void;
  onRename: (chatId: string) => void;
  onDelete: (chatId: string) => void;
}

export const ChatList = ({ chats, activeChatId, onSelect, onRename, onDelete }: Props) => (
  <div className="custom-scrollbar flex flex-1 flex-col gap-2 overflow-y-auto pr-1">
    {chats.map((chat) => (
      <button
        key={chat.id}
        type="button"
        onClick={() => onSelect(chat.id)}
        className={cn(
          'group rounded-3xl border px-4 py-3 text-left transition',
          activeChatId === chat.id
            ? 'border-blue-400/50 bg-blue-500/10'
            : 'border-white/10 bg-white/5 hover:bg-white/10',
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="truncate font-medium text-slate-100">{chat.title}</div>
            <div className="mt-1 text-xs text-slate-400">{formatDateTime(chat.updatedAt)}</div>
          </div>
          <div className="flex shrink-0 items-center gap-1 opacity-0 transition group-hover:opacity-100">
            <button
              type="button"
              className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white"
              onClick={(event) => {
                event.stopPropagation();
                onRename(chat.id);
              }}
              aria-label="Переименовать чат"
            >
              <Pencil className="size-4" />
            </button>
            <button
              type="button"
              className="rounded-xl p-2 text-slate-400 hover:bg-red-500/10 hover:text-red-300"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(chat.id);
              }}
              aria-label="Удалить чат"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        </div>
      </button>
    ))}
  </div>
);
