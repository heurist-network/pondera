import { useCallback, useEffect, useRef, useState } from 'react'
import { Virtuoso, VirtuosoHandle } from 'react-virtuoso'
import Image from 'next/image'
import type { ChatItem } from '@/store/chat'

import { FileListDialog } from '@/components/fileListDialog'
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
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { UploadDialog } from '@/components/uploadDialog'
import { cn } from '@/lib/utils'
import { ChatModel } from '@/modules/chatModel'
import { Prompt } from '@/modules/prompt'
import { CHAT_STATE, useChatStore } from '@/store/chat'

import { ChatInput } from '../../chatInput'
import { Content } from './content/index'
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
  const [uploadOpen, setUploadOpen] = useState(false)
  const [fileListOpen, setFileListOpen] = useState(false)

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

  const onScrollToEnd = useCallback(() => {
    if (virtuosoRef.current) {
      virtuosoRef.current.scrollToIndex({
        index: list.length - 1,
        behavior: 'smooth',
      })
    }
  }, [list.length])

  useEffect(() => {
    setVirtuosoLoaded(false)
    setTimeout(() => {
      setVirtuosoLoaded(true)
    }, 200)
  }, [activeId])

  useEffect(() => {
    if (virtuosoLoaded) {
      onScrollToEnd()
    }
  }, [list, virtuosoLoaded, onScrollToEnd])

  return (
    <TooltipProvider>
      <div className="relative flex h-full flex-col">
        <div
          className="grow"
          style={{
            paddingBottom: Math.max(0, paddingBottom - 30),
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
              followOutput="smooth"
              initialTopMostItemIndex={list.length - 1}
              components={{
                Footer: () => (
                  <div>
                    {chat?.state === CHAT_STATE.CONNECTING ? (
                      <div className="mx-auto max-w-3xl px-4 pb-5">
                        <div className={cn('flex gap-3')}>
                          <div>
                            <Image
                              // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
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
                            <div className="shrink-0">
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
                                          // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
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
                <div className="flex gap-2">
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
                      <span className="hidden md:inline">Model</span>
                      <span className="i-mingcute-up-fill rotate-90" />
                    </div>
                  </ChatModel>
                  <Prompt>
                    <Button
                      className="h-9 w-9 rounded-[10px] md:w-auto"
                      variant="outline"
                    >
                      <span className="i-mingcute-settings-2-line h-4 w-4 px-2 md:hidden" />
                      <span className="hidden md:inline">Advanced</span>
                    </Button>
                  </Prompt>
                </div>

                <div className="flex gap-2">
                  <div className="hidden md:block">
                    <ShareChat />
                  </div>
                  <div className="md:hidden">
                    <Button
                      variant="outline"
                      className="h-9 w-9 rounded-[10px]"
                    >
                      <span className="i-mingcute-share-forward-line h-4 w-4 px-2" />
                    </Button>
                  </div>
                  <UploadDialog
                    open={uploadOpen}
                    onOpenChange={setUploadOpen}
                  />
                  <FileListDialog
                    open={fileListOpen}
                    onOpenChange={setFileListOpen}
                  />
                  {chat?.hasDocument && (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        className="hidden h-9 gap-1 rounded-[10px] px-2 md:flex"
                        onClick={() => setUploadOpen(true)}
                      >
                        <div>Upload</div>
                        <span className="i-mingcute-upload-2-line h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="h-9 w-9 gap-1 rounded-[10px] px-2 md:hidden md:w-auto"
                        onClick={() => setUploadOpen(true)}
                      >
                        <span className="i-mingcute-upload-2-line h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        className="hidden h-9 gap-1 rounded-[10px] px-2 md:flex"
                        onClick={() => setFileListOpen(true)}
                      >
                        <div>Files</div>
                        <span className="i-mingcute-folder-open-line h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        className="h-9 w-9 gap-1 rounded-[10px] px-2 md:hidden md:w-auto"
                        onClick={() => setFileListOpen(true)}
                      >
                        <span className="i-mingcute-folder-open-line h-4 w-4" />
                      </Button>
                    </div>
                  )}
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
