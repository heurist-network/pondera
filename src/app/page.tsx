import Image from 'next/image'
import Link from 'next/link'

import { ChatList } from '@/modules/chatList'
import { ChatMenu } from '@/modules/chatMenu'

function Mask() {
  return (
    <>
      <div className="absolute -bottom-[317px] -left-[201px] h-[490px] w-[490px] bg-[#004C52] blur-[80px]" />
      <div className="absolute -left-[161px] -top-[357px] h-[413px] w-[413px] bg-[#00727B] blur-[80px]" />
    </>
  )
}

export default function HomePage() {
  return (
    <div className="fixed left-0 top-0 flex h-full w-full bg-[#1D1D1B]">
      <Mask />
      <div className="relative hidden w-[280px] flex-col items-center gap-4 py-4 md:flex">
        <div className="flex h-[110px] w-64 flex-shrink-0 items-center justify-center">
          <Image
            src="/logo.svg"
            alt="logo"
            width={196}
            height={38}
            style={{ width: '196px', height: '38px' }}
          />
        </div>
        <ChatMenu />
        <div className="flex w-full flex-shrink-0 gap-2.5 px-3 text-white">
          <Link
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-[rgba(255,255,255,0.15)]"
            href="https://github.com/heurist-network"
            target="_blank"
          >
            <span className="i-ri-github-fill h-[18px] w-[18px]" />
          </Link>
          <Link
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-[rgba(255,255,255,0.15)]"
            href="https://x.com/heurist_ai"
            target="_blank"
          >
            <span className="i-ri-twitter-x-line h-[18px] w-[18px]" />
          </Link>
        </div>
      </div>
      <div className="relative flex flex-1 py-4 pl-4 pr-4 md:pl-0">
        <ChatList />
      </div>
    </div>
  )
}
