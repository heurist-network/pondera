'use client'

import { useState } from 'react'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
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
  const fileCount = chat?.files?.length || 0
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
                <AlertDialogDescription className="mt-1.5">
                  Files uploaded to this workspace that you can chat with
                </AlertDialogDescription>
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
                  <div className="text-xs text-gray-500">
                    {fileCount} of 5 files uploaded
                  </div>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 text-xs"
                onClick={handleUploadClick}
              >
                <span className="i-mingcute-add-line h-4 w-4" />
                Add files
              </Button>
            </div>
          </AlertDialogHeader>

          <ScrollArea className="h-[350px] w-full pr-4">
            <div className="space-y-2.5">
              {chat?.files?.map((file, index) => (
                <div
                  key={index}
                  className={cn(
                    'group relative flex items-center justify-between rounded-lg border p-3 transition-all',
                    'hover:border-[#4ae3f5] hover:shadow-sm',
                    'border-gray-100 bg-white',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#4ae3f5]/10">
                      <span className="i-mingcute-file-fill h-5 w-5 text-[#4ae3f5]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <div className="line-clamp-1 text-sm font-medium">
                          {file.url ? (
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-[#4ae3f5] hover:underline"
                            >
                              {file.name}
                            </a>
                          ) : (
                            file.name
                          )}
                        </div>
                        <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium uppercase text-gray-500">
                          {file.name.split('.').pop()}
                        </span>
                      </div>
                      <div className="mt-0.5 text-xs text-gray-500">
                        Added {new Date().toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {file.url && (
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 opacity-0 transition-opacity hover:bg-gray-50 hover:text-gray-600 group-hover:opacity-100"
                      aria-label={`Download ${file.name}`}
                    >
                      <span className="i-mingcute-download-3-line h-4 w-4" />
                    </a>
                  )}
                </div>
              ))}
              {(!chat?.files || chat.files.length === 0) && (
                <div className="flex flex-col items-center gap-3 py-16">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100">
                    <span className="i-mingcute-folder-line h-7 w-7 text-gray-400" />
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">
                      No files uploaded yet
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      Upload up to 5 PDF or TXT files to start chatting with
                      them
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={handleUploadClick}
                  >
                    Upload files
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </AlertDialogContent>
      </AlertDialog>

      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />
    </>
  )
}
