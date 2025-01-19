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

const TAGS = {
  THINKING: {
    START: '<thinking>',
    END: '</thinking>',
  },
  ANSWER: {
    START: '<answer>',
    END: '</answer>',
  },
} as const

interface Props {
  content: string
}

export function ThinkingDropdown({ content }: Props) {
  const [thinkingContent, setThinkingContent] = useState('')
  const [answerContent, setAnswerContent] = useState('')
  const [isOpen, setIsOpen] = useState(true)
  const [hasThinkingTags, setHasThinkingTags] = useState(false)

  useEffect(() => {
    if (!content) {
      setThinkingContent('')
      setAnswerContent('')
      setIsOpen(true)
      setHasThinkingTags(false)
      return
    }

    const thinkingStart = content.indexOf(TAGS.THINKING.START)
    const thinkingEnd = content.indexOf(TAGS.THINKING.END)
    const answerStart = content.indexOf(TAGS.ANSWER.START)
    const answerEnd = content.indexOf(TAGS.ANSWER.END)

    // if no tags are found, display content as-is in the answer section
    if (thinkingStart === -1 && answerStart === -1) {
      setAnswerContent(content.trim())
      setThinkingContent('')
      setIsOpen(false)
      setHasThinkingTags(false)
      return
    }

    setHasThinkingTags(true)

    // update thinking content if we have a start tag
    if (thinkingStart !== -1) {
      const startIndex = thinkingStart + TAGS.THINKING.START.length
      const currentThinking =
        thinkingEnd === -1
          ? content.slice(startIndex)
          : content.slice(startIndex, thinkingEnd)
      setThinkingContent(currentThinking.trim())
    }

    // update answer content if we have a start tag
    if (answerStart !== -1) {
      const startIndex = answerStart + TAGS.ANSWER.START.length
      const currentAnswer =
        answerEnd === -1
          ? content.slice(startIndex)
          : content.slice(startIndex, answerEnd)
      setAnswerContent(currentAnswer.trim())
      setIsOpen(false) // auto-collapse thinking when answer starts
    }
  }, [content])

  return (
    <div className="flex flex-col gap-4">
      {hasThinkingTags && thinkingContent && (
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
      )}
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
