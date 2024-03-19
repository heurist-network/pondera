import { Prism } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { GeistSans } from 'geist/font/sans'

import { CopyContent } from '@/components/modules/copy'
import { cn } from '@/lib/utils'

export function CodeBlock({
  language,
  value,
}: {
  language: string
  value: string
}) {
  return (
    <div
      className={cn('codeblock group/codeblock relative', GeistSans.className)}
    >
      <div className="flex h-9 items-center justify-between border-b border-b-[#ebeaeb] bg-[#fafafa] px-4 text-xs leading-[18px] text-[#666666]">
        <div className="capitalize">{language}</div>
        <CopyContent value={value} />
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
