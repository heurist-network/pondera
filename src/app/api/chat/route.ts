import { OpenAIStream } from 'ai-stream-sdk'

import { env } from '@/env'
import { api } from '@/lib/workspaceApi'

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const {
      messages,
      modelId,
      temperature,
      maxTokens,
      hasDocument,
      namespaceId,
    } = await req.json()

    const lastMessage = messages[messages.length - 1]

    // prepare messages
    let promptMessages = messages

    // only get context if document is uploaded in current chat
    if (hasDocument && namespaceId) {
      try {
        // Get context from backend
        const chunks = await api.getDocumentContext(
          lastMessage.content,
          namespaceId,
        )

        // Add context to system message
        if (chunks.length > 0) {
          const context = `Here are relevant excerpts from the documents:

${chunks
  .map((chunk, index) => `[Excerpt ${index + 1}]\n${chunk.metadata.text}`)
  .join('\n\n')}

Instructions:
1. Use ONLY the information from these excerpts to answer the question.
2. If the answer cannot be found in these excerpts, clearly state so. DO NOT make up an answer.
3. Consider all excerpts and synthesize a complete answer using the available information.`

          console.log('context', context)
          promptMessages = [
            ...messages.slice(0, -1),
            {
              role: 'system',
              content: context,
            },
            lastMessage,
          ].filter((msg) => msg.content)
        }
      } catch (error) {
        console.error('Context fetch failed:', error)
        throw new Error('Failed to get context')
      }
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
      `${env.HEURIST_GATEWAY_URL}/chat/completions`,
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
