import type { Chat } from '../types/chat';

const MAX_TITLE_LENGTH = 38;

export function buildChatTitle(firstMessage: string, chats: Chat[]): string {
  const normalized = firstMessage.replace(/\s+/g, ' ').trim();

  if (normalized.length >= 3) {
    return normalized.length > MAX_TITLE_LENGTH
      ? `${normalized.slice(0, MAX_TITLE_LENGTH).trim()}...`
      : normalized;
  }

  const base = 'Новый чат';
  const sameBaseCount = chats.filter((chat) => chat.title.startsWith(base) || chat.title.startsWith('Диалог ')).length;

  return sameBaseCount === 0 ? base : `Диалог ${sameBaseCount + 1}`;
}
