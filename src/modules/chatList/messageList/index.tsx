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

  const { getActiveList, getActiveChat, activeId, clearMessage, models } =
    useChatStore()

  const [virtuosoLoaded, setVirtuosoLoaded] = useState(false)

  const list = getActiveList(activeId)
  const chat = getActiveChat(activeId)

  const findModel = models.find((model) => model.name === chat?.model)

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
    <div className="flex flex-col h-full">
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
                      <div className="bg-white flex rounded-2xl py-3 px-4 items-center">
                        <span className="animate-spin i-mingcute-loading-fill" />
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
                          <div className="bg-white flex rounded-[10px] mt-2 p-1 gap-0.5">
                            <CopyContent content={item.content} />
                            {item.role !== 'user' ? (
                              <>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="rounded-md cursor-pointer flex h-8 transition-colors w-8 items-center justify-center hover:bg-[#F0F0EF]">
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
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="rounded-md cursor-pointer flex h-8 transition-colors w-8 items-center justify-center hover:bg-[#F0F0EF]">
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
                                  <div className="rounded-md cursor-pointer flex h-8 transition-colors w-8 items-center justify-center hover:bg-[#F0F0EF]">
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
              <div className="cursor-pointer flex font-medium bg-[#4ae3f5] rounded-[10px] h-10 text-sm mb-2 text-gray-950 w-[104px] gap-1 items-center justify-center">
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
                <span className="rotate-90 i-mingcute-up-fill" />
              </div>
            </ChatModel>

            <div
              className="cursor-pointer font-medium text-sm text-gray-950"
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
