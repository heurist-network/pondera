/* eslint-disable @typescript-eslint/no-explicit-any */
import { nanoid } from 'nanoid'
import { toast } from 'sonner'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { GENERATE_CHAT_NAME_PROMPT } from '@/lib/constant'
import { clone } from '@/lib/utils'
import { api } from '@/lib/workspaceApi'
import { fetchEventSource } from '@fortaine/fetch-event-source'

export type ChatRole = 'user' | 'assistant' | 'system'

export type ChatModel = {
  name: string
  icon: string
  system_prompt?: string
}

export enum CHAT_STATE {
  NONE, // Not loading
  CONNECTING, // Requesting to server
  RESPONDING, // Responding from server
}

export type ChatItem = {
  id: string
  role: ChatRole
  content: string
  model: string
  isEdit: boolean
  createdAt: number | null
  updatedAt: number | null
}

export interface ChatListItem {
  id: string
  title: string
  model: string
  prompt: string
  chainOfThought: boolean
  hasDocument: boolean
  namespaceId?: string
  list: ChatItem[]
  state: CHAT_STATE
  createdAt: number | null
  updatedAt: number | null
}

export type ChatStore = {
  activeId: string
  list: ChatListItem[]
  abort: Record<string, AbortController>

  getActiveChat: (id: string) => ChatListItem | undefined
  getActiveList: (id: string) => ChatItem[]

  // Chat Handlers
  addChat: () => void
  toggleChat: (id: string) => void
  deleteChat: (id: string) => void
  updateChat: (id: string, payload: ChatUpdatePayload) => void
  clearChat: () => void

  // Chat Actions
  sendChat: (id: string, model: string, callback?: () => void) => void
  cancelChat: (id: string) => void
  regenerateChat: (id: string, message_id: string) => void
  generateTitle: (id: string) => void
  addFilesUploadedMessage: (id: string) => void

  // Message Handlers
  addMessage: ({
    id,
    role,
    content,
    model,
  }: {
    id: string
    role: ChatRole
    content: string
    model: string
  }) => void
  clearMessage: (id: string) => void
  updateMessage: ({
    chat_id,
    message_id,
    isEdit,
    content,
    model,
  }: {
    chat_id: string
    message_id: string
    isEdit?: boolean
    content?: string
    model?: string
  }) => void

  // Model
  models: ChatModel[]
  setModels: (models: ChatModel[]) => void

  // Hydration
  _hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}

export const initChatItem: ChatListItem = {
  id: nanoid(),
  title: '',
  model: 'meta-llama/llama-3.3-70b-instruct',
  prompt: 'You are a helpful AI assistant.',
  chainOfThought: false,
  hasDocument: false,
  list: [],
  state: CHAT_STATE.NONE,
  createdAt: Date.now(),
  updatedAt: Date.now(),
}

type ChatUpdatePayload = Partial<{
  title: string
  model: string
  prompt: string
  chainOfThought: boolean
  hasDocument: boolean
  namespaceId: string
}>

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      activeId: initChatItem.id,
      list: [initChatItem],
      abort: {},

      getActiveChat: (id) => {
        const { list } = get()
        return list.find((item) => item.id === id)
      },
      getActiveList: (id) => {
        const { list } = get()
        return list.find((item) => item.id === id)?.list || []
      },

      // Chat Handlers
      addChat: () => {
        const localPrompt = localStorage.getItem('custom_prompt')

        const { list } = get()
        const id = nanoid()

        const chatItem = clone(initChatItem)

        if (localPrompt) {
          chatItem.prompt = localPrompt
        }

        const newChat = {
          ...chatItem,
          id,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
        set({ list: [...list, newChat], activeId: id })
      },
      toggleChat: (id) => {
        set({ activeId: id })
      },
      deleteChat: (id) => {
        const { list, activeId } = get()
        const chat = list.find((item) => item.id === id)

        if (chat?.hasDocument && chat?.namespaceId) {
          api.deleteWorkspace(chat.namespaceId).catch((error) => {
            console.error('Failed to delete workspace:', error)
          })
        }

        const newList = list.filter((item) => item.id !== id)

        if (newList.length <= 1) {
          const localPrompt = localStorage.getItem('custom_prompt')

          const chatItem = clone(initChatItem)
          if (localPrompt) {
            chatItem.prompt = localPrompt
          }

          set({ activeId: initChatItem.id, list: [chatItem] })
        } else if (activeId === id) {
          const find = clone(newList).sort(
            (x, y) => y.updatedAt! - x.updatedAt!,
          )[0]
          set({ activeId: find.id, list: newList })
        } else {
          set({ list: newList })
        }
      },
      updateChat: (id: string, payload: ChatUpdatePayload) => {
        set((state) => {
          const chat = state.list.find((chat) => chat.id === id)
          if (!chat) return state

          const localPrompt = localStorage.getItem('custom_prompt')
          const newPayload = { ...payload }

          // Handle prompt updates
          if (localPrompt) {
            newPayload.prompt = localPrompt
          } else if (payload.prompt !== undefined) {
            newPayload.prompt =
              payload.prompt || 'You are a helpful AI assistant.'
          }

          // Handle chain of thought prompt
          if (payload.chainOfThought) {
            newPayload.prompt = `${newPayload.prompt || chat.prompt}

For EVERY response, you must structure your thinking and answer using these tags:

<thinking>
Demonstrate thorough reasoning by:
- Breaking down the problem into components
- Analyzing from multiple angles
- Challenging your assumptions
- Showing authentic curiosity
- Considering edge cases and potential issues
- Developing your understanding progressively
- Verifying your logic and conclusions

Use natural, flowing thoughts - no rigid structure.
</thinking>

<answer>
Provide your final response here:
- Clear and concise
- Directly addresses the question/task
- Implements insights from thinking process
- Uses appropriate formatting (code blocks, lists, etc.)
- Includes examples or references if relevant
- Highlights key points or takeaways
</answer>

CRITICAL: NEVER skip the thinking process. ALWAYS use these tags.`
          }

          return {
            list: state.list.map((chat) =>
              chat.id === id
                ? {
                    ...chat,
                    ...newPayload,
                    updatedAt: Date.now(),
                  }
                : chat,
            ),
          }
        })
      },
      clearChat: () => {
        const localPrompt = localStorage.getItem('custom_prompt')

        const chatItem = clone(initChatItem)
        if (localPrompt) {
          chatItem.prompt = localPrompt
        }

        set({ activeId: initChatItem.id, list: [chatItem] })
      },

      // Chat Actions
      sendChat: (id, model, callback) => {
        const { list } = get()
        const item = list.find((item) => item.id === id)
        if (
          !item ||
          item.state === CHAT_STATE.CONNECTING ||
          item.state === CHAT_STATE.RESPONDING
        )
          return

        item.state = CHAT_STATE.CONNECTING
        set({ list: [...list] })

        const controller = new AbortController()

        get().abort[id] = controller

        const activeChat = get().getActiveChat(id)

        const messages = item.list
          .filter((item) => item.role !== 'system')
          .slice(-8)
          .map((item) => ({
            role: item.role,
            content: item.content,
          }))

        fetchEventSource('/api/chat', {
          method: 'POST',
          signal: controller.signal,
          openWhenHidden: true,
          body: JSON.stringify({
            messages: [
              {
                role: 'system',
                content:
                  activeChat?.prompt || 'You are a helpful AI assistant.',
              },
              ...messages,
            ],
            modelId: item.model,
            stream: true,
            hasDocument: item.hasDocument,
            namespaceId: item.namespaceId,
          }),
          onopen: async (res) => {
            if (!res.ok || res.status !== 200 || !res.body) {
              item.state = CHAT_STATE.NONE
              set({ list: [...list] })

              if (res.status === 429) {
                toast.error('Too Many Requests')
              } else {
                const errRes = await res.json()
                toast.error(errRes.msg || 'Error')
              }
            }
          },
          onmessage: (res) => {
            callback?.()
            try {
              // skip [DONE] messages
              if (res.data === '[DONE]') {
                item.state = CHAT_STATE.NONE
                set({ list: [...list] })
                if (!item.title && item.list.length > 0) {
                  // generate title only when response is complete
                  get().generateTitle(id)
                }
                return
              }

              const data = JSON.parse(res.data).choices[0]
              const content = data.delta.content
              if (!content) return

              item.state = CHAT_STATE.RESPONDING
              set({ list: [...list] })

              const lastItem = item.list.at(-1)

              if (!lastItem) return

              if (lastItem.role === 'user') {
                item.list.push({
                  id: nanoid(),
                  role: 'assistant',
                  content,
                  model,
                  isEdit: false,
                  createdAt: Date.now(),
                  updatedAt: Date.now(),
                })
              } else {
                lastItem.content += content
              }

              set({ list: [...list] })
            } catch {}
          },
          onerror: () => {
            item.state = CHAT_STATE.NONE
            set({ list: [...list] })
          },
          onclose: () => {
            item.state = CHAT_STATE.NONE
            set({ list: [...list] })
          },
        })
      },
      cancelChat: (id) => {
        const { abort, list } = get()
        abort[id]?.abort()
        delete abort[id]

        const item = list.find((item) => item.id === id)
        if (item) {
          item.state = CHAT_STATE.NONE
          set({ list: [...list] })
        }
      },
      regenerateChat: (id, message_id) => {
        const { list } = get()
        const item = list.find((item) => item.id === id)
        if (!item) return

        const message = item.list.find((item) => item.id === message_id)
        const messageIndex = item.list.findIndex(
          (item) => item.id === message_id,
        )

        if (!message) return

        let array: ChatItem[] = []

        if (message.role === 'user') {
          array = item.list.slice(0, messageIndex + 1)
        } else {
          array = item.list.slice(0, messageIndex)
        }

        item.list = array
        set({ list: [...list] })
      },
      generateTitle: (id) => {
        const { list } = get()
        const item = list.find((item) => item.id === id)
        if (!item || item.title) return

        const messages = item.list.slice(-8).map((item) => ({
          role: item.role,
          content: item.content,
        }))

        fetchEventSource('/api/chat', {
          method: 'POST',
          openWhenHidden: true,
          body: JSON.stringify({
            messages: [
              ...messages,
              { role: 'user', content: GENERATE_CHAT_NAME_PROMPT },
            ],
            modelId: item.model,
            stream: true,
          }),
          onopen: async () => {},
          onmessage: (res) => {
            try {
              if (res.data === '[DONE]') return

              const data = JSON.parse(res.data).choices[0]
              const content = data.delta.content
              if (!content) return

              item.title += content
              set({ list: [...list] })
            } catch {}
          },
          onerror: () => {},
          onclose: () => {},
        })
      },
      addFilesUploadedMessage: (id) => {
        const { list } = get()
        const newList = list.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              list: [
                {
                  id: `message-${nanoid()}`,
                  role: 'system' as ChatRole,
                  content:
                    'Files have been uploaded. You can now ask questions about their content.',
                  model: item.model,
                  isEdit: false,
                  createdAt: Date.now(),
                  updatedAt: Date.now(),
                },
                ...item.list,
              ],
              updatedAt: Date.now(),
            }
          }
          return item
        })
        set({ list: newList })
      },

      // Message Handlers
      addMessage: ({ id, role, content, model }) => {
        const { list } = get()
        const newList = list.map((item) => {
          if (item.id === id) {
            return {
              ...item,
              list: [
                ...item.list,
                {
                  id: `message-${nanoid()}`,
                  role,
                  content,
                  model,
                  isEdit: false,
                  createdAt: Date.now(),
                  updatedAt: Date.now(),
                },
              ],
              updatedAt: Date.now(),
            }
          }
          return item
        })
        set({ list: newList })
      },
      clearMessage: (id) => {
        const { list } = get()
        const newList = list.map((item) => {
          if (item.id === id) {
            return { ...item, list: [] }
          }
          return item
        })
        set({ list: newList })
      },
      updateMessage: ({ chat_id, message_id, isEdit, content, model }) => {
        const { list } = get()

        const findChat = list.find((item) => item.id === chat_id)
        if (!findChat) return

        const findMessage = findChat.list.find((item) => item.id === message_id)
        if (!findMessage) return

        if (isEdit !== undefined) {
          findMessage.isEdit = isEdit
        }

        if (content !== undefined) {
          findMessage.content = content
        }

        if (model !== undefined) {
          findMessage.model = model
        }

        set({ list: [...list] })
      },

      // Model
      models: [],
      setModels: (models) => set({ models }),

      // Hydration
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'pondera-chat-list',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)

        // get llm models
        fetch(
          'https://raw.githubusercontent.com/heurist-network/heurist-models/main/models.json',
          { next: { revalidate: 3600 } },
        )
          .then((res) => res.json())
          .then((res) => {
            const arr = res.filter((res: any) => res.type?.includes('llm'))
            state?.setModels(
              arr.map((item: any) => {
                let icon = ''
                if (
                  item.name.startsWith('mistralai') ||
                  item.name.startsWith('openhermes')
                ) {
                  icon = '/model/mistral.svg'
                }
                if (item.name.includes('llama')) {
                  icon = '/model/llama.jpeg'
                }
                if (item.name.includes('-yi-')) {
                  icon = '/model/yi.svg'
                }
                if (item.name.startsWith('qwen')) {
                  icon = '/model/qwen.svg'
                }

                return { ...item, icon }
              }),
            )
          })
      },
      merge: (persistedState: any, currentState) => {
        // reset chat store
        if (persistedState) {
          persistedState.list.forEach((item: any) => {
            item.state = CHAT_STATE.NONE
            item.list.forEach((item: any) => {
              item.isEdit = false
            })
          })
        }
        return Object.assign({}, currentState, persistedState)
      },
    },
  ),
)
