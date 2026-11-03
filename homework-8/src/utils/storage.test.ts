import { loadChatState, saveChatState, STORAGE_KEY } from './storage';
import { ChatState } from '../types';

describe('storage utils', () => {
  const state: ChatState = {
    chats: [
      {
        id: 'chat-1',
        title: 'Тестовый чат',
        messages: [{ id: 'm-1', text: 'Сообщение', variant: 'user' }]
      }
    ],
    activeChatId: 'chat-1'
  };

  beforeEach(() => {
    const storageMock = (() => {
      let store: Record<string, string> = {};

      return {
        getItem: vi.fn((key: string) => store[key] ?? null),
        setItem: vi.fn((key: string, value: string) => {
          store[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
          delete store[key];
        }),
        clear: vi.fn(() => {
          store = {};
        })
      };
    })();

    vi.stubGlobal('localStorage', storageMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('сохраняет данные в localStorage при изменении состояния', () => {
    saveChatState(state);

    expect(localStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify(state));
  });

  it('восстанавливает данные из localStorage при инициализации', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    expect(loadChatState()).toEqual(state);
  });

  it('не падает на битом JSON и возвращает null', () => {
    localStorage.setItem(STORAGE_KEY, '{broken-json');

    expect(loadChatState()).toBeNull();
  });

  it('возвращает null, если данных в localStorage нет', () => {
    expect(loadChatState()).toBeNull();
  });
});
