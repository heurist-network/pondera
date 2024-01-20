"use client";

import React from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Locale from "@/locales";
import { useStore } from "./store";

export default function ModelSetting() {
  const updateOpen = useStore((state) => state.updateOpen);

  const onClick = () => {
    setTimeout(() => {
      updateOpen(true);
    }, 200);
  };

  return (
    <DropdownMenuItem onClick={onClick}>
      <span className="i-mingcute-settings-6-line mr-2 h-4 w-4" />
      <span>{Locale.configure["model-settings"]}</span>
    </DropdownMenuItem>
  );
}
