import { useEffect, useState } from 'react'
import type { FileInfo } from '@/lib/workspaceApi'

import { api } from '@/lib/workspaceApi'

const WorkspaceFilesManager = {
  listeners: new Set<(files: FileInfo[]) => void>(),
  currentNamespace: null as string | null,
  files: [] as FileInfo[],
  loading: false,

  subscribe(callback: (files: FileInfo[]) => void) {
    this.listeners.add(callback)
    return () => this.listeners.delete(callback)
  },

  notify() {
    this.listeners.forEach((callback) => callback(this.files))
  },

  async fetchFiles(namespaceId: string) {
    if (this.loading || this.currentNamespace === namespaceId) return

    this.loading = true
    this.currentNamespace = namespaceId

    try {
      const files = await api.listFiles(namespaceId)
      this.files = files
      this.notify()
    } catch (err) {
      console.error('Failed to fetch files:', err)
    } finally {
      this.loading = false
    }
  },
}

export function useWorkspaceFiles(namespaceId?: string) {
  const [files, setFiles] = useState<FileInfo[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!namespaceId) {
      setFiles([])
      setLoading(false)
      return
    }

    setLoading(true)
    const unsubscribe = WorkspaceFilesManager.subscribe((files) => {
      setFiles(files)
      setLoading(WorkspaceFilesManager.loading)
    })

    WorkspaceFilesManager.fetchFiles(namespaceId)

    return () => {
      unsubscribe()
    }
  }, [namespaceId])

  return { files, loading }
}

// expose a function to invalidate cache when needed (e.g. after file upload)
export function invalidateFileCache(namespaceId?: string) {
  if (namespaceId) {
    WorkspaceFilesManager.currentNamespace = null
    WorkspaceFilesManager.fetchFiles(namespaceId)
  }
}
