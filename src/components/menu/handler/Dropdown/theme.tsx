"use client";

import React from "react";
import {
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import Locale from "@/locales";

export default function Theme() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <span className="i-mingcute-sun-line mr-2 h-4 w-4" />
        <span>{Locale.global.theme}</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
            <DropdownMenuRadioItem value="light">
              <span className="i-mingcute-sun-line mr-2 h-4 w-4" />
              <span>{Locale.theme.light}</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">
              <span className="i-mingcute-moon-line mr-2 h-4 w-4" />
              <span>{Locale.theme.dark}</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system">
              <span className="i-mingcute-computer-line mr-2 h-4 w-4" />
              <span>{Locale.theme.system}</span>
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
