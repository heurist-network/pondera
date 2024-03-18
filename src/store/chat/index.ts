import { toast } from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { BASE_PROMPT, GENERATE_CHAT_NAME_PROMPT } from '@/lib/constant'
import { clone } from '@/lib/utils'
import { fetchEventSource } from '@fortaine/fetch-event-source'

import { ChatListItem, ChatStore, LOADING_STATE, Message } from './type'

export type { ChatListItem, Message }

export { LOADING_STATE } from './type'

export const initChatItem: ChatListItem = {
  chat_id: uuidv4(),
  chat_name: '',
  chat_model: 'mistralai/mixtral-8x7b-instruct-v0.1',
  chat_prompt: BASE_PROMPT,
  chat_state: LOADING_STATE.NONE,
  chat_context_length: 8,
  chat_list: [],
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      activeId: initChatItem.chat_id,
      list: [initChatItem],
      abort: {},

      toggleChatActive: (chat_id) => {
        set({ activeId: chat_id })
      },
      addChat: () => {
        const chat_id = uuidv4()
        const chatItem = { ...clone(initChatItem), chat_id }

        set((state) => ({
          list: [...state.list, chatItem],
          activeId: chat_id,
        }))
      },
      deleteChat: (chat_id) => {
        set((state) => {
          if (state.list.length <= 1) {
            const activeId = initChatItem.chat_id
            return { activeId, list: [clone(initChatItem)] }
          } else {
            const list = state.list.filter((item) => item.chat_id !== chat_id)

            if (chat_id === state.activeId) {
              return { activeId: list[0].chat_id, list }
            }

            return { list }
          }
        })
      },
      clearChat: () => {
        set(() => {
          const activeId = initChatItem.chat_id
          return { activeId, list: [clone(initChatItem)] }
        })
      },
      regenerateChat: ({ chat_id, message_id }) => {
        set((state) => {
          const newList: ChatListItem[] = clone(state.list)
          const findChat = newList.find((chat) => chat.chat_id === chat_id)
          if (!findChat) return {}

          const findMessage = findChat.chat_list.find(
            (item) => item.id === message_id,
          )
          const findMessageIndex = findChat.chat_list.findIndex(
            (item) => item.id === message_id,
          )

          if (!findMessage) return {}

          let arr: Message[] = []

          if (findMessage.role === 'assistant') {
            arr = findChat.chat_list.slice(0, findMessageIndex)
          } else if (findMessage.role === 'user') {
            arr = findChat.chat_list.slice(0, findMessageIndex + 1)
          }

          findChat.chat_list = arr

          return { list: newList }
        })
      },
      updateChatName: (chat_id, chat_name) => {
        set((state) => {
          const newList: ChatListItem[] = clone(state.list)
          const findChat = newList.find((chat) => chat.chat_id === chat_id)
          if (!findChat) return {}
          findChat.chat_name = chat_name

          return { list: newList }
        })
      },
      updateChatModel: (chat_id, chat_model) => {
        set((state) => {
          const newList: ChatListItem[] = clone(state.list)
          const findChat = newList.find((chat) => chat.chat_id === chat_id)
          if (!findChat) return {}
          findChat.chat_model = chat_model

          return { list: newList }
        })
      },
      addMessage: ({ chat_id, message, role }) => {
        set((state) => {
          const newList: ChatListItem[] = clone(state.list)
          const findChat = newList.find((chat) => chat.chat_id === chat_id)
          if (!findChat) return {}

          findChat.chat_list.push({
            id: uuidv4(),
            role,
            content: message,
            time: String(+new Date()),
          })

          return { list: newList }
        })
      },
      deleteMessage: ({ chat_id, message_id }) => {
        set((state) => {
          const newList: ChatListItem[] = clone(state.list)
          const findChat = newList.find((chat) => chat.chat_id === chat_id)
          if (!findChat) return {}
          findChat.chat_list = findChat.chat_list.filter(
            (item) => item.id !== message_id,
          )
          return { list: newList }
        })
      },
      updateMessage: ({ chat_id, message_id, content }) => {
        set((state) => {
          const newList: ChatListItem[] = clone(state.list)
          const findChat = newList.find((chat) => chat.chat_id === chat_id)
          if (!findChat) return {}
          const findMessage = findChat.chat_list.find(
            (item) => item.id === message_id,
          )
          if (!findMessage) return {}

          findMessage.content = content

          return { list: newList }
        })
      },

      // Chat Action
      sendChat: ({ chat_id }) => {
        let findChat: ChatListItem | undefined

        set((state) => {
          const newList: ChatListItem[] = clone(state.list)
          findChat = newList.find((chat) => chat.chat_id === chat_id)

          if (!findChat) return {}
          findChat.chat_state = LOADING_STATE.CONNECTING

          return { list: newList }
        })

        if (!findChat) return

        const controller = new AbortController()

        const messages = findChat.chat_list.slice(-8).map((item) => ({
          role: item.role,
          content: item.content,
        }))

        set((state) => {
          return { abort: { ...state.abort, [chat_id]: controller } }
        })

        fetchEventSource('/api/chat', {
          method: 'POST',
          signal: controller.signal,
          openWhenHidden: true,
          body: JSON.stringify({
            messages,
            modelId: findChat.chat_model,
            stream: true,
          }),
          onopen: async (res) => {
            const isError = !res.ok || res.status !== 200 || !res.body

            if (isError) {
              set((state) => {
                const newList: ChatListItem[] = clone(state.list)
                const findChat = newList.find(
                  (chat) => chat.chat_id === chat_id,
                )
                if (!findChat) return {}
                findChat.chat_state = LOADING_STATE.NONE

                return { list: newList }
              })

              if (res.status === 429) {
                toast.error('Too Many Requests')
                return
              }

              const errRes = await res.json()

              toast.error(errRes.msg || 'Error')
            }
          },
          onmessage: (res) => {
            const data = JSON.parse(res.data).choices[0]
            if (data.finish_reason === 'stop') {
              set((state) => {
                const newList: ChatListItem[] = clone(state.list)
                const findChat = newList.find(
                  (chat) => chat.chat_id === chat_id,
                )
                if (!findChat) return {}
                findChat.chat_state = LOADING_STATE.NONE

                // If no title, generate one.
                if (!findChat.chat_name) {
                  state.generateChatName({
                    chat_id,
                    messages: [
                      ...messages,
                      {
                        role: 'user',
                        content: GENERATE_CHAT_NAME_PROMPT,
                      },
                    ],
                  })
                }

                return { list: newList }
              })

              return console.log('response over')
            }

            try {
              const content = data.delta.content
              if (!content) return

              set((state) => {
                const newList: ChatListItem[] = clone(state.list)
                const findChat = newList.find(
                  (chat) => chat.chat_id === chat_id,
                )
                if (!findChat) return {}

                findChat.chat_state = LOADING_STATE.RESPONDING

                const lastItem = findChat.chat_list.at(-1)
                if (!lastItem) return {}

                if (lastItem.role === 'user') {
                  findChat.chat_list.push({
                    id: uuidv4(),
                    role: 'assistant',
                    time: String(+new Date()),
                    content,
                  })
                } else {
                  lastItem.content += content
                }

                return { list: newList }
              })
            } catch {}
          },
          onerror: () => {
            console.log('stop streaming')
            // FIXME: This is a hack to stop the SSE stream in onerror. The SSE client is probably not closing the stream properly.
            set((state) => {
              const newList: ChatListItem[] = clone(state.list)
              const findChat = newList.find((chat) => chat.chat_id === chat_id)
              if (!findChat) return {}
              findChat.chat_state = LOADING_STATE.NONE

              // If no title, generate one.
              if (!findChat.chat_name) {
                state.generateChatName({
                  chat_id,
                  messages: [
                    ...messages,
                    {
                      role: 'user',
                      content: GENERATE_CHAT_NAME_PROMPT,
                    },
                  ],
                })
              }

              return { list: newList }
            })
            throw null
          },
          onclose: () => {
            console.log('onclose')
          },
        })
      },
      generateChatName: ({ chat_id }) => {
        const findChat = get().list.find((item) => item.chat_id === chat_id)
        if (!findChat) return

        // last 10 messages
        const messages = findChat.chat_list.slice(-10).map((item) => ({
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
            modelId: 'mistralai/mixtral-8x7b-instruct-v0.1',
            stream: true,
          }),
          // Not set onopen will lead to content-type error: `Error: Expected content-type to be text/event-stream, Actual: null`
          onopen: async () => {},
          onmessage: (res) => {
            const data = JSON.parse(res.data).choices[0]

            try {
              const content = data.delta.content
              if (!content) return

              set((state) => {
                const newList: ChatListItem[] = clone(state.list)
                const findChat = newList.find(
                  (item) => item.chat_id === chat_id,
                )
                if (!findChat) return {}

                findChat.chat_name += content

                return { list: newList }
              })
            } catch {}
          },
          onerror: (error) => {
            console.log(error, 'generateChatName error')
            throw null
          },
        })
      },
      cancelChat: (chat_id) => {
        set((state) => {
          if (!state.abort[chat_id]) return {}
          state.abort[chat_id].abort()
          delete state.abort[chat_id]

          const newList: ChatListItem[] = clone(state.list)
          const findChat = newList.find((item) => item.chat_id === chat_id)
          if (!findChat) return {}
          findChat.chat_state = LOADING_STATE.NONE

          return { list: newList }
        })
      },

      // Hydration
      _hasHydrated: false,
      setHasHydrated: (state) => {
        set({
          _hasHydrated: state,
        })
      },
    }),
    {
      name: 'chat-list',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
      merge: (persistedState: any, currentState) => {
        // reset data
        if (persistedState) {
          persistedState.abort = {}
          persistedState.list.forEach((item: any) => {
            item.chat_state = LOADING_STATE.NONE
            if (typeof item.chat_model !== 'string') {
              item.chat_model = 'mistralai/mixtral-8x7b-instruct-v0.1'
            }
          })
        }

        return Object.assign({}, currentState, persistedState)
      },
    },
  ),
)
