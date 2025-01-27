import { useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import Image from 'next/image'
import RehypeKatex from 'rehype-katex'
import RemarkGfm from 'remark-gfm'
import RemarkMath from 'remark-math'
import type { ChatItem } from '@/store/chat'

import { cn } from '@/lib/utils'
import { useChatStore } from '@/store/chat'

import { ThinkingDropdown } from './ThinkingDropdown'

export function Content({ data }: { data: ChatItem }) {
  const contentRef = useRef<HTMLDivElement>(null)
  const { getActiveChat, activeId, models } = useChatStore()

  const activeChat = getActiveChat(activeId)

  const shouldShowThinkingDropdown =
    activeChat?.chainOfThought && data.role === 'assistant'

  return (
    <div
      className={cn(
        'flex flex-1 flex-col gap-2 rounded-2xl px-4 py-3',
        data.role === 'user'
          ? 'bg-[#01E3F5] text-gray-950'
          : 'bg-[#F0F0EF] text-gray-950',
      )}
    >
      <div className="flex items-center gap-2">
        {data.role === 'user' ? (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white">
            <span className="i-mingcute-user-2-fill h-4 w-4" />
          </div>
        ) : (
          <Image
            className="rounded-md"
            src={
              models.find((model) => model.name === data.model)?.icon ||
              '/model/mistral.svg'
            }
            alt="model"
            width={24}
            height={24}
          />
        )}
        <div className="text-sm font-medium">
          {data.role === 'user' ? 'You' : data.model}
        </div>
      </div>
      <div ref={contentRef}>
        {shouldShowThinkingDropdown ? (
          <ThinkingDropdown content={data.content} model={data.model} />
        ) : (
          <div className="prose max-w-none">
            <ReactMarkdown
              remarkPlugins={[RemarkGfm, RemarkMath]}
              rehypePlugins={[RehypeKatex]}
            >
              {data.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  )
}
