'use client'

import { User } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

import { MenuItem } from './menuItem'

export function ChatMenu() {
  return (
    <div className="flex w-full flex-1 flex-col">
      <div className="mx-3 mb-4 flex h-12 flex-shrink-0 cursor-pointer items-center gap-2 rounded-xl bg-[#01E3F5] px-3 font-medium text-gray-950 transition-colors hover:bg-[#01E3F5]/90">
        <span className="i-f7-plus text-sm" />
        New Chat
      </div>
      <ScrollArea
        className="h-[calc(100dvh-270px)] w-full px-3 text-white"
        scrollHideDelay={0}
      >
        <div className="flex flex-col gap-1">
          {Array.from({ length: 40 }).map((_, index) => {
            if (index === 0) {
              return (
                <div
                  key={0}
                  className="flex h-10 items-center gap-2.5 px-3 text-xs text-[rgba(255,255,255,0.45)]"
                >
                  <div>Day</div>
                  <div className="flex-1 border-t border-dashed border-t-[rgba(255,255,255,0.45)]" />
                </div>
              )
            }

            if (index === 4) {
              return (
                <div
                  key={4}
                  className="flex h-10 items-center gap-2.5 px-3 text-xs text-[rgba(255,255,255,0.45)]"
                >
                  <div>Yesterday</div>
                  <div className="flex-1 border-t border-dashed border-t-[rgba(255,255,255,0.45)]" />
                </div>
              )
            }

            if (index === 10) {
              return (
                <div
                  key={10}
                  className="flex h-10 items-center gap-2.5 px-3 text-xs text-[rgba(255,255,255,0.45)]"
                >
                  <div>4 days ago</div>
                  <div className="flex-1 border-t border-dashed border-t-[rgba(255,255,255,0.45)]" />
                </div>
              )
            }

            return (
              <MenuItem
                key={index}
                className={cn({
                  'bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.25)]':
                    index === 2,
                })}
              />
            )

            return (
              <div
                key={index}
                className={cn(
                  'flex h-10 cursor-pointer items-center rounded-xl px-3 font-medium transition-colors hover:bg-[rgba(255,255,255,0.15)]',
                  {
                    'bg-[rgba(255,255,255,0.2)] hover:bg-[rgba(255,255,255,0.25)]':
                      index === 2,
                  },
                )}
                onClick={() => {
                  console.log(1111)
                }}
                onMouseEnter={() => {
                  console.log('进来了')
                }}
                onMouseLeave={() => {
                  console.log('出去了')
                }}
              >
                <div className="line-clamp-1">
                  Exploring Our Design Services Exploring Our Design Services
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <div
                      className={cn(
                        'flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md bg-gray-50 transition-all',
                        'hidden group-hover:flex',
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        console.log(2222)
                      }}
                    >
                      <span className="i-mingcute-more-1-fill text-gray-950" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuGroup>
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
