'use client'

import { useLayoutEffect, useRef, useState } from 'react'

import { Input } from '@/components/ui/input'
import { CHAT_STATE, useChatStore } from '@/store/chat'

export function ChatInput({
  onMessageResponse,
  onHeightChange,
}: {
  onMessageResponse?: () => void
  onHeightChange?: (height: number) => void
}) {
  const { addMessage, activeId, sendChat, getActiveChat, cancelChat } =
    useChatStore()

  const chat = getActiveChat(activeId)

  const onHandleMessageResponse = () => {
    onMessageResponse?.()
  }

  const loadingSubmit =
    chat?.state === CHAT_STATE.CONNECTING ||
    chat?.state === CHAT_STATE.RESPONDING

  const inputRef = useRef<HTMLTextAreaElement>(null)

  const [input, setInput] = useState('')
  const [isComposing, setIsComposing] = useState(false)

  const onResize = () => {
    if (!inputRef.current) return
    inputRef.current.style.height = 'auto'
    const height = inputRef.current.scrollHeight
    inputRef.current.style.height = height + 'px'
    inputRef.current.style.overflow =
      inputRef.current.getBoundingClientRect().height ===
      inputRef.current.scrollHeight
        ? 'hidden'
        : 'auto'

    onHeightChange?.(height)
  }

  const onSubmit = () => {
    if (!input?.trim() || loadingSubmit) return

    addMessage({
      id: activeId,
      role: 'user',
      content: input,
      model: chat?.model!,
    })
    setInput('')
    sendChat(activeId, chat?.model!, onHandleMessageResponse)
  }

  useLayoutEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/') {
        setTimeout(() => {
          inputRef.current?.focus()
        }, 0)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <Input
      ref={inputRef}
      className="max-h-56 min-h-min w-full"
      placeholder="Enter message here"
      value={input}
      loadingSubmit={loadingSubmit}
      onChange={(e) => setInput(e.target.value)}
      onSubmit={onSubmit}
      onStop={() => cancelChat(activeId)}
      onCompositionStart={() => setIsComposing(true)}
      onCompositionEnd={() => setIsComposing(false)}
      onInput={onResize}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          if (e.shiftKey) {
          } else if (!isComposing) {
            onSubmit()
          }
        }
      }}
    />
  )
}
