import { nanoid } from 'nanoid'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { clone } from '@/lib/utils'

export type ChatModel = {
  name: string
}

export type ChatItem = {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  createdAt: number | null
  updatedAt: number | null
}

export type ChatListItem = {
  id: string
  title: string
  model: string
  prompt: string
  list: ChatItem[]
  createdAt: number | null
  updatedAt: number | null
}

export type ChatStore = {
  activeId: string
  list: ChatListItem[]

  addChat: () => void
  toggleChat: (id: string) => void
  deleteChat: (id: string) => void
  updateChat: (id: string, { title }: { title: string }) => void

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
  model: '',
  prompt: '',
  list: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      activeId: initChatItem.id,
      list: [initChatItem],

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
      updateChat: (id, { title }) => {
        const { list } = get()
        const newList = list.map((item) => {
          if (item.id === id) {
            return { ...item, title }
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
            state?.setModels(arr)
          })
      },
      merge: (persistedState: any, currentState) => {
        return Object.assign({}, currentState, persistedState)
      },
    },
  ),
)
