"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useClipboard } from "@/hooks/useClipboard";
import { useChatStore, Message, LOADING_STATE } from "@/store/chat";
import { ChatContent } from "../chatContent";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function CopyContent({ content }: { content: string }) {
  const { isCopied, copy } = useClipboard();

  const onCopy = (content: string) => {
    if (isCopied) return;
    copy(content);
  };

  return (
    <div
      className="flex justify-center items-center p-1.5 rounded-md cursor-pointer hover:bg-[#f2f2f2] transition-colors"
      onClick={() => onCopy(content)}
    >
      <span
        className={cn(
          "w-[18px] h-[18px] text-[#757574]",
          isCopied ? "i-mingcute-check-line" : "i-mingcute-copy-2-line"
        )}
      />
    </div>
  );
}

export default function ChatSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [activeId, list] = useChatStore((state) => [
    state.activeId,
    state.list,
  ]);
  const deleteMessage = useChatStore((state) => state.deleteMessage);

  const activeChat = list.find((item) => item.chat_id === activeId);

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
      {messages.map((m, index) => (
        <div key={m.id} className="group">
          <div className="flex gap-2">
            {m.role === "user" ? (
              <Avatar>
                <AvatarImage src="https://github.com/Peek-A-Booo.png" />
                <AvatarFallback>Avatar</AvatarFallback>
              </Avatar>
            ) : (
              <div className="w-10 h-10 bg-zinc-200 flex justify-center items-center rounded-full flex-shrink-0">
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
          <div
            className={cn(
              "pl-12 opacity-0 transition-opacity flex gap-2 mt-1",
              m.role !== "user" &&
                index === messages.length - 1 &&
                activeChat?.chat_state !== LOADING_STATE.NONE
                ? "pointer-events-none"
                : "group-hover:opacity-100"
            )}
          >
            <CopyContent content={m.content} />
            <div className="flex justify-center items-center p-1.5 rounded-md cursor-pointer hover:bg-[#f2f2f2] transition-colors">
              <span className="i-ri-edit-line w-[18px] h-[18px] text-[#757574]" />
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div className="flex justify-center items-center p-1.5 rounded-md cursor-pointer hover:bg-[#f2f2f2] transition-colors">
                  <span className="i-f7-trash w-[18px] h-[18px] text-destructive" />
                </div>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this message?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    variant="destructive"
                    onClick={() => {
                      deleteMessage({ chat_id: activeId, message_id: m.id });
                    }}
                  >
                    Confirm
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <div className="flex justify-center items-center p-1.5 rounded-md cursor-pointer hover:bg-[#f2f2f2] transition-colors">
              <span className="i-mingcute-refresh-3-line w-[18px] h-[18px] text-[#757574]" />
            </div>
          </div>
        </div>
      ))}
      {activeChat?.chat_state !== LOADING_STATE.NONE && (
        <div className="pl-12 -mt-4 text-muted-foreground flex items-center gap-2">
          <span className="i-mingcute-loading-line animate-spin w-5 h-5" />
          Assistant is{" "}
          {activeChat?.chat_state === LOADING_STATE.CONNECTING
            ? "thinking"
            : "typing"}
          ...
        </div>
      )}
    </div>
  );
}
