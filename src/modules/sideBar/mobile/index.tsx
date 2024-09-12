import Image from 'next/image'

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

import { SideBar as PcSideBar } from '../pc'

export function SideBar() {
  return (
    <div className="flex h-[52px] md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <div className="flex w-14 items-center justify-center">
            <Image src="/icon/menu.svg" alt="menu" width={24} height={24} />
          </div>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="relative border-r-0 bg-[#1D1D1B] p-0"
          closeClassName="text-white"
        >
          <PcSideBar className="flex w-full" />
        </SheetContent>
      </Sheet>
      <div className="flex flex-1 items-center justify-center">
        <Image
          src="/logo.svg"
          alt="logo"
          priority
          width={196}
          height={39}
          style={{ height: '24px' }}
        />
      </div>
      <div className="flex w-14 items-center justify-center">
        <Image src="/icon/plus.svg" alt="menu" width={24} height={24} />
      </div>
    </div>
  )
}
