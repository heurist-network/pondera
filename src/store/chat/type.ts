import { Message as AIMessage } from "ai/react";

export type ChatModel = {
  type: string;
  name: string;
};

export enum LOADING_STATE {
  NONE,
  CONNECTING,
  RESPONDING,
}

// 0 没有 loading
// 1 正在请求
// 2 正在响应中

export type Message = {
  id: string;
  role: AIMessage["role"];
  time: string;
  content: string;
};

export type ChatListItem = {
  chat_id: string;
  chat_name: string;
  chat_model: ChatModel;
  chat_prompt: string;
  chat_state: LOADING_STATE;
  chat_context_length: number;
  chat_list: Message[];
};

export type ChatStore = {
  activeId: string;
  list: ChatListItem[];
  abort: {};

  toggleChatActive: (chat_id: string) => void;
  addChat: () => void;
  deleteChat: (chat_id: string) => void;
  clearChat: () => void;
  updateChatName: (chat_id: string, chat_name: string) => void;
  addMessage: ({
    chat_id,
    message,
    role,
  }: {
    chat_id: string;
    message: string;
    role: Message["role"];
  }) => void;
  deleteMessage: ({
    chat_id,
    message_id,
  }: {
    chat_id: string;
    message_id: string;
  }) => void;
  updateMessage: ({
    chat_id,
    message_id,
    content,
  }: {
    chat_id: string;
    message_id: string;
    content: string;
  }) => void;

  // Chat Action
  sendChat: ({ chat_id }: { chat_id: string }) => void;
  generateChatName: ({
    chat_id,
    messages,
  }: {
    chat_id: string;
    messages: { role: Message["role"]; content: string }[];
  }) => void;

  // Hydration
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
};
