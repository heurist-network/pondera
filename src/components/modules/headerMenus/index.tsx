"use client";

import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import SideMenus from "../sideMenus";

export default function HeaderMenus() {
  const [open, setOpen] = useState(false);

  const resize = () => {
    if (window.innerWidth > 768) {
      setOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="h-12 flex-shrink-0 border-b border-b-zinc-100 flex items-center px-3 gap-2">
      <div className="md:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <div className="flex justify-center items-center rounded-lg px-1.5 py-1 hover:bg-[#f2f2f2] transition-colors cursor-pointer">
              <span className="i-f7-sidebar-left w-5 h-5 text-[#767575]" />
            </div>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[75%] md:hidden">
            <SideMenus className="w-full absolute" />
          </SheetContent>
        </Sheet>
      </div>
      <div className="hover:bg-[#f2f2f2] cursor-pointer px-3 py-1 rounded-lg select-none text-sm text-muted-foreground transition-colors">
        mistralai/mixtral-8x7b-instruct-v0.1
      </div>
    </div>
  );
}
