import { chatReducer, defaultState } from './chatReducer';
import { ChatState } from '../types';

describe('chatReducer', () => {
  const baseState: ChatState = {
    chats: [
      {
        id: 'chat-1',
        title: 'Первый чат',
        messages: [{ id: 'm-1', text: 'Старт', variant: 'assistant' }]
      },
      {
        id: 'chat-2',
        title: 'Второй чат',
        messages: []
      }
    ],
    activeChatId: 'chat-1'
  };

  it('ADD_MESSAGE добавляет сообщение в конец массива', () => {
    const nextState = chatReducer(baseState, {
      type: 'ADD_MESSAGE',
      payload: {
        chatId: 'chat-1',
        message: { id: 'm-2', text: 'Новое сообщение', variant: 'user' }
      }
    });

    expect(nextState.chats[0].messages).toHaveLength(2);
    expect(nextState.chats[0].messages.at(-1)).toEqual({
      id: 'm-2',
      text: 'Новое сообщение',
      variant: 'user'
    });
  });

  it('CREATE_CHAT создаёт новый чат с уникальным id', () => {
    const randomUUIDSpy = vi.spyOn(crypto, 'randomUUID').mockReturnValue('new-chat-id');

    const nextState = chatReducer(baseState, { type: 'CREATE_CHAT' });

    expect(nextState.chats).toHaveLength(3);
    expect(nextState.chats[2]).toMatchObject({
      id: 'new-chat-id',
      title: 'Чат 3',
      messages: []
    });
    expect(nextState.activeChatId).toBe('new-chat-id');

    randomUUIDSpy.mockRestore();
  });

  it('DELETE_CHAT удаляет чат и сбрасывает activeChatId при удалении активного', () => {
    const nextState = chatReducer(baseState, { type: 'DELETE_CHAT', payload: 'chat-1' });

    expect(nextState.chats).toHaveLength(1);
    expect(nextState.chats[0].id).toBe('chat-2');
    expect(nextState.activeChatId).toBeNull();
  });

  it('RENAME_CHAT обновляет название чата по id', () => {
    const nextState = chatReducer(baseState, {
      type: 'RENAME_CHAT',
      payload: { chatId: 'chat-2', title: 'Переименованный чат' }
    });

    expect(nextState.chats[1].title).toBe('Переименованный чат');
  });

  it('имеет корректное начальное состояние по умолчанию', () => {
    expect(defaultState.chats).toHaveLength(1);
    expect(defaultState.activeChatId).toBe('chat-1');
  });
});
