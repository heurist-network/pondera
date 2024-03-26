'use client'

import { useEffect, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'

import { AlertDialog } from '@/components/common/alertDialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { LOADING_STATE, useChatStore } from '@/store/chat'

import { Share } from './share'

export default function InputSection() {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [activeId, list] = useChatStore((state) => [state.activeId, state.list])
  const addMessage = useChatStore((state) => state.addMessage)
  const sendChat = useChatStore((state) => state.sendChat)
  const cancelChat = useChatStore((state) => state.cancelChat)
  const clearMessage = useChatStore((state) => state.clearMessage)

  const activeList = list.find((item) => item.chat_id === activeId)
  const isLoading = activeList?.chat_state !== LOADING_STATE.NONE

  const [input, setInput] = useState('')

  const onResize = () => {
    if (!textareaRef.current) return
    textareaRef.current.style.height = 'auto'
    textareaRef.current.style.height =
      textareaRef.current.scrollHeight + 2 + 'px'
    textareaRef.current.style.overflow =
      textareaRef.current.getBoundingClientRect().height ===
      textareaRef.current.scrollHeight
        ? 'hidden'
        : 'auto'
  }

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      onSubmit()
    }
  }

  const onSubmit = async () => {
    if (activeList?.chat_state !== LOADING_STATE.NONE) {
      return
    }
    if (!input?.trim()) {
      return textareaRef.current?.focus()
    }
    setInput('')
    addMessage({ chat_id: activeId, role: 'user', message: input })
    sendChat({ chat_id: activeId })
  }

  useEffect(() => {
    onResize()
  }, [input])

  useEffect(() => {
    textareaRef.current?.focus()
  }, [activeId])

  useEffect(() => {
    const keydownHandler = (e: any) => {
      if (e.key === '/') {
        e.preventDefault()
        textareaRef.current?.focus()
      }
    }

    document.addEventListener('keydown', keydownHandler)

    return () => {
      document.removeEventListener('keydown', keydownHandler)
    }
  }, [])

  return (
    <div className="border-t border-zinc-100 px-5">
      <div className="flex gap-0.5 py-2">
        {activeList?.chat_state !== LOADING_STATE.NONE && (
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => cancelChat(activeId)}
          >
            <span className="i-mingcute-stop-circle-fill h-4 w-4 text-[#ff5f57]" />
          </Button>
        )}
        <Share />
        {!!activeList?.chat_list?.length && (
          <AlertDialog
            trigger={
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <span className="i-mdi-tooltip-remove-outline h-4 w-4" />
              </Button>
            }
            title="Clear current session messages"
            description="This action cannot be undone"
            onOk={() => clearMessage(activeId)}
          />
        )}
      </div>
      <div className="flex gap-2 pb-3">
        <Textarea
          ref={textareaRef}
          className="max-h-56 min-h-min resize-none rounded-xl bg-transparent transition-all"
          rows={1}
          placeholder={`Press "/" to focus input`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onInput={onResize}
          onKeyDown={onKeyDown}
        />
        <Button
          onClick={onSubmit}
          disabled={isLoading}
          className="gap-2 rounded-xl"
        >
          {isLoading ? (
            <span className="i-mingcute-loading-line animate-spin text-base" />
          ) : (
            <span className="i-ri-send-plane-fill text-base" />
          )}
          <span className="hidden md:block">Send</span>
        </Button>
      </div>
    </div>
  )
}
