"use client";

import { useRef, useState, useEffect, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChatStore, LOADING_STATE } from "@/store/chat";
import { getPlatform } from "@/lib/platform";

export default function InputSection() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [activeId, list] = useChatStore((state) => [
    state.activeId,
    state.list,
  ]);
  const addMessage = useChatStore((state) => state.addMessage);
  const sendChat = useChatStore((state) => state.sendChat);

  const activeList = list.find((item) => item.chat_id === activeId);
  const isLoading = activeList?.chat_state !== LOADING_STATE.NONE;

  const [input, setInput] = useState("");

  const onResize = () => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height =
      textareaRef.current.scrollHeight + 2 + "px";
    textareaRef.current.style.overflow =
      textareaRef.current.getBoundingClientRect().height ===
      textareaRef.current.scrollHeight
        ? "hidden"
        : "auto";
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    const platform = getPlatform();

    if (platform === "mac") {
      if (event.keyCode === 13 && !event.shiftKey) {
        event.preventDefault();
        onSubmit();
      }
    } else if (platform === "windows") {
      if ((event.keyCode === 13 || event.keyCode === 10) && !event.shiftKey) {
        event.preventDefault();
        onSubmit();
      }
    }
  };

  const onSubmit = async () => {
    if (activeList?.chat_state !== LOADING_STATE.NONE) {
      return;
    }
    if (!input?.trim()) {
      return textareaRef.current?.focus();
    }
    setInput("");
    addMessage({ chat_id: activeId, role: "user", message: input });
    sendChat({ chat_id: activeId });
  };

  useEffect(() => {
    onResize();
  }, [input]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [activeId]);

  useEffect(() => {
    const keydownHandler = (e: any) => {
      if (e.key === "/") {
        e.preventDefault();
        textareaRef.current?.focus();
      }
    };

    document.addEventListener("keydown", keydownHandler);

    return () => {
      document.removeEventListener("keydown", keydownHandler);
    };
  }, []);

  return (
    <div className="px-6 py-3 flex gap-2 border-t border-zinc-100">
      <Textarea
        ref={textareaRef}
        className="min-h-min max-h-56 resize-none rounded-xl bg-transparent transition-all"
        rows={1}
        placeholder={`Press "/" to focus input`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onInput={onResize}
        onKeyDown={onKeyDown}
      />
      <Button
        onClick={onSubmit}
        disabled={isLoading}
        className="gap-2 rounded-xl"
      >
        {isLoading ? (
          <span className="i-mingcute-loading-line text-base animate-spin" />
        ) : (
          <span className="i-ri-send-plane-fill text-base" />
        )}
        Send
      </Button>
    </div>
  );
}
