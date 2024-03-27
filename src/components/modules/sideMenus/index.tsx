'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { LOADING_STATE, useChatStore } from '@/store/chat'

export default function SideMenus({ className }: { className?: string }) {
  const [activeId, list] = useChatStore((state) => [state.activeId, state.list])
  const [value, setValue] = useState('')

  const addChat = useChatStore((state) => state.addChat)
  const deleteChat = useChatStore((state) => state.deleteChat)
  const clearChat = useChatStore((state) => state.clearChat)
  const toggleChatActive = useChatStore((state) => state.toggleChatActive)
  const updateChatName = useChatStore((state) => state.updateChatName)

  return (
    <div
      className={cn(
        'fixed bottom-0 left-0 top-0 flex w-[280px] flex-col border-r bg-sideMenu',
        className,
      )}
    >
      <div className="flex h-20 select-none items-center justify-center">
        <Image src="/logo.svg" alt="logo" width={259} height={640} />
      </div>
      <div className="flex gap-2 px-2.5">
        <Button
          size="sm"
          className="mb-2 flex-1 gap-2.5"
          onClick={() => {
            addChat()
          }}
        >
          <span className="i-mingcute-chat-2-fill h-4 w-4" />
          New Chat
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="ghost" className="hover:bg-[#c8c9ca]">
              <span className="i-f7-trash h-[18px] w-[18px]" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to clear the chat?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={clearChat}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-2.5 pb-5">
        {list.map((item) => (
          <div
            className={cn(
              'flex flex-shrink-0 items-center gap-2',
              'group relative h-9 cursor-pointer select-none rounded-md pl-3 text-sm font-medium text-[#4b4c4c] transition-colors hover:bg-sideMenuItem',
              'pr-3 hover:pr-14',
              {
                'bg-sideMenuItem': item.chat_id === activeId,
              },
            )}
            key={item.chat_id}
            onClick={() => {
              toggleChatActive(item.chat_id)
            }}
          >
            <span
              className={cn(
                'flex-shrink-0 text-base',
                item.chat_state !== LOADING_STATE.NONE
                  ? 'i-mingcute-loading-line animate-spin'
                  : 'i-mingcute-message-3-line',
              )}
            />
            <div className="truncate">{item.chat_name || 'Untitled'}</div>
            <div className="absolute right-3 opacity-0 group-hover:opacity-100">
              <div className="flex items-center gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <span
                      className="i-ri-edit-line text-base"
                      onClick={(e) => {
                        e.stopPropagation()
                        setValue(item.chat_name)
                      }}
                    />
                  </DialogTrigger>
                  <DialogContent
                    className="w-[700px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DialogHeader>
                      <DialogTitle>Edit Chat Title</DialogTitle>
                    </DialogHeader>
                    <Textarea
                      className="h-36 resize-none"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    />
                    <DialogFooter>
                      <div className="flex flex-1 justify-between">
                        <DialogClose asChild>
                          <Button variant="ghost">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button
                            onClick={() => {
                              updateChatName(item.chat_id, value)
                            }}
                          >
                            Save
                          </Button>
                        </DialogClose>
                      </div>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <span
                      className="i-f7-trash text-base"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </AlertDialogTrigger>
                  <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete the chat?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        onClick={() => deleteChat(item.chat_id)}
                      >
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex h-12 items-center justify-center gap-2 border-t border-t-zinc-300">
        <Link
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-sideMenuItem"
          href="https://github.com/heurist-network"
          target="_blank"
        >
          <span className="i-f7-logo-github" />
        </Link>
        <Link
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-sideMenuItem"
          href="https://twitter.com/heurist_ai"
          target="_blank"
        >
          <span className="i-ri-twitter-x-fill" />
        </Link>
        <Link
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-sideMenuItem"
          href="https://discord.com/invite/heuristai"
          target="_blank"
        >
          <span className="i-ri-discord-fill" />
        </Link>
      </div>
    </div>
  )
}
