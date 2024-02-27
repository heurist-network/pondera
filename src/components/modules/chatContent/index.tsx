import { MemoizedReactMarkdown } from './reactMarkdown'
import RehypeKatex from 'rehype-katex'
import RemarkBreaks from 'remark-breaks'
import RemarkGfm from 'remark-gfm'
import RemarkMath from 'remark-math'

import { cn } from '@/lib/utils'

import { CodeBlock } from './codeBlock'

export function ChatContent({ content }: { content: string }) {
  return (
    <MemoizedReactMarkdown
      className="prose max-w-[calc(100vw-136px)] dark:prose-invert md:max-w-[calc(100vw-416px)]"
      remarkPlugins={[RemarkGfm, RemarkMath, RemarkBreaks]}
      rehypePlugins={[RehypeKatex]}
      components={{
        code(props) {
          const { children, className } = props
          const match = /language-(\w+)/.exec(className || '')
          return match ? (
            <CodeBlock
              value={String(children).replace(/\n$/, '')}
              language={match[1]}
            />
          ) : (
            <code className={className}>{children}</code>
          )
        },
        table({ children }) {
          return (
            <table className="border-collapse border border-black px-3 py-1 dark:border-white">
              {children}
            </table>
          )
        },
        th({ children }) {
          return (
            <th
              className={cn(
                'break-words border border-black bg-gray-500 px-3 py-1 text-white',
                'dark:border-white/70 dark:bg-gray-700',
              )}
            >
              {children}
            </th>
          )
        },
        td({ children }) {
          return (
            <td className="break-words border border-black px-3 py-1 dark:border-white/70">
              {children}
            </td>
          )
        },
      }}
    >
      {content}
    </MemoizedReactMarkdown>
  )
}
