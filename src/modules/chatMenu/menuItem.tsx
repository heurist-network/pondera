import { useState } from 'react'

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

export function MenuItem({ className }: { className?: string }) {
  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState(false)
  const [alertOpen, setAlertOpen] = useState(false)

  return (
    <>
      <div
        className={cn(
          'flex h-10 cursor-pointer items-center rounded-xl px-3 font-medium transition-colors hover:bg-[rgba(255,255,255,0.15)]',
          className,
        )}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        <div className="line-clamp-1">Website Redesign Discussion</div>

        <DropdownMenu open={open} onOpenChange={setOpen}>
          <DropdownMenuTrigger className="border-none outline-none">
            <div
              className={cn(
                'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-gray-50 transition-all',
                visible || open ? 'flex' : 'hidden',
              )}
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <span className="i-mingcute-more-1-fill text-gray-950" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[140px]" align="start">
            <DropdownMenuGroup
              onSelect={() => {
                console.log(21412)
              }}
            >
              <DropdownMenuItem
                onClick={() => {
                  setVisible(false)
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
      </div>
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive">
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
