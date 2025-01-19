'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  invalidateFileCache,
  useWorkspaceFiles,
} from '@/hooks/useWorkspaceFiles'
import { cn } from '@/lib/utils'
import { api } from '@/lib/workspaceApi'
import { useChatStore } from '@/store/chat'

export function UploadDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const { updateChat, getActiveChat, activeId } = useChatStore()
  const chat = getActiveChat(activeId)
  const { files: existingFiles } = useWorkspaceFiles(chat?.namespaceId)
  const existingFileCount = existingFiles?.length || 0

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileList = Array.from(e.target.files)
      const pdfFiles = fileList.filter(
        (file) => file.type === 'application/pdf' || file.type === 'text/plain',
      )

      if (pdfFiles.length !== fileList.length) {
        toast.error('Only PDF and text files are supported')
      }

      const oversizedFiles = pdfFiles.filter(
        (file) => file.size > 10 * 1024 * 1024,
      )
      if (oversizedFiles.length > 0) {
        toast.error('Files must be under 10MB')
        return
      }

      const existingFileNames = existingFiles?.map((f) => f.filename) || []
      const duplicateFiles = pdfFiles.filter(
        (file) =>
          existingFileNames.includes(file.name) ||
          files.some((f) => f.name === file.name),
      )
      if (duplicateFiles.length > 0) {
        toast.error(
          `Duplicate file(s): ${duplicateFiles.map((f) => f.name).join(', ')}`,
        )
        return
      }

      const totalFiles = [...files, ...pdfFiles]
      const totalCount = existingFileCount + totalFiles.length
      if (totalCount > 5) {
        toast.error('Maximum 5 files can be uploaded in total')
        const remainingSlots = Math.max(0, 5 - existingFileCount)
        setFiles(totalFiles.slice(0, remainingSlots))
        return
      }

      setFiles(totalFiles)
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleUpload = async () => {
    if (!files.length) {
      toast.error('Please select files to upload')
      return
    }

    try {
      setUploading(true)
      const chatStore = useChatStore.getState()
      const existingWorkspace = chatStore.list.find((chat) => chat.hasDocument)
      const chatId = existingWorkspace?.id || chatStore.activeId

      const response = await api.uploadDocuments(
        files,
        existingWorkspace?.namespaceId,
      )

      if (!existingWorkspace) {
        updateChat(chatId, {
          hasDocument: true,
          namespaceId: response.namespace_id,
          title: 'Workspace',
        })
        chatStore.addFilesUploadedMessage(chatId)
        invalidateFileCache(response.namespace_id)
      } else {
        invalidateFileCache(existingWorkspace.namespaceId)
      }

      toast.success('Files uploaded successfully')
      onOpenChange(false)
    } catch (error) {
      const err = error as { cause?: { code: string; description: string } }
      toast.error(
        err.cause?.code === 'WORKSPACE_LIMIT_REACHED'
          ? String(error)
          : 'Failed to upload files',
        err.cause?.code === 'WORKSPACE_LIMIT_REACHED'
          ? { description: err.cause.description, duration: 5000 }
          : undefined,
      )
    } finally {
      setUploading(false)
      setFiles([])
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Upload Documents</AlertDialogTitle>
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <span>PDF and TXT files</span>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span>10MB limit</span>
            <span className="h-1 w-1 rounded-full bg-gray-300" />
            <span>12h lifetime</span>
          </div>
        </AlertDialogHeader>

        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              'relative flex h-32 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed',
              'transition-colors hover:bg-muted/50',
              files.length > 0 ? 'border-[#4ae3f5]' : 'border-gray-200',
            )}
            onClick={() => document.getElementById('file-upload')?.click()}
            role="button"
            tabIndex={0}
            aria-label="Click to select files or drag and drop"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                document.getElementById('file-upload')?.click()
              }
            }}
          >
            <input
              id="file-upload"
              type="file"
              multiple
              accept=".pdf,.txt"
              onChange={handleFileChange}
              className="hidden"
              aria-label="File upload input"
            />
            <div className="flex flex-col items-center gap-2 text-sm text-gray-500">
              <span className="i-mingcute-upload-2-line h-6 w-6" />
              <span>Click to upload or drag and drop</span>
              <span
                className={cn(
                  'text-xs font-medium',
                  existingFileCount + files.length >= 5
                    ? 'text-red-500'
                    : 'text-[#4ae3f5]',
                )}
              >
                {existingFileCount + files.length}/5 files
              </span>
            </div>
          </div>

          {files.length > 0 && (
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-sm text-gray-500">Selected files</span>
                <button
                  onClick={() => setFiles([])}
                  className="text-xs text-gray-500 hover:text-gray-700"
                  aria-label="Clear all selected files"
                >
                  Clear all
                </button>
              </div>
              {files.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 rounded-lg bg-[#4ae3f5]/10 px-3 py-2"
                >
                  <span className="i-mingcute-file-line h-4 w-4 text-[#4ae3f5]" />
                  <span className="flex-1 truncate text-sm">{file.name}</span>
                  <span className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(i)
                    }}
                    className="text-gray-500 hover:text-gray-700"
                    aria-label={`Remove ${file.name}`}
                  >
                    <span className="i-mingcute-close-line h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={uploading}>Cancel</AlertDialogCancel>
          <Button
            onClick={handleUpload}
            disabled={!files.length || uploading}
            className="bg-[#4ae3f5] text-gray-950 hover:bg-[#4ae3f5]/90"
          >
            {uploading ? (
              <>
                <span className="i-mingcute-loading-fill mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Upload'
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
