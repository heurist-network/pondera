import { ChatList } from '@/modules/chatList'
import { SideBar as MobileSideBar } from '@/modules/sideBar/mobile'
import { SideBar as PcSideBar } from '@/modules/sideBar/pc'

export default function HomePage() {
  return (
    <div className="fixed left-0 top-0 flex h-full w-full flex-col bg-[#1D1D1B] md:flex-row">
      <PcSideBar />
      <MobileSideBar />
      <div className="relative flex flex-1 md:p-4 md:pl-0">
        <ChatList />
      </div>
    </div>
  )
}
