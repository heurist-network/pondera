"use client";

import React from "react";
import Locale from "@/locales";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useStore } from "./store";

export default function ResetData() {
  const updateOpen = useStore((state) => state.updateOpen);

  const onClick = () => {
    setTimeout(() => {
      updateOpen(true);
    }, 200);
  };

  return (
    <DropdownMenuItem onClick={onClick}>
      <span className="i-mingcute-delete-2-line mr-2 h-4 w-4" />
      <span>{Locale.global["reset-data"]}</span>
    </DropdownMenuItem>
  );
}
