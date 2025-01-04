import { OpenAIStream } from 'ai-stream-sdk'

import { env } from '@/env'
import { getRelevantContext } from '@/lib/rag'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { messages, modelId, temperature, maxTokens } = await req.json()

    const lastMessage = messages[messages.length - 1]

    // get relevant context using langchain rag
    const context = await getRelevantContext(lastMessage.content)

    // prepare messages with context
    const promptMessages = [
      ...messages.slice(0, -1),
      {
        role: 'system',
        content: context,
      },
      lastMessage,
    ].filter((msg) => msg.content)

    const response = await fetch(
      `${env.HEURIST_GATEWAY_URL}/v1/chat/completions`,
      {
        headers: {
          Authorization: `Bearer ${env.HEURIST_AUTH_KEY}`,
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          model: modelId,
          stream: true,
          messages: promptMessages,
          temperature: temperature || 0.75,
          max_tokens: maxTokens || 2048,
        }),
      },
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to generate response')
    }

    const stream = OpenAIStream(response, {
      onStart: () => {},
      onCompletion: () => {},
    })

    return new Response(stream)
  } catch (error) {
    console.error('Chat error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to generate response' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
