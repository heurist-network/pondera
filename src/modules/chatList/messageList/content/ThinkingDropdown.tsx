import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import RehypeKatex from 'rehype-katex'
import RemarkGfm from 'remark-gfm'
import RemarkMath from 'remark-math'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'

interface Props {
  content: string
}

export function ThinkingDropdown({ content }: Props) {
  const [thinkingContent, setThinkingContent] = useState('')
  const [answerContent, setAnswerContent] = useState('')
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    const thinkingMatch = content.match(/<thinking>([\s\S]*?)<\/thinking>/)
    if (thinkingMatch) {
      setThinkingContent(thinkingMatch[1].trim())
    }

    const answerMatch = content.match(/<answer>([\s\S]*?)<\/answer>/)
    if (answerMatch) {
      setAnswerContent(answerMatch[1].trim())
      // auto-hide thinking process when answer starts
      setIsOpen(false)
    }
  }, [content])

  return (
    <div className="flex flex-col gap-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-lg bg-white px-3 py-2 text-left text-sm font-medium hover:bg-gray-100">
          <span className="i-mingcute-brain-line h-4 w-4" />
          View thinking process ({thinkingContent ? '✓' : '✗'})
          <span className="i-mingcute-down-line ml-auto h-4 w-4" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="prose mt-2 max-w-none rounded-lg bg-white p-4">
            <ReactMarkdown
              remarkPlugins={[RemarkGfm, RemarkMath]}
              rehypePlugins={[RehypeKatex]}
            >
              {thinkingContent}
            </ReactMarkdown>
          </div>
        </CollapsibleContent>
      </Collapsible>
      {answerContent && (
        <div className="prose max-w-none">
          <ReactMarkdown
            remarkPlugins={[RemarkGfm, RemarkMath]}
            rehypePlugins={[RehypeKatex]}
          >
            {answerContent}
          </ReactMarkdown>
        </div>
      )}
    </div>
  )
}
