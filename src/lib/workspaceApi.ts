import { env } from '@/env'

const API_BASE = env.NEXT_PUBLIC_BACKEND_URL

export type UploadResponse = {
  message: string
  namespace_id: string
  code?: string
  description?: string
  document_responses: Array<{
    document: {
      document_id: string
      document_url: string
      chunks: Array<{
        id: string
        values: number[]
        text: string
        metadata: {
          text: string
          source: string
        }
      }>
    }
  }>
}

export type FileInfo = {
  documentId: string
  filename: string
  url: string
  size: number
  lastModified: string
}

export type DocumentChunk = {
  metadata: {
    text: string
    source?: string
  }
}

export const api = {
  uploadDocuments: async (
    files: File[],
    namespaceId?: string,
  ): Promise<UploadResponse> => {
    const formData = new FormData()
    files.forEach((file) => formData.append('files', file))

    const url = namespaceId
      ? `${API_BASE}/documents/add?namespace_id=${namespaceId}`
      : `${API_BASE}/documents/add`

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    })

    const data = await response.json()
    if (!response.ok) {
      if (data.code === 'WORKSPACE_LIMIT_REACHED') {
        throw new Error(data.message, {
          cause: {
            code: data.code,
            description: data.description,
          },
        })
      }
      throw new Error(data.message || 'Failed to upload documents')
    }

    return data
  },

  listFiles: async (namespaceId: string): Promise<FileInfo[]> => {
    const response = await fetch(`${API_BASE}/documents/files/${namespaceId}`)

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to list files')
    }

    return response.json()
  },

  deleteWorkspace: async (namespaceId: string): Promise<void> => {
    const response = await fetch(
      `${API_BASE}/documents/workspace/${namespaceId}`,
      { method: 'DELETE' },
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to delete workspace')
    }
  },

  getDocumentContext: async (
    query: string,
    namespaceId: string,
    topK: number = 7,
    minScore: number = 0.15,
  ): Promise<DocumentChunk[]> => {
    const response = await fetch(`${API_BASE}/documents/context`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        namespace: namespaceId,
        top_k: topK,
        min_score: minScore,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to get document context')
    }

    return response.json()
  },

  processPdf: async (file: File): Promise<void> => {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(`${API_BASE}/pdf/process`, {
      method: 'POST',
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to process PDF')
    }
  },
}
