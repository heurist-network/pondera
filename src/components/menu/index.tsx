import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Logo from "@/components/site/logo";
import { Separator } from "@/components/ui/separator";
import ChannelHandler from "./channelHandler";
import List from "./list";
import Handler from "./handler";
import Locale from "@/locales";

function NewVersionGuild() {
  return (
    <Link
      className="text-sky-400 dark:text-sky-500 hover:underline py-1 font-medium flex items-center justify-center gap-2"
      href=""
    >
      <span className="i-ri-direction-line w-5 h-5" />
      {Locale.global["version-guide"]}
    </Link>
  );
}

export default function Menu({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "px-2.5 pb-2 gap-1.5 hidden md:flex md:w-[17.5rem] transition-colors select-none flex-col",
        "bg-white/70 backdrop-blur-sm dark:bg-slate-800",
        className
      )}
    >
      <div>
        <Logo />
        <ChannelHandler />
      </div>
      <List />
      <Separator className="dark:bg-slate-600" />
      <NewVersionGuild />
      <Separator className="dark:bg-slate-600" />
      <Handler />
    </div>
  );
}
