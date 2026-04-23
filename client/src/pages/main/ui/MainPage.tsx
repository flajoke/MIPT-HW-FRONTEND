import { useEffect, useState } from 'react';
import { fetchModels } from '@/shared/lib/api';
import { selectActiveChat, selectFilteredChats, useChatStore } from '@/entities/chat/model/chatStore';
import { Sidebar } from '@/widgets/sidebar/ui/Sidebar';
import { ChatWindow } from '@/widgets/chat-window/ui/ChatWindow';
import { Composer } from '@/widgets/composer/ui/Composer';
import { ChatSettingsPanel } from '@/features/chat-settings/ui/ChatSettingsPanel';
import { useSendMessage } from '@/features/send-message/model/useSendMessage';

export const MainPage = () => {
  const activeChat = useChatStore(selectActiveChat);
  const chats = useChatStore(selectFilteredChats);
  const activeChatId = useChatStore((state) => state.activeChatId);
  const searchQuery = useChatStore((state) => state.searchQuery);
  const setSearchQuery = useChatStore((state) => state.setSearchQuery);
  const createChat = useChatStore((state) => state.createChat);
  const setActiveChat = useChatStore((state) => state.setActiveChat);
  const renameChat = useChatStore((state) => state.renameChat);
  const deleteChat = useChatStore((state) => state.deleteChat);
  const updateSettings = useChatStore((state) => state.updateSettings);
  const availableModels = useChatStore((state) => state.availableModels);
  const setAvailableModels = useChatStore((state) => state.setAvailableModels);
  const [modelsError, setModelsError] = useState('');

  const { send, stop, isGenerating } = useSendMessage();

  useEffect(() => {
    void fetchModels()
      .then((models) => {
        setAvailableModels(models.map((model) => model.id));
        setModelsError('');
      })
      .catch((error) => {
        setModelsError(error instanceof Error ? error.message : 'Не удалось загрузить модели');
      });
  }, [setAvailableModels]);

  return (
    <main className="grid h-screen grid-cols-1 gap-4 p-4 xl:grid-cols-[340px_1fr]">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateChat={createChat}
        onSelectChat={setActiveChat}
        onRenameChat={(chatId) => {
          const title = window.prompt('Новое название чата');
          if (title !== null) renameChat(chatId, title);
        }}
        onDeleteChat={(chatId) => {
          const confirmed = window.confirm('Удалить чат? Это действие необратимо.');
          if (confirmed) deleteChat(chatId);
        }}
      />

      <section className="grid min-h-0 gap-4 xl:grid-rows-[auto_1fr_auto]">
        <div className="grid gap-3">
          <div className="rounded-[2rem] border border-white/10 bg-slate-950/40 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-semibold text-white">{activeChat.title}</h2>
                <p className="text-sm text-slate-400">
                  Модели: {availableModels.join(', ')}
                </p>
              </div>
              {modelsError ? <span className="text-sm text-amber-300">{modelsError}</span> : null}
            </div>
          </div>

          <ChatSettingsPanel
            settings={activeChat.settings}
            models={availableModels}
            onChange={(patch) => updateSettings(activeChat.id, patch)}
          />
        </div>

        <ChatWindow chat={activeChat} isGenerating={isGenerating} />

        <Composer isGenerating={isGenerating} onSend={send} onStop={stop} />
      </section>
    </main>
  );
};
