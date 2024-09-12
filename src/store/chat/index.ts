import { nanoid } from 'nanoid'
import { toast } from 'sonner'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { GENERATE_CHAT_NAME_PROMPT } from '@/lib/constant'
import { clone } from '@/lib/utils'
import { fetchEventSource } from '@fortaine/fetch-event-source'

export type ChatRole = 'user' | 'assistant' | 'system'

export type ChatModel = {
  name: string
  icon: string
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
  createdAt: number | null
  updatedAt: number | null
}

export type ChatListItem = {
  id: string
  title: string
  model: string
  prompt: string
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
  updateChat: (
    id: string,
    { title, model }: { title?: string; model?: string },
  ) => void
  clearChat: () => void

  // Chat Actions
  sendChat: (id: string, model: string, callback?: () => void) => void
  cancelChat: (id: string) => void
  regenerateChat: (id: string, message_id: string) => void
  generateTitle: (id: string) => void

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
  model: 'mistralai/mixtral-8x7b-instruct',
  prompt: '',
  list: [],
  state: CHAT_STATE.NONE,
  createdAt: Date.now(),
  updatedAt: Date.now(),
}

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
        const { list } = get()
        const id = nanoid()
        const newChat = {
          ...clone(initChatItem),
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
        const newList = list.filter((item) => item.id !== id)

        if (newList.length <= 1) {
          set({ activeId: initChatItem.id, list: [clone(initChatItem)] })
        } else if (activeId === id) {
          const find = clone(newList).sort(
            (x, y) => y.updatedAt! - x.updatedAt!,
          )[0]
          set({ activeId: find.id, list: newList })
        } else {
          set({ list: newList })
        }
      },
      updateChat: (id, { title, model }) => {
        const { list } = get()
        const newList = list.map((item) => {
          if (item.id === id) {
            const newItem = { ...item, updatedAt: Date.now() }
            if (title) newItem.title = title

            if (model) newItem.model = model

            return newItem
          }
          return item
        })
        set({ list: newList })
      },
      clearChat: () => {
        set({ activeId: initChatItem.id, list: [clone(initChatItem)] })
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

        const messages = item.list.slice(-8).map((item) => ({
          role: item.role,
          content: item.content,
        }))

        fetchEventSource('/api/chat', {
          method: 'POST',
          signal: controller.signal,
          openWhenHidden: true,
          body: JSON.stringify({
            messages,
            modelId: item.model,
            stream: true,
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
            const data = JSON.parse(res.data).choices[0]
            try {
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
            // 设置状态为NONE
            item.state = CHAT_STATE.NONE

            set({ list: [...list] })

            if (!item.title) {
              // generate title
              get().generateTitle(id)
            }

            throw null
          },
          onclose: () => {},
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
        if (!item) return

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
          // Not set onopen will lead to content-type error: `Error: Expected content-type to be text/event-stream, Actual: null`
          onopen: async () => {},
          onmessage: (res) => {
            const data = JSON.parse(res.data).choices[0]
            try {
              const content = data.delta.content
              if (!content) return

              item.title += content

              set({ list: [...list] })
            } catch {}
          },
          onerror: () => {
            throw null
          },
          onclose: () => {},
        })

        // generate title
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

      // Model
      models: [],
      setModels: (models) => set({ models }),

      // Hydration
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'chat-list',
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
          })
        }
        return Object.assign({}, currentState, persistedState)
      },
    },
  ),
)
