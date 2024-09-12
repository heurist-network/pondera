'use client'

import { useChatStore } from '@/store/chat'

import { MessageList } from './messageList'
import { Welcome } from './welcome'

export function ChatList() {
  const { getActiveList, activeId } = useChatStore()

  const list = getActiveList(activeId)

  return (
    <div className="flex-1 rounded-t-2xl bg-[#F7F7F6] md:rounded-2xl">
      {list.length ? <MessageList /> : <Welcome />}
    </div>
  )
}
