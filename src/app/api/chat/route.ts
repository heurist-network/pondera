import { OpenAIStream } from 'ai-stream-sdk'

import { env } from '@/env'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const { messages, modelId, temperature, maxTokens, hasDocument } =
      await req.json()

    const lastMessage = messages[messages.length - 1]

    // prepare messages
    let promptMessages = messages

    // only get context if document is uploaded in current chat
    if (hasDocument) {
      // prepare request body
      const requestBody = JSON.stringify({
        query: lastMessage.content,
        chatHistory: messages.slice(-4),
      })

      // get context from flask backend
      const contextResponse = await fetch(`${env.FLASK_API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestBody).toString(),
        },
        body: requestBody,
      })

      if (!contextResponse.ok) {
        throw new Error('Failed to get context')
      }

      const { context } = await contextResponse.json()
      promptMessages = [
        ...messages.slice(0, -1),
        {
          role: 'system',
          content: context,
        },
        lastMessage,
      ].filter((msg) => msg.content)
    }

    // prepare openai request body
    const openaiBody = JSON.stringify({
      model: modelId,
      stream: true,
      messages: promptMessages,
      temperature: temperature || 0.75,
      max_tokens: maxTokens || 2048,
    })

    const response = await fetch(
      `${env.HEURIST_GATEWAY_URL}/v1/chat/completions`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.HEURIST_AUTH_KEY}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(openaiBody).toString(),
        },
        body: openaiBody,
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
