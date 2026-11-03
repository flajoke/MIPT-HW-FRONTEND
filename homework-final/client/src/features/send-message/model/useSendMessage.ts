import { useEffect, useRef } from 'react';
import { selectActiveChat, useChatStore } from '@/entities/chat/model/chatStore';
import { streamChatCompletion } from '@/shared/lib/api';
import type { LocalAttachment } from '@/shared/types/chat';

export const useSendMessage = () => {
  const activeChat = useChatStore(selectActiveChat);
  const addUserMessage = useChatStore((state) => state.addUserMessage);
  const startAssistantMessage = useChatStore((state) => state.startAssistantMessage);
  const appendToAssistantMessage = useChatStore((state) => state.appendToAssistantMessage);
  const finalizeAssistantMessage = useChatStore((state) => state.finalizeAssistantMessage);
  const failAssistantMessage = useChatStore((state) => state.failAssistantMessage);
  const setGenerating = useChatStore((state) => state.setGenerating);
  const isGenerating = useChatStore((state) => state.isGenerating);

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortControllerRef.current?.abort(), []);

  const stop = () => {
    abortControllerRef.current?.abort();
    setGenerating(false);
  };

  const send = async (content: string, attachments: LocalAttachment[]) => {
    const text = content.trim();
    if (!text && attachments.length === 0) return;

    const controller = new AbortController();
    abortControllerRef.current = controller;

    addUserMessage(activeChat.id, text, attachments);
    const assistantMessageId = startAssistantMessage(activeChat.id);
    setGenerating(true);

    try {
      const messages = [
        ...(activeChat.settings.systemPrompt
          ? [{ role: 'system' as const, content: activeChat.settings.systemPrompt }]
          : []),
        ...activeChat.messages.map((message) => ({ role: message.role, content: message.content })),
        { role: 'user' as const, content: text || 'Опиши приложенные файлы' },
      ];

      await streamChatCompletion(
        {
          messages,
          settings: activeChat.settings,
          attachments,
        },
        {
          onDelta: (delta) => appendToAssistantMessage(activeChat.id, assistantMessageId, delta),
          onDone: () => finalizeAssistantMessage(activeChat.id, assistantMessageId),
          onError: (message) => failAssistantMessage(activeChat.id, assistantMessageId, message),
        },
        controller.signal,
      );
    } catch (error) {
      if (controller.signal.aborted) {
        finalizeAssistantMessage(activeChat.id, assistantMessageId);
      } else {
        failAssistantMessage(
          activeChat.id,
          assistantMessageId,
          error instanceof Error ? error.message : 'Неизвестная ошибка',
        );
      }
    } finally {
      abortControllerRef.current = null;
      setGenerating(false);
    }
  };

  return {
    send,
    stop,
    isGenerating,
  };
};
