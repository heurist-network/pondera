"use client";

import { useState } from "react";
import Image from "next/image";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useChatStore, LOADING_STATE } from "@/store/chat";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SideMenus({ className }: { className?: string }) {
  const [activeId, list] = useChatStore((state) => [
    state.activeId,
    state.list,
  ]);
  const [value, setValue] = useState("");

  const addChat = useChatStore((state) => state.addChat);
  const deleteChat = useChatStore((state) => state.deleteChat);
  const clearChat = useChatStore((state) => state.clearChat);
  const toggleChatActive = useChatStore((state) => state.toggleChatActive);
  const updateChatName = useChatStore((state) => state.updateChatName);

  return (
    <div
      className={cn(
        "left-0 top-0 bottom-0 w-[280px] fixed px-2.5 border-r bg-sideMenu flex flex-col",
        className
      )}
    >
      <div className="text-xl font-semibold tracking-tight h-20 flex justify-center items-center">
        <Image src="/logo.svg" alt="logo" width={259} height={640} />
      </div>
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
      <div className="flex-1 flex flex-col gap-1 overflow-y-auto mb-2">
        {list.map((item) => (
          <div
            className={cn(
              "flex items-center gap-2 flex-shrink-0",
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
                <Dialog>
                  <DialogTrigger asChild>
                    <span
                      className="i-ri-edit-line text-base"
                      onClick={(e) => {
                        e.stopPropagation();
                        setValue(item.chat_name);
                      }}
                    />
                  </DialogTrigger>
                  <DialogContent
                    className="w-[700px]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DialogHeader>
                      <DialogTitle>Edit Chat Title</DialogTitle>
                    </DialogHeader>
                    <Textarea
                      className="h-36 resize-none"
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    />
                    <DialogFooter>
                      <div className="flex-1 flex justify-between">
                        <DialogClose asChild>
                          <Button variant="ghost">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button
                            onClick={() => {
                              updateChatName(item.chat_id, value);
                            }}
                          >
                            Save
                          </Button>
                        </DialogClose>
                      </div>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
