/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
'use client'

import { useLayoutEffect, useRef, useState } from 'react'

import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { CHAT_STATE, useChatStore } from '@/store/chat'

export function ChatInput({
  onMessageResponse,
  onHeightChange,
}: {
  onMessageResponse?: () => void
  onHeightChange?: (height: number) => void
}) {
  const {
    addMessage,
    activeId,
    sendChat,
    getActiveChat,
    cancelChat,
    updateChat,
    getActiveList,
  } = useChatStore()

  const chat = getActiveChat(activeId)
  const list = getActiveList(activeId)
  const isWelcomePage = list.length === 0

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

  const chainOfThoughtSlot = isWelcomePage ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <Switch
                id="chain-of-thought"
                checked={
                  chat?.chainOfThought ||
                  chat?.model === 'deepseek/deepseek-r1' ||
                  chat?.model === 'NaniDAO/deepseek-r1-qwen-2.5-32B-ablated' ||
                  chat?.model === 'deepseek/deepseek-r1-distill-llama-70b'
                }
                disabled={
                  ![
                    'mistralai/mistral-small-24b-instruct',
                    'meta-llama/llama-3.3-70b-instruct',
                  ].includes(chat?.model || '') &&
                  chat?.model !== 'deepseek/deepseek-r1' &&
                  chat?.model !== 'NaniDAO/deepseek-r1-qwen-2.5-32B-ablated' &&
                  chat?.model !== 'deepseek/deepseek-r1-distill-llama-70b'
                }
                onCheckedChange={(checked) => {
                  if (
                    chat?.model !== 'deepseek/deepseek-r1' &&
                    chat?.model !==
                      'NaniDAO/deepseek-r1-qwen-2.5-32B-ablated' &&
                    chat?.model !== 'deepseek/deepseek-r1-distill-llama-70b'
                  ) {
                    updateChat(activeId, { chainOfThought: checked })
                  }
                }}
                className="scale-75"
              />
              <span className="text-xs text-gray-400">CoT</span>
            </div>
            {![
              'mistralai/mistral-small-24b-instruct',
              'meta-llama/llama-3.3-70b-instruct',
            ].includes(chat?.model || '') &&
              chat?.model !== 'deepseek/deepseek-r1' &&
              chat?.model !== 'NaniDAO/deepseek-r1-qwen-2.5-32B-ablated' &&
              chat?.model !== 'deepseek/deepseek-r1-distill-llama-70b' && (
                <span className="i-mingcute-information-line h-4 w-4 text-gray-400" />
              )}
          </div>
        </TooltipTrigger>
        {![
          'mistralai/mistral-small-24b-instruct',
          'meta-llama/llama-3.3-70b-instruct',
        ].includes(chat?.model || '') &&
        chat?.model !== 'deepseek/deepseek-r1' &&
        chat?.model !== 'NaniDAO/deepseek-r1-qwen-2.5-32B-ablated' &&
        chat?.model !== 'deepseek/deepseek-r1-distill-llama-70b' ? (
          <TooltipContent>
            <p>
              Chain of Thought (custom system prompt) is only available for
              Llama 3 and Mistral Small. Always enabled for Deepseek R1 models.
            </p>
          </TooltipContent>
        ) : (
          <TooltipContent>
            <div className="max-w-[200px]">
              <p className="font-medium">Chain of Thought</p>
              <p className="mt-1 text-xs text-gray-400">
                {chat?.model === 'deepseek/deepseek-r1'
                  ? 'Chain of Thought is always enabled for Deepseek R1 model'
                  : "Show AI's reasoning process using a custom system prompt. This setting cannot be changed once the conversation starts."}
              </p>
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  ) : null

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
      chainOfThoughtSlot={chainOfThoughtSlot}
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
