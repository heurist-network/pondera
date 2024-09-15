import ReactMarkdown from 'react-markdown'
import RehypeKatex from 'rehype-katex'
import RemarkGfm from 'remark-gfm'
import RemarkMath from 'remark-math'
import type { ChatItem } from '@/store/chat'

import { cn } from '@/lib/utils'

export function Content({ data }: { data: ChatItem }) {
  return (
    <div
      className={cn('self-end rounded-2xl px-4 py-3', {
        'bg-[#e4e4e3]': data.role === 'user',
        'bg-white': data.role !== 'user',
      })}
    >
      <ReactMarkdown
        className={cn('prose')}
        remarkPlugins={[RemarkGfm, RemarkMath]}
        rehypePlugins={[RehypeKatex]}
      >
        {data.content}
      </ReactMarkdown>
    </div>
  )
}
