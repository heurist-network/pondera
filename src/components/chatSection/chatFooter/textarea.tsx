import React, { type KeyboardEvent } from "react";
import { useConfigStore } from "@/hooks/useConfig";
import { Textarea } from "@/components/ui/textarea";
import Locale from "@/locales";
import { isMobile } from "@/lib/is";
import { getPlatform } from "@/lib/platform";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ChatTextarea({
  activeId,
  value,
  loading,
  onChange,
  onSubmit,
}: {
  activeId: string;
  value: string;
  loading: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
}) {
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const sendMessageType = useConfigStore((state) => state.sendMessageType);

  const onResize = () => {
    if (!inputRef.current) return;
    inputRef.current.style.height = "auto";
    inputRef.current.style.height = inputRef.current.scrollHeight + 2 + "px";
    inputRef.current.style.overflow =
      inputRef.current.getBoundingClientRect().height ===
      inputRef.current.scrollHeight
        ? "hidden"
        : "auto";
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    const isMobileDevice = isMobile();
    const platform = getPlatform();

    if (isMobileDevice) {
      if (sendMessageType === "Enter") {
        if (event.keyCode === 13) {
          event.preventDefault();
          onSubmit();
        }
      }
    } else {
      if (sendMessageType === "Enter") {
        if (platform === "mac") {
          if (event.keyCode === 13 && !event.shiftKey) {
            event.preventDefault();
            onSubmit();
          }
        } else if (platform === "windows") {
          if (
            (event.keyCode === 13 || event.keyCode === 10) &&
            !event.shiftKey
          ) {
            event.preventDefault();
            onSubmit();
          }
        }
      } else if (sendMessageType === "CommandEnter") {
        if (platform === "mac") {
          if (event.keyCode === 13 && event.metaKey) {
            event.preventDefault();
            onSubmit();
          }
        } else if (platform === "windows") {
          if ((event.keyCode === 13 || event.keyCode === 10) && event.ctrlKey) {
            event.preventDefault();
            onSubmit();
          }
        }
      }
    }
  };

  React.useEffect(() => {
    onChange("");
    if (!inputRef.current) return;
    inputRef.current.value = "";
    onResize();
    inputRef.current.focus();
  }, [activeId]);

  React.useEffect(() => {
    onResize();
  }, [value]);

  return (
    <div className="relative">
      <Textarea
        ref={inputRef}
        className="min-h-min max-h-56 resize-none py-3 rounded-xl"
        rows={1}
        placeholder={Locale.global["type-message"]}
        onInput={onResize}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <Button
        className="absolute right-3 bottom-[5px]"
        variant="ghost"
        size="icon"
        disabled={loading}
        onClick={onSubmit}
      >
        {loading ? (
          <span className="i-lucide-loader-2 h-6 w-6 animate-spin text-sky-400" />
        ) : (
          <span
            className={cn("i-mingcute-send-line h-6 w-6 transition-colors", {
              "text-muted-foreground": !value,
              "text-sky-400": !!value,
            })}
          />
        )}
      </Button>
    </div>
  );
}
