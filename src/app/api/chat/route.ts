import { OpenAIStream } from 'ai-stream-sdk'

import { env } from '@/env.mjs'
import { redis } from '@/lib/redis'
import { ResError } from '@/lib/response'
// import { stream } from '@/lib/stream'
import { Ratelimit } from '@upstash/ratelimit'

export const runtime = 'edge'

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, '1 h'),
  analytics: true,
})

export async function POST(req: Request) {
  try {
    const {
      messages,
      modelId,
      temperature,
      maxTokens,
      stream: useStream,
    } = await req.json()

    const identifier = (req as any).ip || req.headers.get('X-Forwarded-For')

    console.log('---------------------------------')
    console.log('\n\n')
    console.log(messages, 'messages')
    console.log('\n\n')
    console.log('---------------------------------')

    // ip rate limits
    const { success } = await ratelimit.limit(identifier)
    if (!success) {
      return new Response('Too Many Requests', {
        status: 429,
      })
    }

    const response = await fetch(
      'https://llm-gateway.heurist.xyz/v1/chat/completions',
      {
        headers: {
          Authorization: `Bearer ${env.HEURIST_AUTH_KEY}`,
        },
        method: 'POST',
        body: JSON.stringify({
          model: modelId,
          stream: useStream || false,
          messages,
          temperature: temperature || 0.75,
          max_tokens: maxTokens || 4000,
        }),
      },
    )

    const stream = OpenAIStream(response)

    return new Response(stream)

    // const { readable, writable } = new TransformStream()

    // stream(response.body as ReadableStream, writable)

    // return new Response(readable, {
    //   ...response,
    //   headers: {
    //     'Content-Type': 'text/event-stream',
    //   },
    // })
  } catch (error) {
    console.log(error, 'api/chat error')
    return ResError({ msg: 'api/chat error', data: error })
  }
}
