import { useEffect, useRef, useState } from 'react'
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso'
import Image from 'next/image'
import type { ChatItem } from '@/store/chat'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { ChatModel } from '@/modules/chatModel'
import { CHAT_STATE, useChatStore } from '@/store/chat'

import { ChatInput } from '../../chatInput'
import { Content } from './content'
import { CopyContent } from './copyContent'

export function MessageList() {
  const virtuosoRef = useRef<VirtuosoHandle>(null)

  const {
    getActiveList,
    getActiveChat,
    activeId,
    clearMessage,
    models,
    regenerateChat,
    sendChat,
  } = useChatStore()

  const [virtuosoLoaded, setVirtuosoLoaded] = useState(false)

  const list = getActiveList(activeId)
  const chat = getActiveChat(activeId)

  const findModel = models.find((model) => model.name === chat?.model)

  const loadingChat =
    chat?.state === CHAT_STATE.CONNECTING ||
    chat?.state === CHAT_STATE.RESPONDING

  const getModelIcon = (model: string) => {
    const findModel = models.find((item) => item.name === model)
    return findModel?.icon
  }

  const onScrollToEnd = () => {
    setTimeout(() => {
      if (virtuosoRef.current) {
        virtuosoRef.current.scrollTo({
          top: 999999,
        })
      }
    }, 50)
  }

  useEffect(() => {
    setVirtuosoLoaded(false)
    setTimeout(() => {
      setVirtuosoLoaded(true)
    }, 200)
  }, [activeId])

  useEffect(() => {
    onScrollToEnd()
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
                chat?.state === CHAT_STATE.CONNECTING ? (
                  <div className="mx-auto max-w-3xl px-4 pb-5">
                    <div className={cn('flex gap-3')}>
                      <div>
                        <Image
                          src={getModelIcon(chat?.model!)!}
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
                ) : (
                  <div className="pb-5" />
                ),
            }}
            totalCount={list.length}
            itemContent={(index: number, item: ChatItem) => {
              return (
                <div
                  className={cn('group mx-auto mb-5 max-w-3xl px-4', {
                    'mt-5': index === 0,
                  })}
                >
                  <div
                    className={cn(
                      'flex gap-3',
                      item.role === 'user' ? 'flex-row-reverse' : 'flex-row',
                    )}
                  >
                    {item.role !== 'user' && (
                      <div>
                        <Image
                          src={getModelIcon(item.model)!}
                          alt="model"
                          width={32}
                          height={32}
                        />
                      </div>
                    )}
                    <div className="flex flex-col">
                      <Content data={item} />
                      <TooltipProvider>
                        <div
                          className={cn(
                            'flex opacity-0 transition-opacity group-hover:opacity-100',
                            item.role === 'user'
                              ? 'justify-end'
                              : 'justify-start',
                          )}
                        >
                          <div className="mt-2 flex gap-0.5 rounded-[10px] bg-white p-1">
                            <CopyContent content={item.content} />
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div
                                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-[#F0F0EF]"
                                  onClick={() => {
                                    if (loadingChat) return
                                    regenerateChat(activeId, item.id)
                                    sendChat(activeId, chat?.model!)
                                  }}
                                >
                                  <Image
                                    src="/icon/generate.svg"
                                    alt="generate"
                                    width={20}
                                    height={20}
                                  />
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Regenerate</p>
                              </TooltipContent>
                            </Tooltip>
                            {item.role !== 'user' ? (
                              <>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-[#F0F0EF]">
                                      <Image
                                        src="/icon/share.svg"
                                        alt="share"
                                        width={20}
                                        height={20}
                                      />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Share</p>
                                  </TooltipContent>
                                </Tooltip>
                              </>
                            ) : (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div
                                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-[#F0F0EF]"
                                    onClick={() => {
                                      if (loadingChat) return
                                      console.log('edit')
                                    }}
                                  >
                                    <Image
                                      src="/icon/edit.svg"
                                      alt="edit"
                                      width={24}
                                      height={24}
                                    />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Edit</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                        </div>
                      </TooltipProvider>
                    </div>
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
            <ChatModel>
              <div className="mb-2 flex h-10 w-[104px] cursor-pointer items-center justify-center gap-1 rounded-[10px] bg-[#4ae3f5] text-sm font-medium text-gray-950">
                {findModel?.icon && (
                  <Image
                    className="rounded-md"
                    src={findModel.icon}
                    alt="model"
                    width={20}
                    height={20}
                  />
                )}
                Model
                <span className="i-mingcute-up-fill rotate-90" />
              </div>
            </ChatModel>

            <div
              className="cursor-pointer text-sm font-medium text-gray-950"
              onClick={() => clearMessage(activeId)}
            >
              Clear messages
            </div>
          </div>
          <ChatInput
            onMessageResponse={() => {
              onScrollToEnd()
            }}
          />
        </div>
      </div>
    </div>
  )
}
