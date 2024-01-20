import React from "react";
import PcMenu from "@/components/menu";
import Navbar from "@/components/navbar";
import Welcome from "@/components/site/welcome";
import ChatSection from "@/components/chatSection";
import PluginHandler from "@/components/pluginHandler";
import TTSSetting from "@/components/tts";

export default function Home() {
  return (
    <>
      <div className="flex fixed inset-0">
        <PcMenu />
        <section className="h-full w-full md:w-[calc(100vw-17.5rem)] relative">
          <Navbar />
          <Welcome />
          <ChatSection />
        </section>
      </div>
      <PluginHandler />
      <TTSSetting />
    </>
  );
}
