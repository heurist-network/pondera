'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { useChatStore } from '@/store/chat'

import SideMenus from '../sideMenus'

function getModelIcon(name?: string) {
  if (name?.startsWith('openhermes-2-yi')) {
    return '/yi-logo.svg'
  } else if (name?.includes('mistral') || name?.includes('mixtral')) {
    return '/mistral.svg'
  } else if (name?.includes('llama')) {
    return '/llama.jpeg'
  } else {
    return ''
  }
}

export default function HeaderMenus() {
  const [activeId, list] = useChatStore((state) => [state.activeId, state.list])
  const updateChatModel = useChatStore((state) => state.updateChatModel)

  const activeChat = list.find((item) => item.chat_id === activeId)

  const [open, setOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const resize = () => {
    if (window.innerWidth > 768) {
      setOpen(false)
    }
  }

  useEffect(() => {
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className="flex h-12 flex-shrink-0 items-center gap-2 border-b border-b-zinc-100 px-3">
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <div className="flex cursor-pointer items-center justify-center rounded-lg px-1.5 py-1 transition-colors hover:bg-[#f2f2f2]">
              <span className="i-f7-sidebar-left h-5 w-5 text-[#767575]" />
            </div>
          </SheetTrigger>
          <SheetContent side="left" className="w-[75%] p-0 md:hidden">
            <SideMenus className="absolute w-full" />
          </SheetContent>
        </Sheet>
      </div>

      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <div
            className={cn(
              'flex cursor-pointer select-none items-center gap-2 rounded-lg py-1.5 pl-3 pr-2 text-sm text-muted-foreground transition-colors hover:bg-[#f2f2f2]',
              dropdownOpen && 'bg-[#f2f2f2]',
            )}
          >
            <Image
              className={cn('h-5 w-5', {
                'rounded-full':
                  activeChat?.chat_model?.startsWith('meta-llama'),
              })}
              src={getModelIcon(activeChat?.chat_model)}
              alt="model"
              width={26}
              height={26}
            />
            <span>{activeChat?.chat_model}</span>
            <span className="i-mingcute-down-fill h-4 w-4 text-muted-foreground" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="start" sideOffset={7}>
          <DropdownMenuRadioGroup
            value={activeChat?.chat_model}
            onValueChange={(value) => updateChatModel(activeId, value)}
          >
            <DropdownMenuRadioItem
              className="py-2"
              value="mistralai/mixtral-8x7b-instruct"
            >
              <Image
                className="mr-2 rounded-md"
                src="/mistral.svg"
                alt="mistral"
                width={24}
                height={24}
              />
              <span>mistralai/mixtral-8x7b-instruct</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              className="py-2"
              value="mistralai/mistral-7b-instruct"
            >
              <Image
                className="mr-2 rounded-md"
                src="/mistral.svg"
                alt="mistral"
                width={24}
                height={24}
              />
              <span>mistralai/mistral-7b-instruct</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              className="py-2"
              value="dolphin-2.9-llama3-8b"
            >
              <Image
                className="mr-2 rounded-md"
                src="/llama.jpeg"
                alt="llama"
                width={24}
                height={24}
              />
              <span>dolphin-2.9-llama3-8b</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              className="py-2"
              value="openhermes-2.5-mistral-7b-gptq"
            >
              <Image
                className="mr-2 rounded-md"
                src="/mistral.svg"
                alt="mistral"
                width={24}
                height={24}
              />
              <span>openhermes-2.5-mistral-7b-gptq</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              className="py-2"
              value="openhermes-2-pro-mistral-7b"
            >
              <Image
                className="mr-2 rounded-md"
                src="/mistral.svg"
                alt="mistral"
                width={24}
                height={24}
              />
              <span>openhermes-2-pro-mistral-7b</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              className="py-2"
              value="openhermes-mixtral-8x7b-gptq"
            >
              <Image
                className="mr-2 rounded-md"
                src="/mistral.svg"
                alt="mistral"
                width={24}
                height={24}
              />
              <span>openhermes-mixtral-8x7b-gptq</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              className="py-2"
              value="openhermes-2-yi-34b-gptq"
            >
              <Image
                className="mr-2 rounded-md"
                src="/yi-logo.svg"
                alt="yi"
                width={24}
                height={24}
              />
              <span>openhermes-2-yi-34b-gptq</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              className="py-2"
              value="meta-llama/llama-2-70b-chat"
            >
              <Image
                className="mr-2 rounded-md"
                src="/llama.jpeg"
                alt="llama"
                width={24}
                height={24}
              />
              <span>meta-llama/llama-2-70b-chat</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              className="py-2"
              value="codellama-70b"
              disabled
            >
              <Image
                className="mr-2"
                src="/codellama.png"
                alt="codellama"
                width={24}
                height={24}
              />
              <span>codellama-70b</span>
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
