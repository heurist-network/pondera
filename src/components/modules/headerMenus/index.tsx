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

import SideMenus from '../sideMenus'

export default function HeaderMenus() {
  const [open, setOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const [model, setModel] = useState('mixtral-8x7b')

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
              'cursor-pointer select-none rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-[#f2f2f2]',
              dropdownOpen && 'bg-[#f2f2f2]',
            )}
          >
            mistralai/mixtral-8x7b-instruct-v0.1
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80" align="start" sideOffset={7}>
          <DropdownMenuRadioGroup
            value={model}
            onValueChange={(value) => {
              // setModel(value);
            }}
          >
            <DropdownMenuRadioItem className="py-2" value="mixtral-8x7b">
              <Image
                className="mr-2 rounded-md"
                src="/mistral.svg"
                alt="mistral"
                width={24}
                height={24}
              />
              <span>mixtral-8x7b</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem className="py-2" value="llama-70b">
              <Image
                className="mr-2 rounded-md"
                src="/llama.jpeg"
                alt="llama"
                width={24}
                height={24}
              />
              <span>llama-70b</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem className="py-2" value="codellama-70b">
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
