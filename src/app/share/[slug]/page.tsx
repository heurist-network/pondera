import ReactMarkdown from 'react-markdown'
import { format } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import RehypeKatex from 'rehype-katex'
import RemarkGfm from 'remark-gfm'
import RemarkMath from 'remark-math'
import type { ChatItem } from '@/store/chat'
import type { Metadata } from 'next'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { db } from '@/db'
import { cn } from '@/lib/utils'
import { CopyContent } from '@/modules/chatList/messageList/copyContent'

function Content({ data }: { data: ChatItem }) {
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

type Props = Promise<{ slug: string }>

export async function generateMetadata(props: {
  params: Props
}): Promise<Metadata> {
  const params = await props.params

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res: any = await db.query.share.findFirst({
    where: (share, { eq }) => eq(share.id, params.slug),
  })

  return {
    title: res.name || 'Untitled',
    description:
      'Pondera is an open-source conversational AI assistant that makes the best language models available to everyone. Powered by Heurist.',
  }
}

export default async function Share(props: { params: Props }) {
  const params = await props.params

  if (!params.slug) notFound()

  const res = await db.query.share.findFirst({
    where: (share, { eq }) => eq(share.id, params.slug),
  })

  if (!res) notFound()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const list = (res.list as any[]).map((item) => ({
    ...item,
    model: item.model || res.model,
  }))

  const getModelIcon = (model: string) => {
    if (!model) return ''

    let icon = ''

    if (model.startsWith('mistralai') || model.startsWith('openhermes')) {
      icon = '/model/mistral.svg'
    }
    if (model.includes('deepseek')) {
      icon = '/model/deepseek.png'
    }
    if (model.includes('llama') || model.includes('Llama')) {
      icon = '/model/llama.jpeg'
    }
    if (model.includes('-yi-')) {
      icon = '/model/yi.svg'
    }

    return icon
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-[#F7F7F6] pb-10">
        <div
          className={cn(
            'mx-auto max-w-3xl border-b border-gray-200 px-4',
            'pb-4 pt-3 sm:mb-2 sm:pb-6 sm:pt-8',
          )}
        >
          <div className="text-token-text-primary text-3xl font-semibold leading-tight sm:text-4xl">
            {res.name || 'Pondera Chat Share'}
          </div>
          <div className="flex items-center justify-between pt-3 sm:pt-4">
            <div className="text-base text-gray-400">
              {format(new Date(res.createAt), 'MM/dd/yyyy')}
            </div>
            <Link href="/">
              <Button
                className="gap-1 rounded-[10px]"
                variant="outline"
                size="sm"
              >
                <span className="i-mingcute-arrow-left-line" />
                Back home
              </Button>
            </Link>
          </div>
        </div>
        {list.map((item, index) => {
          if (item.role === 'system') return null

          return (
            <div
              key={item.id}
              className={cn('group mx-auto max-w-3xl px-4 pb-5', {
                'pt-5': index === 0,
              })}
            >
              <div
                className={cn(
                  'flex gap-3',
                  item.role === 'user' ? 'flex-row-reverse' : 'flex-row',
                )}
              >
                {item.role !== 'user' && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Image
                          src={getModelIcon(item.model)}
                          alt="model"
                          width={32}
                          height={32}
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.model}</p>
                    </TooltipContent>
                  </Tooltip>
                )}
                <div
                  className={cn(
                    'flex flex-col items-end md:gap-2',
                    item.role === 'user'
                      ? 'md:flex-row-reverse'
                      : 'md:flex-row',
                  )}
                >
                  <Content data={item} />
                  <TooltipProvider>
                    <div
                      className={cn(
                        'flex opacity-0 transition-opacity group-hover:opacity-100',
                        item.role === 'user' ? 'justify-end' : 'justify-start',
                      )}
                    >
                      <div className="mt-2 rounded-[10px] bg-white p-1">
                        <CopyContent content={item.content} />
                      </div>
                    </div>
                  </TooltipProvider>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </TooltipProvider>
  )
}
