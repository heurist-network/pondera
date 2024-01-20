"use client";

import React from "react";
import Locale from "@/locales";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

export default function Plugin() {
  return (
    <DropdownMenuItem disabled>
      <span className="i-mingcute-plugin-2-line mr-2 h-4 w-4" />
      <span>{Locale.plugin.config}</span>
    </DropdownMenuItem>
  );
}
