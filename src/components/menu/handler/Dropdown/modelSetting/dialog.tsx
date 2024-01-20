"use client";

import React from "react";
import { useStore } from "./store";
import Locale from "@/locales";
import { useAIStore, type ModelSettingsKey } from "@/hooks/useAI";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function ModelSettingsDialog() {
  const tokenInputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = useStore((state) => [state.open, state.updateOpen]);

  const [modelSettings, setModelSettings] = useAIStore((state) => [
    state.modelSettings,
    state.updateModelSettings,
  ]);

  const onChange = (value: any, key: ModelSettingsKey) => {
    setModelSettings({ ...modelSettings, [key]: value });
  };

  const onMaxTokensChange = (value: string) => {
    const num =
      Math.floor(Number(value)) >= 100000 ? 100000 : Math.floor(Number(value));
    onChange(num, "max_tokens");
  };

  const onMaxTokensBlur = (value: string) => {
    const num =
      Math.floor(Number(value)) >= 100000 ? 100000 : Math.floor(Number(value));
    onChange(num, "max_tokens");
    tokenInputRef.current!.value = String(num);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{Locale.configure["model-settings"]}</DialogTitle>
        </DialogHeader>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="max-tokens" className="flex items-center gap-1">
              {Locale.configure["max-tokens"]}
              <span
                className="i-mingcute-refresh-3-fill h-4 w-4 text-sky-400 dark:text-sky-500 cursor-pointer"
                onClick={() => onChange(2000, "max_tokens")}
              />
            </Label>
            <div className="text-xs text-muted-foreground">
              {Locale.configure["max-tokens-tip"]}
            </div>
            <Input
              ref={tokenInputRef}
              id="max-tokens"
              className="h-9"
              type="number"
              value={modelSettings.max_tokens}
              onChange={(e) => onMaxTokensChange(e.target.value)}
              onBlur={(e) => onMaxTokensBlur(e.target.value)}
            />
          </div>
          <div className="flex flex-col">
            <Label className="flex items-center gap-1">
              <span>{Locale.configure.temperature}:</span>
              <span>{modelSettings.temperature}</span>
              <span
                className="i-mingcute-refresh-3-fill h-4 w-4 text-sky-400 dark:text-sky-500 cursor-pointer"
                onClick={() => onChange(1, "temperature")}
              />
            </Label>
            <div className="text-xs text-muted-foreground mt-1.5">
              {Locale.configure["temperature-tip"]}
            </div>
            <div className="h-6 flex items-end">
              <Slider
                value={[modelSettings.temperature]}
                max={2}
                step={0.1}
                onValueChange={(e) => onChange(e[0], "temperature")}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-sm text-muted-foreground font-semibold">
              <div>{Locale.configure.deterministic}</div>
              <div>{Locale.configure.neutral}</div>
              <div>{Locale.configure.random}</div>
            </div>
          </div>
          <div className="flex flex-col">
            <Label className="flex items-center gap-1">
              <span>{Locale.configure.top_p}:</span>
              <span>{modelSettings.top_p}</span>
              <span
                className="i-mingcute-refresh-3-fill h-4 w-4 text-sky-400 dark:text-sky-500 cursor-pointer"
                onClick={() => onChange(1, "top_p")}
              />
            </Label>
            <div className="text-xs text-muted-foreground mt-1.5">
              {Locale.configure["top_p-tip"]}
            </div>
            <div className="h-6 flex items-end">
              <Slider
                value={[modelSettings.top_p]}
                max={1}
                step={0.1}
                onValueChange={(e) => onChange(e[0], "top_p")}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-sm text-muted-foreground font-semibold">
              <div>{Locale.configure.deterministic}</div>
              <div>{Locale.configure.creative}</div>
            </div>
          </div>
          <div className="flex flex-col">
            <Label className="flex items-center gap-1">
              <span>{Locale.configure.presence_penalty}:</span>
              <span>{modelSettings.presence_penalty}</span>
              <span
                className="i-mingcute-refresh-3-fill h-4 w-4 text-sky-400 dark:text-sky-500 cursor-pointer"
                onClick={() => onChange(0, "presence_penalty")}
              />
            </Label>
            <div className="text-xs text-muted-foreground mt-1.5">
              {Locale.configure["presence_penalty-tip"]}
            </div>
            <div className="h-6 flex items-end">
              <Slider
                value={[modelSettings.presence_penalty]}
                min={-2}
                max={2}
                step={0.1}
                onValueChange={(e) => onChange(e[0], "presence_penalty")}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-sm text-muted-foreground font-semibold">
              <div>{Locale.configure.balanced}</div>
              <div>{Locale.configure["open-minded"]}</div>
            </div>
          </div>
          <div className="flex flex-col">
            <Label className="flex items-center gap-1">
              <span>{Locale.configure.frequency_penalty}:</span>
              <span>{modelSettings.frequency_penalty}</span>
              <span
                className="i-mingcute-refresh-3-fill h-4 w-4 text-sky-400 dark:text-sky-500 cursor-pointer"
                onClick={() => onChange(0, "frequency_penalty")}
              />
            </Label>
            <div className="text-xs text-muted-foreground mt-1.5">
              {Locale.configure["frequency_penalty-tip"]}
            </div>
            <div className="h-6 flex items-end">
              <Slider
                value={[modelSettings.frequency_penalty]}
                min={-2}
                max={2}
                step={0.1}
                onValueChange={(e) => onChange(e[0], "frequency_penalty")}
              />
            </div>
            <div className="flex justify-between mt-1.5 text-sm text-muted-foreground font-semibold">
              <div>{Locale.configure.balanced}</div>
              <div>{Locale.configure["less-repetition"]}</div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
