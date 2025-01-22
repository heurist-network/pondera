'use client'

import { useMemo, useRef } from 'react'

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
import { ScrollArea } from '@/components/ui/scroll-area'
import { ChatListItem, useChatStore } from '@/store/chat'

import { MenuItem } from './menuItem'

export function ChatMenu() {
  const { list, addChat, clearChat } = useChatStore()
  const viewportRef = useRef<HTMLDivElement>(null)

  const calcList = useMemo(() => {
    const today = new Date()
    const todayEnd = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999,
    )

    const groups: {
      '0': ChatListItem[]
      '1': ChatListItem[]
      '2': ChatListItem[]
      '3': ChatListItem[]
      '4': ChatListItem[]
      '5': ChatListItem[]
      '6': ChatListItem[]
      '7': ChatListItem[]
    } = {
      '0': [],
      '1': [],
      '2': [],
      '3': [],
      '4': [],
      '5': [],
      '6': [],
      '7': [],
    }

    list.forEach((item) => {
      const date = new Date(item.updatedAt!)
      const diffTime = todayEnd.getTime() - date.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 0) {
        groups[0].push(item)
      } else if (diffDays === 1) {
        groups[1].push(item)
      } else if (diffDays === 2) {
        groups[2].push(item)
      } else if (diffDays === 3) {
        groups[3].push(item)
      } else if (diffDays === 4) {
        groups[4].push(item)
      } else if (diffDays === 5) {
        groups[5].push(item)
      } else if (diffDays === 6) {
        groups[6].push(item)
      } else if (diffDays >= 7) {
        groups[7].push(item)
      }
    })

    return groups
  }, [list])

  const renderChatList = () => {
    if (!list.length) return null

    // separate workspace chat
    const workspace = list.find((chat) => chat.hasDocument)

    return (
      <div className="flex flex-col">
        {/* workspace chat always at top */}
        {workspace && <MenuItem data={workspace} />}

        {/* day-grouped regular chats below */}
        {Object.entries(calcList).map(([key, chats]) => {
          if (chats.length === 0) return null

          const dayLabel =
            key === '0'
              ? 'Today'
              : key === '1'
                ? 'Yesterday'
                : key === '7'
                  ? '1 week ago'
                  : `${key} days ago`

          const filteredChats = chats.filter((chat) => !chat.hasDocument)
          if (filteredChats.length === 0) return null

          return (
            <div key={key}>
              <div className="flex h-12 items-center gap-2.5 px-3 text-xs font-semibold text-[rgba(255,255,255,0.35)]">
                {dayLabel}
              </div>
              {filteredChats
                .sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0))
                .map((chat) => (
                  <MenuItem key={chat.id} data={chat} />
                ))}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="group/menu flex w-full flex-1 flex-col">
      <div
        className="mx-3 mb-4 flex h-12 flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-xl bg-[#01E3F5] px-3 text-sm font-medium text-gray-950 transition-colors hover:bg-[#01E3F5]/90"
        onClick={() => {
          addChat()
          viewportRef.current?.scrollTo({ top: 0 })
        }}
      >
        <span className="i-f7-plus h-[18px] w-[18px]" />
        New Chat
      </div>
      <div className="px-3">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <div className="group/clear flex h-8 cursor-pointer flex-row items-center px-3">
              <div className="h-[1px] flex-1 bg-white/10" />
              <div className="hidden px-2.5 text-xs font-semibold text-[rgba(255,255,255,0.35)] transition-colors group-hover/menu:block group-hover/clear:text-white">
                Clear
              </div>
              <div className="h-[1px] flex-1 bg-white/10" />
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Clear all chats?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={clearChat}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <ScrollArea
        viewportRef={viewportRef}
        className="h-[calc(100dvh-302px)] w-full px-3 text-white"
        scrollHideDelay={0}
      >
        <div className="flex w-full flex-col">{renderChatList()}</div>
      </ScrollArea>
    </div>
  )
}
