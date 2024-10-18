import { ChatList } from '@/modules/chatList'
import { SideBar as MobileSideBar } from '@/modules/sideBar/mobile'
import { SideBar as PcSideBar } from '@/modules/sideBar/pc'

export default function HomePage() {
  return (
    <div className="flex flex-col h-full bg-[#1D1D1B] w-full top-0 left-0 fixed md:flex-row">
      <PcSideBar />
      <MobileSideBar />
      <div className="flex flex-1 relative md:p-4 md:pl-0">
        <ChatList />
      </div>
    </div>
  )
}
