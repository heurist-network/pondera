"use client";

import React from "react";
import Locale from "@/locales";
import { useTTSStore } from "@/hooks/useTTS";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function TTSSetting() {
  const [open, setOpen] = useTTSStore((state) => [
    state.open,
    state.updateOpen,
  ]);
  const [model, voice] = useTTSStore((state) => [state.model, state.voice]);

  const updateTTS = useTTSStore((state) => state.updateTTS);

  const onChange = (value: string, key: "model" | "voice") => {
    const obj = { model, voice };
    updateTTS({ ...obj, [key]: value });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-[520px]">
        <DialogHeader>
          <DialogTitle>{Locale.tts.title}</DialogTitle>
        </DialogHeader>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="model">{Locale.tts.quality}</Label>
            <Select
              value={model}
              onValueChange={(value) => onChange(value, "model")}
            >
              <SelectTrigger id="model" className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="tts-1">tts-1</SelectItem>
                <SelectItem value="tts-1-hd">tts-1-hd</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="voice">{Locale.tts.voiceOptions}</Label>
            <div className="text-xs text-muted-foreground">
              {Locale.tts["voice-tip"]}
            </div>
            <Select
              value={voice}
              onValueChange={(value) => onChange(value, "voice")}
            >
              <SelectTrigger id="voice" className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="alloy">alloy</SelectItem>
                <SelectItem value="echo">echo</SelectItem>
                <SelectItem value="fable">fable</SelectItem>
                <SelectItem value="onyx">onyx</SelectItem>
                <SelectItem value="nova">nova</SelectItem>
                <SelectItem value="shimmer">shimmer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
