'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

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
import { useClipboard } from '@/hooks/useClipboard'
import { cn } from '@/lib/utils'
import { LOADING_STATE, Message, useChatStore } from '@/store/chat'

import { ChatContent } from '../chatContent'
import Edit from './edit'

function CopyContent({ content }: { content: string }) {
  const { isCopied, copy } = useClipboard()

  const onCopy = (content: string) => {
    if (isCopied) return
    copy(content)
  }

  return (
    <div
      className="flex cursor-pointer items-center justify-center rounded-md p-1.5 transition-colors hover:bg-[#f2f2f2]"
      onClick={() => onCopy(content)}
    >
      <span
        className={cn(
          'h-[18px] w-[18px] text-[#757574]',
          isCopied ? 'i-mingcute-check-line' : 'i-mingcute-copy-2-line',
        )}
      />
    </div>
  )
}

export default function ChatSection() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<Message[]>([])
  const [activeId, list] = useChatStore((state) => [state.activeId, state.list])
  const regenerateChat = useChatStore((state) => state.regenerateChat)
  const sendChat = useChatStore((state) => state.sendChat)
  const deleteMessage = useChatStore((state) => state.deleteMessage)

  const activeChat = list.find((item) => item.chat_id === activeId)

  useEffect(() => {
    const findChat = list.find((item) => item.chat_id === activeId)
    setMessages(findChat?.chat_list || [])

    setTimeout(() => {
      scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight)
    }, 0)
  }, [activeId, list])

  return (
    <div
      className="flex grow flex-col gap-4 overflow-y-auto py-10 pl-5 pr-10"
      ref={scrollRef}
    >
      {messages.map((m, index) => (
        <div key={m.id} className="group">
          <div className="flex gap-2">
            {m.role === 'user' ? (
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-zinc-200">
                <span className="i-mingcute-user-2-fill h-6 w-6" />
              </div>
            ) : (
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-zinc-200">
                <Image
                  className="h-5 w-5"
                  src="/mistral.svg"
                  alt="mistral"
                  width={26}
                  height={26}
                />
              </div>
            )}
            <div
              className={cn(
                'max-w-[125ch] self-start rounded-xl px-4 py-2',
                m.role === 'user' ? 'bg-blue-200/70' : 'bg-neutral-100',
              )}
            >
              <ChatContent content={m.content} />
            </div>
          </div>
          <div
            className={cn(
              'mt-1 flex gap-2 pl-12 opacity-0 transition-opacity',
              m.role !== 'user' &&
                index === messages.length - 1 &&
                activeChat?.chat_state !== LOADING_STATE.NONE
                ? 'pointer-events-none'
                : 'group-hover:opacity-100',
            )}
          >
            <CopyContent content={m.content} />
            <Edit chat_id={activeId} message_id={m.id} content={m.content} />
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div className="flex cursor-pointer items-center justify-center rounded-md p-1.5 transition-colors hover:bg-[#f2f2f2]">
                  <span className="i-f7-trash h-[18px] w-[18px] text-destructive" />
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this message?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => {
                      deleteMessage({ chat_id: activeId, message_id: m.id })
                    }}
                  >
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <div
              className="flex cursor-pointer items-center justify-center rounded-md p-1.5 transition-colors hover:bg-[#f2f2f2]"
              onClick={() => {
                if (activeChat?.chat_state !== LOADING_STATE.NONE) return
                regenerateChat({ chat_id: activeId, message_id: m.id })
                sendChat({ chat_id: activeId })
              }}
            >
              <span className="i-mingcute-refresh-3-line h-[18px] w-[18px] text-[#757574]" />
            </div>
          </div>
        </div>
      ))}
      {activeChat?.chat_state !== LOADING_STATE.NONE && (
        <div className="-mt-4 flex items-center gap-2 pl-12 text-sm text-muted-foreground">
          <span className="i-mingcute-loading-line h-5 w-5 animate-spin" />
          Assistant is{' '}
          {activeChat?.chat_state === LOADING_STATE.CONNECTING
            ? 'thinking'
            : 'typing'}
          ...
        </div>
      )}
    </div>
  )
}
