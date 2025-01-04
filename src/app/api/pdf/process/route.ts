import { WebPDFLoader } from 'langchain/document_loaders/web/pdf'
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'
import { nanoid } from 'nanoid'
import { NextResponse } from 'next/server'

import { env } from '@/env'
import { embeddings, pinecone } from '@/lib/vectorstore'

function cleanText(text: string): string {
  return text
    .replace(/\x00/g, '') // remove null bytes
    .replace(/[\x00-\x09\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g, '') // remove control chars
    .replace(/\s+/g, ' ') // normalize whitespace
    .trim()
}

export const runtime = 'edge'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const fileId = nanoid()
    const arrayBuffer = await file.arrayBuffer()
    const blob = new Blob([arrayBuffer], { type: 'application/pdf' })

    // use langchain pdf loader (web version)
    const loader = new WebPDFLoader(blob)
    const docs = await loader.load()

    // split into chunks using recommended settings
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    })

    const chunks = await splitter.splitDocuments(docs)

    // process chunks in parallel batches of 5
    const batchSize = 5
    const vectors = []

    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize)
      const batchPromises = batch.map(async (chunk) => {
        const cleanedText = cleanText(chunk.pageContent)
        const [embedding] = await embeddings.embedDocuments([cleanedText])

        return {
          id: nanoid(),
          values: embedding,
          metadata: {
            text: cleanedText,
            fileId,
            fileName: file.name,
            pageNumber: chunk.metadata.loc?.pageNumber || null,
          },
        }
      })

      const batchResults = await Promise.all(batchPromises)
      vectors.push(...batchResults)
    }

    // store vectors in pinecone
    const index = pinecone.index(env.PINECONE_INDEX)
    await index.upsert(vectors)

    return NextResponse.json({
      fileId,
      chunks: vectors.length,
    })
  } catch (error) {
    console.error('PDF processing error:', error)
    return NextResponse.json(
      { error: 'Failed to process PDF' },
      { status: 500 },
    )
  }
}
