'use client'

import { useState } from 'react'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useWorkspaceFiles } from '@/hooks/useWorkspaceFiles'
import { cn } from '@/lib/utils'
import { useChatStore } from '@/store/chat'

import { UploadDialog } from './uploadDialog'

export function FileListDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { getActiveChat, activeId } = useChatStore()
  const chat = getActiveChat(activeId)
  const { files, loading } = useWorkspaceFiles(chat?.namespaceId)
  const fileCount = files?.length || 0
  const [uploadOpen, setUploadOpen] = useState(false)

  const handleUploadClick = () => {
    onOpenChange(false)
    setUploadOpen(true)
  }

  return (
    <>
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <AlertDialogTitle className="text-xl">
                  Workspace Files
                </AlertDialogTitle>
              </div>
              <button
                onClick={() => onOpenChange(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100"
              >
                <span className="i-mingcute-close-line h-4 w-4" />
              </button>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4ae3f5]/10">
                  <span className="i-mingcute-folder-fill h-5 w-5 text-[#4ae3f5]" />
                </div>
                <div>
                  <div className="text-sm font-medium">Current workspace</div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{fileCount} of 5 files uploaded</span>
                    <span className="h-1 w-1 rounded-full bg-gray-300" />
                    <span>12h lifetime</span>
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs"
                onClick={(e) => e.preventDefault()}
                disabled
              >
                <span className="i-mingcute-add-line h-4 w-4" />
                Add files
              </Button>
            </div>
          </AlertDialogHeader>

          <ScrollArea className="h-[350px] w-full pr-4">
            <div className="space-y-2.5">
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <span className="i-mingcute-loading-fill h-5 w-5 animate-spin text-gray-500" />
                </div>
              ) : (
                files?.map((file, index) => (
                  <div
                    key={index}
                    className={cn(
                      'group relative flex items-center justify-between rounded-lg border p-3 transition-all',
                      'hover:border-[#4ae3f5] hover:shadow-sm',
                      'border-gray-100 bg-white',
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className="i-mingcute-file-fill h-5 w-5 text-[#4ae3f5]" />
                      <div>
                        <div className="flex items-center gap-2">
                          <div className="line-clamp-1 text-sm font-medium">
                            {file.url ? (
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="transition-all hover:text-[#4ae3f5]"
                              >
                                {file.filename}
                              </a>
                            ) : (
                              file.filename
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </AlertDialogContent>
      </AlertDialog>
      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />
    </>
  )
}
