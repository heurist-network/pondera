import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type ChatStore = {
  // Hydration
  _hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}

export type ChatListItem = {
  id: string
}

export const initChatItem: ChatListItem = {
  id: '',
}

export const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      activeId: '',

      // Hydration
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
    }),
    {
      name: 'chat-list',
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
      merge: (persistedState: any, currentState) => {
        return Object.assign({}, currentState, persistedState)
      },
    },
  ),
)
