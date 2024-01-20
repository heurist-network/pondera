"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStore } from "./store";
import Locale from "@/locales";
import OpenAI from "./openai";

export default function ResetDialog() {
  const [open, setOpen] = useStore((state) => [state.open, state.updateOpen]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent onPointerDownOutside={(event) => event.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{Locale.configure["api-key"]}</DialogTitle>
          <DialogDescription>
            {Locale.configure["api-key-tip"]}
          </DialogDescription>
        </DialogHeader>
        <div className="grid w-full items-center gap-4">
          <OpenAI />
        </div>
      </DialogContent>
    </Dialog>
  );
}
