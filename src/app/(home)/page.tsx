import React from 'react'

import ChatSection from '@/components/modules/chatSection'
import HeaderMenus from '@/components/modules/headerMenus'
import InputSection from '@/components/modules/inputSection'
import SideMenus from '@/components/modules/sideMenus'

export default function Home() {
  return (
    <div>
      <SideMenus className="hidden md:flex" />
      <div className="fixed inset-0 left-0 flex flex-col md:left-[280px]">
        <HeaderMenus />
        <ChatSection />
        <InputSection />
      </div>
    </div>
  )
}
