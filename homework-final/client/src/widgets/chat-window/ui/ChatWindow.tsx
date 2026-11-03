import { useEffect, useRef } from 'react';
import { MessageBubble } from '@/widgets/chat-window/ui/MessageBubble';
import type { ChatItem } from '@/shared/types/chat';

interface Props {
  chat: ChatItem;
  isGenerating: boolean;
}

export const ChatWindow = ({ chat, isGenerating }: Props) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [chat.messages, isGenerating]);

  if (!chat.messages.length) {
    return (
      <div className="flex flex-1 items-center justify-center rounded-[2rem] border border-dashed border-white/10 bg-white/5 p-10 text-center text-slate-400">
        <div>
          <h2 className="mb-3 text-2xl font-semibold text-slate-100">GigaChat UI</h2>
          <p className="mx-auto max-w-xl">
            Начни новый диалог, прикрепи картинку или документ, настрой параметры генерации и получай ответы в потоковом режиме.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="custom-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto rounded-[2rem] border border-white/10 bg-slate-950/30 p-4 md:p-6">
      {chat.messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
};
