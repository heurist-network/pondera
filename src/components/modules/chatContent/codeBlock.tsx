import React from 'react'
import { Prism } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { GeistSans } from 'geist/font/sans'

import { useCopy } from '@/hooks/useCopy'
import { cn } from '@/lib/utils'

export function CodeBlock({
  language,
  value,
}: {
  language: string
  value: string
}) {
  const [isCopied, copy] = useCopy()

  return (
    <div
      className={cn('codeblock group/codeblock relative', GeistSans.className)}
    >
      <div className="flex h-9 items-center justify-between border-b border-b-[#ebeaeb] bg-[#fafafa] px-4 text-xs leading-[18px] text-[#666666]">
        <div className="capitalize">{language}</div>
        <div
          className="flex cursor-pointer items-center rounded-sm p-1.5 transition-colors hover:bg-gray-200"
          onClick={() => copy(value)}
        >
          {isCopied ? (
            <span className="i-mingcute-check-line h-4 w-4 !bg-green-400" />
          ) : (
            <span className="i-mingcute-copy-2-line h-4 w-4 !bg-muted-foreground" />
          )}
        </div>
      </div>
      <Prism
        style={oneLight}
        language={language}
        customStyle={{
          background: '#fff',
          margin: 0,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      >
        {value}
      </Prism>
    </div>
  )
}
