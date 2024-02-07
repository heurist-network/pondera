"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useChatStore, Message } from "@/store/chat";
import { ChatContent } from "../chatContent";
import { cn } from "@/lib/utils";

export default function ChatSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [activeId, list] = useChatStore((state) => [
    state.activeId,
    state.list,
  ]);

  useEffect(() => {
    const findChat = list.find((item) => item.chat_id === activeId);
    setMessages(findChat?.chat_list || []);

    setTimeout(() => {
      scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
    }, 0);
  }, [activeId, list]);

  return (
    <div
      className="grow overflow-y-auto flex flex-col pl-5 pr-10 gap-4 py-10"
      ref={scrollRef}
    >
      {messages.map((m) => (
        <div key={m.id} className="flex gap-2">
          {m.role === "user" ? (
            <Avatar>
              <AvatarImage src="https://github.com/Peek-A-Booo.png" />
              <AvatarFallback>Avatar</AvatarFallback>
            </Avatar>
          ) : (
            <div className="w-10 h-10 bg-zinc-200 flex justify-center items-center rounded-full">
              <Image src="/meta.svg" alt="llama" width={26} height={26} />
            </div>
          )}
          <div
            className={cn(
              "self-start px-4 py-2 rounded-xl",
              m.role === "user" ? "bg-blue-200/70" : "bg-neutral-100"
            )}
          >
            <ChatContent content={m.content} />
          </div>
        </div>
      ))}
    </div>
  );
}
