"use client";

import React from "react";
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
import { useChatStore, LOADING_STATE } from "@/store/chat";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SideMenus() {
  const [activeId, list] = useChatStore((state) => [
    state.activeId,
    state.list,
  ]);

  const addChat = useChatStore((state) => state.addChat);
  const deleteChat = useChatStore((state) => state.deleteChat);
  const clearChat = useChatStore((state) => state.clearChat);
  const toggleChatActive = useChatStore((state) => state.toggleChatActive);

  return (
    <div className="left-0 top-0 bottom-0 w-[280px] fixed px-2.5 border-r bg-sideMenu">
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight h-12 flex justify-center items-center">
        Pondera
      </h4>
      <div className="flex gap-2">
        <Button
          size="sm"
          className="mb-2 flex-1 gap-2.5"
          onClick={() => {
            addChat();
          }}
        >
          <span className="i-mingcute-chat-2-fill w-4 h-4" />
          New Chat
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button size="sm" variant="ghost" className="hover:bg-[#c8c9ca]">
              <span className="i-f7-trash w-[18px] h-[18px]" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to clear the chat?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={clearChat}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="flex flex-col gap-1">
        {list.map((item) => (
          <div
            className={cn(
              "flex items-center gap-2",
              "group h-9 text-[#4b4c4c] rounded-md pl-3 text-sm font-medium cursor-pointer transition-colors select-none hover:bg-sideMenuItem relative",
              "pr-3 hover:pr-14",
              {
                "bg-sideMenuItem": item.chat_id === activeId,
              }
            )}
            key={item.chat_id}
            onClick={() => {
              toggleChatActive(item.chat_id);
            }}
          >
            <span
              className={cn(
                "text-base flex-shrink-0",
                item.chat_state !== LOADING_STATE.NONE
                  ? "i-mingcute-loading-line animate-spin"
                  : "i-mingcute-message-3-line"
              )}
            />
            <div className="truncate">{item.chat_name || "Untitled"}</div>
            <div className="absolute right-3 opacity-0 group-hover:opacity-100">
              <div className="flex items-center gap-2">
                <span className="i-ri-edit-line text-base" />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <span
                      className="i-f7-trash text-base"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </AlertDialogTrigger>
                  <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete the chat?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        variant="destructive"
                        onClick={() => deleteChat(item.chat_id)}
                      >
                        Confirm
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
