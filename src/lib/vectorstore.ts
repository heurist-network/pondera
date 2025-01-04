import { env } from '@/env'
import { OpenAIEmbeddings } from '@langchain/openai'
import { PineconeStore } from '@langchain/pinecone'
import { Pinecone } from '@pinecone-database/pinecone'

// initialize pinecone client
export const pinecone = new Pinecone({
  apiKey: env.PINECONE_API_KEY,
})

// create embeddings client
export const embeddings = new OpenAIEmbeddings({
  openAIApiKey: env.HEURIST_AUTH_KEY,
  modelName: 'BAAI/bge-large-en-v1.5',
  configuration: {
    baseURL: env.HEURIST_GATEWAY_URL || 'https://llm-gateway.heurist.xyz',
  },
})

// get or initialize the vector store
export async function getVectorStore() {
  return PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex: pinecone.index(env.PINECONE_INDEX),
  })
}
