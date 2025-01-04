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
                checked={chat?.chainOfThought}
                disabled={
                  ![
                    'nvidia/llama-3.1-nemotron-70b-instruct',
                    'meta-llama/llama-3.3-70b-instruct',
                  ].includes(chat?.model || '')
                }
                onCheckedChange={(checked) =>
                  updateChat(activeId, { chainOfThought: checked })
                }
                className="scale-75"
              />
              <span className="text-xs text-gray-400">CoT</span>
            </div>
            {![
              'nvidia/llama-3.1-nemotron-70b-instruct',
              'meta-llama/llama-3.3-70b-instruct',
            ].includes(chat?.model || '') && (
              <span className="i-mingcute-information-line h-4 w-4 text-gray-400" />
            )}
          </div>
        </TooltipTrigger>
        {![
          'nvidia/llama-3.1-nemotron-70b-instruct',
          'meta-llama/llama-3.3-70b-instruct',
        ].includes(chat?.model || '') ? (
          <TooltipContent>
            <p>Chain of Thought is only available for Llama 3 models</p>
          </TooltipContent>
        ) : (
          <TooltipContent>
            <div className="max-w-[200px]">
              <p className="font-medium">Chain of Thought</p>
              <p className="mt-1 text-xs text-gray-400">
                Show AI&apos;s reasoning process. This setting cannot be changed
                once the conversation starts.
              </p>
            </div>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  ) : null

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [processing, setProcessing] = useState(false)

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || file.type !== 'application/pdf') return

    try {
      setProcessing(true)
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/pdf/process', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to process PDF')
      }

      const result = await response.json()
      addMessage({
        id: activeId,
        role: 'system',
        content: `Processed PDF "${file.name}" into ${result.chunks} chunks. You can now ask questions about this document.`,
        model: chat?.model!,
      })
    } catch (error) {
      console.error('PDF processing error:', error)
      addMessage({
        id: activeId,
        role: 'system',
        content: `Failed to process PDF: ${error instanceof Error ? error.message : 'Unknown error'}`,
        model: chat?.model!,
      })
    } finally {
      setProcessing(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const pdfUploadButton = (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-950 text-white transition-colors hover:bg-gray-950/80 disabled:opacity-50 dark:bg-zinc-700 dark:hover:bg-zinc-600"
            disabled={processing}
          >
            {processing ? (
              <span className="i-mingcute-loading-fill animate-spin" />
            ) : (
              <span className="i-mingcute-file-upload-line h-4 w-4" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Upload PDF</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )

  return (
    <>
      <input
        type="file"
        accept=".pdf"
        className="hidden"
        ref={fileInputRef}
        onChange={handlePdfUpload}
      />
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
        pdfUploadButton={pdfUploadButton}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            if (e.shiftKey) {
            } else if (!isComposing) {
              onSubmit()
            }
          }
        }}
      />
    </>
  )
}
