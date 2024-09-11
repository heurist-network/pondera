import { OpenAIStream } from 'ai-stream-sdk'

import { env } from '@/env'
import { redis } from '@/lib/redis'
import { ResError } from '@/lib/response'
import { Ratelimit } from '@upstash/ratelimit'

export const runtime = 'edge'

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '1 h'),
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

    // const identifier =
    //   ((req as any).ip || req.headers.get('X-Forwarded-For')) + '-chat'

    // // ip rate limits
    // const { success } = await ratelimit.limit(identifier)
    // if (!success) {
    //   return new Response('Too Many Requests', {
    //     status: 429,
    //   })
    // }

    const response = await fetch(
      `${env.HEURIST_GATEWAY_URL}/v1/chat/completions`,
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
          max_tokens: maxTokens || 2048,
        }),
      },
    )

    const stream = OpenAIStream(response, {
      onStart: () => {
        // console.log('start')
      },
      onCompletion: (data) => {
        // console.log(data, 'data')
      },
    })

    return new Response(stream)
  } catch (error) {
    console.log(error, 'api/chat error')
    return ResError({ msg: 'api/chat error', data: error })
  }
}
