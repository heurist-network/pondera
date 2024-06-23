'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

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
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const model = searchParams.get('model')

  const [activeId, list] = useChatStore((state) => [state.activeId, state.list])
  const updateChatModel = useChatStore((state) => state.updateChatModel)

  const [models, setModels] = useState<any[]>([])

  const activeChat = list.find((item) => item.chat_id === activeId)

  const [open, setOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const resize = () => {
    if (window.innerWidth > 768) {
      setOpen(false)
    }
  }

  const getModels = async () => {
    const res: any[] = await fetch(
      'https://raw.githubusercontent.com/heurist-network/heurist-models/main/models.json',
      { next: { revalidate: 3600 } },
    ).then((res) => res.json())

    const arr = res.filter((item) => item.type?.includes('llm'))

    const findModel = arr.find((item) => item.name === model)
    if (findModel) {
      updateChatModel(activeId, findModel.name)
      router.replace(pathname)
    }

    setModels(
      arr.map((item) => {
        let icon = ''
        if (
          item.name.startsWith('mistralai') ||
          item.name.startsWith('openhermes')
        ) {
          icon = '/mistral.svg'
        }
        if (item.name.includes('llama')) {
          icon = '/llama.jpeg'
        }
        if (item.name.includes('-yi-')) {
          icon = '/yi-logo.svg'
        }
        return { ...item, label: item.name, value: item.name, icon }
      }),
    )
  }

  useEffect(() => {
    window.addEventListener('resize', resize)

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  useEffect(() => {
    getModels()
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
            {models.map((item) => (
              <DropdownMenuRadioItem
                className="py-2"
                value={item.value}
                key={item.value}
              >
                <Image
                  className="mr-2 rounded-md"
                  src={item.icon}
                  alt="icon"
                  width={24}
                  height={24}
                />
                <span>{item.label}</span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
