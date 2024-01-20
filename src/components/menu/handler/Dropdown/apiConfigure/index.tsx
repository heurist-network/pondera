"use client";

import React from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useStore } from "./store";

export default function Configure() {
  const updateOpen = useStore((state) => state.updateOpen);

  const onClick = () => {
    setTimeout(() => {
      updateOpen(true);
    }, 200);
  };

  return (
    <DropdownMenuItem onClick={onClick}>
      <span className="i-mingcute-key-2-line mr-2 h-4 w-4" />
      <span>API Key</span>
    </DropdownMenuItem>
  );
}
