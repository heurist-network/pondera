import { useEffect, useRef, useState } from 'react'
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso'
import Image from 'next/image'
import type { ChatItem } from '@/store/chat'

import { cn } from '@/lib/utils'
import { CHAT_STATE, useChatStore } from '@/store/chat'

import { ChatInput } from '../../chatInput'
import { Content } from './content'

export function MessageList() {
  const virtuosoRef = useRef<VirtuosoHandle>(null)
  const { getActiveList, getActiveChat, activeId, clearMessage } =
    useChatStore()

  const [virtuosoLoaded, setVirtuosoLoaded] = useState(false)

  const list = getActiveList(activeId)
  const chat = getActiveChat(activeId)

  const loadingSubmit =
    chat?.state === CHAT_STATE.CONNECTING ||
    chat?.state === CHAT_STATE.RESPONDING

  useEffect(() => {
    setVirtuosoLoaded(false)
  }, [activeId])

  useEffect(() => {
    if (virtuosoRef.current) {
      virtuosoRef.current.scrollTo({
        top: 999999,
      })
    }
  }, [list, virtuosoLoaded])

  return (
    <div className="flex h-full flex-col">
      <div className="grow">
        <div
          className={cn('h-full', virtuosoLoaded ? 'opacity-100' : 'opacity-0')}
        >
          <Virtuoso
            ref={virtuosoRef}
            data={list}
            followOutput
            components={{
              Footer: () =>
                loadingSubmit && (
                  <div className="mx-auto max-w-3xl px-4">
                    <div className={cn('flex gap-3')}>
                      <div>
                        <Image
                          src="/model/mistral.svg"
                          alt="mistral"
                          width={32}
                          height={32}
                        />
                      </div>
                      <div className="flex items-center rounded-2xl bg-white px-4 py-3">
                        <span className="i-mingcute-loading-fill animate-spin" />
                      </div>
                    </div>
                  </div>
                ),
            }}
            totalCount={list.length}
            atTopStateChange={() => setVirtuosoLoaded(true)}
            itemContent={(index: number, item: ChatItem) => {
              return (
                <div
                  className={cn('mx-auto mb-5 max-w-3xl px-4', {
                    'mt-5': index === 0,
                  })}
                >
                  <div
                    className={cn(
                      'flex gap-3',
                      item.role === 'user' ? 'flex-row-reverse' : 'flex-row',
                    )}
                  >
                    {item.role === 'user' ? (
                      <div className="i-mingcute-user-4-fill h-9 w-9 bg-[#1d1d1c]" />
                    ) : (
                      <div>
                        <Image
                          src="/model/mistral.svg"
                          alt="mistral"
                          width={32}
                          height={32}
                        />
                      </div>
                    )}
                    <Content data={item} />
                  </div>
                </div>
              )
            }}
          />
        </div>
      </div>
      <div className="h-32">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-center justify-between">
            <div className="mb-2 flex h-10 w-[104px] cursor-pointer items-center justify-center gap-1 rounded-[10px] bg-[#4ae3f5] text-sm font-medium text-gray-950">
              Model
              <span className="i-mingcute-up-fill rotate-90" />
            </div>
            <div
              className="cursor-pointer text-sm font-medium text-gray-950"
              onClick={() => clearMessage(activeId)}
            >
              Clear messages
            </div>
          </div>
          <ChatInput />
        </div>
      </div>
    </div>
  )
}
