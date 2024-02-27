import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

import { useClipboard } from '@/hooks/useClipboard'
import { cn } from '@/lib/utils'

function CopyToClipboard({ content }: { content: string }) {
  const { isCopied, copy } = useClipboard()

  const onCopy = () => {
    if (isCopied) return
    copy(content)
  }

  return (
    <div
      className={cn(
        'opacity-0 transition-all group-hover/codeblock:opacity-100',
        'absolute right-3 top-11 box-content flex h-4 w-4 cursor-pointer items-center justify-center rounded-md p-1.5',
        'border border-white/10 bg-[#33424d] text-[rgb(156,163,175)] hover:text-[rgb(249,250,251)]',
      )}
      onClick={onCopy}
    >
      <span
        className={cn('h-4 w-4', {
          'i-mingcute-copy-2-line': !isCopied,
          'i-mingcute-check-line': isCopied,
        })}
      />
    </div>
  )
}

export function CodeBlock({
  language,
  value,
}: {
  language: string
  value: string
}) {
  return (
    <div className="codeblock group/codeblock relative">
      <div className="bg-[#2d3c47] px-4 py-2 text-xs leading-[18px]">
        <div className="capitalize">{language}</div>
      </div>
      <CopyToClipboard content={value} />
      <SyntaxHighlighter
        style={oneDark}
        language={language}
        PreTag="div"
        customStyle={{
          margin: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      >
        {value}
      </SyntaxHighlighter>
    </div>
  )
}
