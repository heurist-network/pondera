import { useEffect, useRef, useState } from 'react'
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso'
import type { ChatItem } from '@/store/chat'

import { cn } from '@/lib/utils'
import { useChatStore } from '@/store/chat'

import { ChatInput } from '../../chatInput'
import { Content } from './content'

export function MessageList() {
  const virtuosoRef = useRef<VirtuosoHandle>(null)
  const { getActiveList, activeId } = useChatStore()

  const [virtuosoLoaded, setVirtuosoLoaded] = useState(false)

  const list = getActiveList(activeId)

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
                    <div className="i-mingcute-user-4-fill h-9 w-9 bg-[#1d1d1c]" />
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
          <div className="mb-2 flex h-10 w-[104px] items-center justify-center gap-1 rounded-[10px] bg-[#4ae3f5] text-sm font-medium text-gray-950">
            Model
            <span className="i-mingcute-up-fill rotate-90" />
          </div>
          <ChatInput />
        </div>
      </div>
    </div>
  )
}
