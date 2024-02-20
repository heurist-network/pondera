"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import SideMenus from "../sideMenus";
import { cn } from "@/lib/utils";

export default function HeaderMenus() {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [model, setModel] = useState("mixtral-8x7b");

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

      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <div
            className={cn(
              "hover:bg-[#f2f2f2] cursor-pointer px-3 py-1.5 rounded-lg select-none text-sm text-muted-foreground transition-colors",
              dropdownOpen && "bg-[#f2f2f2]"
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
  );
}
