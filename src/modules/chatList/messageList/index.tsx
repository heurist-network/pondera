import { useEffect, useRef, useState } from 'react'
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso'
import Image from 'next/image'
import type { ChatItem } from '@/store/chat'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
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
import { EditContent } from './editContent'
import { ShareChat } from './shareChat'

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
    updateMessage,
  } = useChatStore()

  const [virtuosoLoaded, setVirtuosoLoaded] = useState(false)
  const [paddingBottom, setPaddingBottom] = useState(0)

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
    <TooltipProvider>
      <div className="relative flex h-full flex-col">
        <div
          className="grow"
          style={{
            paddingBottom: paddingBottom - 30,
          }}
        >
          <div
            className={cn(
              'h-full',
              virtuosoLoaded ? 'opacity-100' : 'opacity-0',
            )}
          >
            <Virtuoso
              ref={virtuosoRef}
              data={list}
              followOutput
              components={{
                Footer: () => (
                  <div>
                    {chat?.state === CHAT_STATE.CONNECTING ? (
                      <div className="mx-auto max-w-3xl px-4 pb-5">
                        <div className={cn('flex gap-3')}>
                          <div>
                            <Image
                              src={getModelIcon(chat?.model!)!}
                              alt="model"
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
                    )}
                    <div className="h-[120px]" />
                  </div>
                ),
              }}
              totalCount={list.length}
              itemContent={(index: number, item: ChatItem) => {
                if (item.role === 'system') {
                  return (
                    <div
                      className={cn('group mx-auto mb-5 max-w-3xl px-4', {
                        'mt-5': index === 0,
                      })}
                    >
                      <div className="text-center text-sm text-muted-foreground/50">
                        {item.content}
                      </div>
                    </div>
                  )
                }

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
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Image
                                src={getModelIcon(item.model)!}
                                alt="model"
                                width={32}
                                height={32}
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{item.model}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                      <div
                        className={cn(
                          'flex flex-col items-end md:gap-2',
                          item.role === 'user'
                            ? 'md:flex-row-reverse'
                            : 'md:flex-row',
                          item.isEdit ? 'flex-1' : '',
                        )}
                      >
                        {item.isEdit ? (
                          <EditContent data={item} />
                        ) : (
                          <>
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
                                        className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-[#F0F0EF]"
                                        onClick={() => {
                                          if (loadingChat) return
                                          regenerateChat(activeId, item.id)
                                          sendChat(activeId, chat?.model!)
                                        }}
                                      >
                                        <Image
                                          src="/icon/generate.svg"
                                          alt="generate"
                                          width={16}
                                          height={16}
                                        />
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Regenerate</p>
                                    </TooltipContent>
                                  </Tooltip>
                                  {item.role !== 'user' && (
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <div
                                          className="flex h-6 w-6 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-[#F0F0EF]"
                                          onClick={() => {
                                            if (loadingChat) return
                                            updateMessage({
                                              chat_id: activeId,
                                              message_id: item.id,
                                              isEdit: true,
                                            })
                                          }}
                                        >
                                          <Image
                                            src="/icon/edit.svg"
                                            alt="edit"
                                            width={16}
                                            height={16}
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
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )
              }}
            />
          </div>
        </div>
        <div
          className="absolute bottom-0 w-full rounded-b-2xl"
          style={{
            backgroundImage:
              'linear-gradient(to top, rgb(255, 255, 255), rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0))',
          }}
        >
          <div className="pb-4 pt-2 md:border-t-0">
            <div className="mx-auto max-w-3xl px-4">
              <div className="mb-2 flex items-center justify-between">
                <ChatModel>
                  <div className="flex h-9 cursor-pointer items-center justify-center gap-1 rounded-[10px] bg-[#4ae3f5] px-2 text-sm font-medium text-gray-950">
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

                <div className="flex gap-2">
                  <ShareChat />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <div className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[10px] border border-[#e0e0e0] bg-white text-sm font-medium text-gray-950">
                        <span className="i-mingcute-broom-line h-5 w-5" />
                      </div>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Clear Messages?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          variant="destructive"
                          onClick={() => clearMessage(activeId)}
                        >
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
              <ChatInput
                onMessageResponse={() => onScrollToEnd()}
                onHeightChange={setPaddingBottom}
              />
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
