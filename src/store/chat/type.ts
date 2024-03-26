import { Message as AIMessage } from 'ai/react'

export enum LOADING_STATE {
  NONE, // Not loading
  CONNECTING, // Requesting to server
  RESPONDING, // Responding from server
}

export type Message = {
  id: string
  role: AIMessage['role']
  time: string
  content: string
}

export type ChatListItem = {
  chat_id: string
  chat_name: string
  chat_model: string
  chat_prompt: string
  chat_state: LOADING_STATE
  chat_context_length: number
  chat_list: Message[]
}

export type ChatStore = {
  activeId: string
  list: ChatListItem[]
  abort: Record<string, AbortController>
  recentModel: string

  toggleChatActive: (chat_id: string) => void
  addChat: () => void
  deleteChat: (chat_id: string) => void
  clearChat: () => void
  regenerateChat: ({
    chat_id,
    message_id,
  }: {
    chat_id: string
    message_id: string
  }) => void
  updateChatName: (chat_id: string, chat_name: string) => void
  updateChatModel: (chat_id: string, chat_model: string) => void
  addMessage: ({
    chat_id,
    message,
    role,
  }: {
    chat_id: string
    message: string
    role: Message['role']
  }) => void
  deleteMessage: ({
    chat_id,
    message_id,
  }: {
    chat_id: string
    message_id: string
  }) => void
  updateMessage: ({
    chat_id,
    message_id,
    content,
  }: {
    chat_id: string
    message_id: string
    content: string
  }) => void
  clearMessage: (chat_id: string) => void

  // Chat Action
  sendChat: ({ chat_id }: { chat_id: string }) => void
  generateChatName: ({
    chat_id,
    messages,
  }: {
    chat_id: string
    messages: { role: Message['role']; content: string }[]
  }) => void
  cancelChat: (chat_id: string) => void

  // Other
  updateRecentModel: (model: string) => void

  // Hydration
  _hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}
