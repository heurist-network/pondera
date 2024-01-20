"use client";

import React from "react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useTTSStore } from "@/hooks/useTTS";

export default function TTS() {
  const updateOpen = useTTSStore((state) => state.updateOpen);

  const onClick = () => {
    setTimeout(() => {
      updateOpen(true);
    }, 200);
  };

  return (
    <DropdownMenuItem onClick={onClick}>
      <span className="i-mingcute-voice-line mr-2 h-4 w-4" />
      <span>OpenAI TTS</span>
    </DropdownMenuItem>
  );
}
