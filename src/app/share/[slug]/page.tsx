import { MemoizedReactMarkdown } from '@/components/modules/chatContent/reactMarkdown'
import { Prism } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { GeistSans } from 'geist/font/sans'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import RehypeKatex from 'rehype-katex'
import RemarkBreaks from 'remark-breaks'
import RemarkGfm from 'remark-gfm'
import RemarkMath from 'remark-math'
import type { Metadata } from 'next'

import { Button } from '@/components/ui/button'
import { db } from '@/db'
import { cn } from '@/lib/utils'

type Props = {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const res: any = await db.query.share.findFirst({
    where: (share, { eq }) => eq(share.id, params.slug),
  })

  return {
    title: res.name || 'Untitled',
    description:
      'Pondera is an open-source conversational AI assistant that makes the best language models available to everyone. Powered by Heurist.',
  }
}

function CodeBlock({ language, value }: { language: string; value: string }) {
  return (
    <div
      className={cn('codeblock group/codeblock relative', GeistSans.className)}
    >
      <div className="flex h-9 items-center justify-between border-b border-b-[#ebeaeb] bg-[#fafafa] px-4 text-xs leading-[18px] text-[#666666]">
        <div className="capitalize">{language}</div>
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

export default async function Share({ params }: { params: { slug: string } }) {
  if (!params.slug) notFound()

  const res = await db.query.share.findFirst({
    where: (share, { eq }) => eq(share.id, params.slug),
  })
  if (!res) notFound()

  return (
    <div className="container max-w-3xl pt-5">
      <div className="flex h-14 items-center justify-between">
        <div className="text-3xl font-bold">Pondera Share</div>
        <Link href="/">
          <Button size="sm" className="gap-1 rounded-lg" variant="outline">
            <span className="i-mingcute-arrow-left-line" />
            Back home
          </Button>
        </Link>
      </div>
      <h3 className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight">
        {res.name}
      </h3>
      <div className="mt-2 border-l-4 border-l-amber-500 pl-2 text-sm">
        {res.model}
      </div>
      <div className="my-5 flex flex-col gap-4">
        {(res.list as any[]).map((item) => (
          <div
            key={item.id}
            className={cn(
              'max-w-[125ch] rounded-xl px-4 py-2',
              item.role === 'user'
                ? 'self-end bg-blue-200/70'
                : 'self-start bg-neutral-100',
            )}
          >
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
              {item.content}
            </MemoizedReactMarkdown>
          </div>
        ))}
      </div>
    </div>
  )
}
