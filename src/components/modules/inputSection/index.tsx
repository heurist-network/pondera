"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore, LOADING_STATE } from "@/store/chat";

export default function InputSection() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeId, list] = useChatStore((state) => [
    state.activeId,
    state.list,
  ]);
  const addChatItem = useChatStore((state) => state.addChatItem);
  const sendChat = useChatStore((state) => state.sendChat);

  const activeList = list.find((item) => item.chat_id === activeId);

  const [input, setInput] = useState("");

  const onSubmit = async () => {
    if (activeList?.chat_state !== LOADING_STATE.NONE) {
      return;
    }
    if (!input?.trim()) {
      return inputRef.current?.focus();
    }

    setInput("");
    addChatItem({ chat_id: activeId, role: "user", message: input });

    sendChat({ chat_id: activeId });
  };

  return (
    <div className="h-12 flex-shrink-0 px-2 flex gap-2">
      <Input
        ref={inputRef}
        placeholder={`Press "/" to focus input`}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button onClick={onSubmit}>Submit</Button>
    </div>
  );
}
