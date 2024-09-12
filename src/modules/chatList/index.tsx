'use client'

import { useChatStore } from '@/store/chat'

import { MessageList } from './messageList'
import { Welcome } from './welcome'

export function ChatList() {
  const { getActiveList, activeId } = useChatStore()

  const list = getActiveList(activeId)

  return (
    <div className="bg-[#F7F7F6] flex-1 md:rounded-2xl">
      {list.length ? <MessageList /> : <Welcome />}
    </div>
  )
}
