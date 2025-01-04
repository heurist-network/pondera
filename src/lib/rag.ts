import { useChatStore } from '@/store/chat'

import { getVectorStore } from './vectorstore'

// system prompt template for qa
const QA_TEMPLATE = `You are an enthusiastic AI assistant. Use the following pieces of context to answer the question at the end.
If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.

{context}

Question: {question}
Helpful answer in markdown:`

export async function getRelevantContext(query: string, topK = 3) {
  try {
    // get vector store instance
    const vectorStore = await getVectorStore()

    // similarity search
    const results = await vectorStore.similaritySearch(query, topK)

    // format context
    if (results.length === 0)
      return QA_TEMPLATE.replace(
        '{context}',
        'No relevant context found.',
      ).replace('{question}', query)

    // filter out duplicate passages based on content
    const uniqueResults = results.filter(
      (doc, index) =>
        results.findIndex((d) => d.pageContent === doc.pageContent) === index,
    )

    const formattedPassages = uniqueResults.map((doc, i) => {
      const metadata = doc.metadata as {
        fileName?: string
        pageNumber?: number
      }
      const source = metadata.fileName
        ? `[Source: ${metadata.fileName}${
            metadata.pageNumber ? `, Page ${metadata.pageNumber}` : ''
          }]`
        : ''
      return `Passage ${i + 1} ${source}:\n${doc.pageContent}`
    })

    // get recent chat history
    const chatStore = useChatStore.getState()
    const activeChat = chatStore.getActiveChat(chatStore.activeId)
    const recentMessages =
      activeChat?.list
        .slice(-4) // get last 4 messages
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join('\n') || ''

    // format full context with chat history and passages
    const context = `${recentMessages ? `Recent conversation:\n${recentMessages}\n\n` : ''}Relevant passages from documents:\n\n${formattedPassages.join('\n\n')}`

    return QA_TEMPLATE.replace('{context}', context).replace(
      '{question}',
      query,
    )
  } catch (error) {
    console.error('Error getting relevant context:', error)
    return QA_TEMPLATE.replace(
      '{context}',
      'Error retrieving context.',
    ).replace('{question}', query)
  }
}
