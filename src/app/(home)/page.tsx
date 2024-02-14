import React from "react";
import SideMenus from "@/components/modules/sideMenus";
import HeaderMenus from "@/components/modules/headerMenus";
import ChatSection from "@/components/modules/chatSection";
import InputSection from "@/components/modules/inputSection";

export default function Home() {
  return (
    <div>
      <SideMenus className="hidden md:flex" />
      <div className="left-0 md:left-[280px] fixed inset-0 flex flex-col">
        <HeaderMenus />
        <ChatSection />
        <InputSection />
      </div>
    </div>
  );
}
