import { useRef, useState } from 'react'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { ChatListItem, useChatStore } from '@/store/chat'

export function MenuItem({
  className,
  data,
}: {
  className?: string
  data: ChatListItem
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)

  // edit title
  const [isEditing, setIsEditing] = useState(false)
  const [tempTitle, setTempTitle] = useState('')

  const { toggleChat, deleteChat, updateChat, activeId } = useChatStore()

  return (
    <>
      <div
        className={cn(
          'flex h-12 cursor-pointer items-center rounded-xl px-3 font-medium transition-colors',
          !isEditing && 'hover:bg-[rgba(255,255,255,0.1)]',
          data.id === activeId &&
            !isEditing &&
            'bg-[rgba(255,255,255,0.15)] hover:bg-[rgba(255,255,255,0.2)]',
          className,
        )}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onClick={() => {
          if (isEditing) return
          toggleChat(data.id)
        }}
      >
        {isEditing ? (
          <div className="flex flex-1 items-center gap-1">
            <input
              ref={inputRef}
              type="text"
              className={cn(
                'h-7 w-full rounded-lg border-input bg-transparent px-3 focus-visible:outline-none',
                'bg-[#484850]',
              )}
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
            />
            <div
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-[rgba(255,255,255,0.2)]"
              onClick={() => {
                updateChat(data.id, { title: tempTitle })
                setIsEditing(false)
              }}
            >
              <span className="i-mingcute-check-line text-[#22c55e]" />
            </div>
            <div
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md border border-[rgba(255,255,255,0.2)]"
              onClick={() => {
                setIsEditing(false)
              }}
            >
              <span className="i-mingcute-close-line text-destructive" />
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 truncate">{data.title || 'Untitled'}</div>
            <DropdownMenu open={open} onOpenChange={setOpen}>
              <DropdownMenuTrigger className="border-none outline-none">
                <div
                  className={cn(
                    'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-[rgba(255,255,255,0.2)] transition-all',
                    visible || open ? 'flex' : 'hidden',
                  )}
                  onClick={(e) => e.stopPropagation()}
                >
                  <span className="i-mingcute-more-1-fill text-white" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[140px]"
                align="start"
                onClick={(e) => e.stopPropagation()}
              >
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => {
                      setVisible(false)
                      setIsEditing(true)
                      setTempTitle(data.title || '')
                      setTimeout(() => {
                        inputRef.current?.focus()
                      }, 100)
                    }}
                  >
                    <span className="i-mingcute-edit-4-line mr-2 h-4 w-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:bg-destructive focus:text-white"
                    onClick={() => {
                      setVisible(false)
                      setAlertOpen(true)
                    }}
                  >
                    <span className="i-mingcute-delete-2-line mr-2 h-4 w-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Chat</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this chat? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => deleteChat(data.id)}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
