"use client";

import { useRef, useState, useEffect, type KeyboardEvent } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useChatStore, LOADING_STATE } from "@/store/chat";

export default function InputSection() {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [activeId, list] = useChatStore((state) => [
    state.activeId,
    state.list,
  ]);
  const addMessage = useChatStore((state) => state.addMessage);
  const sendChat = useChatStore((state) => state.sendChat);
  const cancelChat = useChatStore((state) => state.cancelChat);

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
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSubmit();
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
    <div className="border-t border-zinc-100 px-5">
      <div className="flex py-2 gap-0.5">
        {activeList?.chat_state !== LOADING_STATE.NONE && (
          <Button
            size="icon"
            variant="ghost"
            className="w-8 h-8"
            onClick={() => cancelChat(activeId)}
          >
            <span className="i-mingcute-stop-circle-fill text-[#ff5f57]" />
          </Button>
        )}
        <Button
          size="icon"
          variant="ghost"
          className="w-8 h-8"
          onClick={() => {
            toast.error("Not implemented yet", { id: "not-implemented" });
          }}
        >
          <span className="i-mingcute-share-2-fill" />
        </Button>
      </div>
      <div className="pb-3 flex gap-2">
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
          <span className="hidden md:block">Send</span>
        </Button>
      </div>
    </div>
  );
}
