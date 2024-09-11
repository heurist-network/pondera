'use client'

import { useLayoutEffect, useRef, useState } from 'react'

import { Input } from '@/components/ui/input'
import { useChatStore } from '@/store/chat'

export function ChatInput() {
  const { addMessage, activeId } = useChatStore()

  const inputRef = useRef<HTMLInputElement>(null)

  const [input, setInput] = useState('')

  const onSubmit = () => {
    addMessage({
      id: activeId,
      content: input,
      role: 'user',
    })
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
      className="w-full"
      placeholder="What do you want?"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      onSubmit={onSubmit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onSubmit()
        }
      }}
    />
  )
}
