"use client";

import { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChatStore, LOADING_STATE } from "@/store/chat";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SideMenus() {
  const [activeId, list] = useChatStore((state) => [
    state.activeId,
    state.list,
  ]);
  const [open, setOpen] = useState(false);

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
                <Dialog>
                  <DialogTrigger asChild>
                    <span className="i-ri-edit-line text-base" />
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Chat Title</DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center space-x-2">
                      <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                          Link
                        </Label>
                        <Input id="link" readOnly />
                      </div>
                    </div>
                    <DialogFooter className="">
                      <div className="flex-1 flex justify-between">
                        <DialogClose>
                          <Button variant="ghost">Cancel</Button>
                        </DialogClose>
                        <DialogClose>
                          <Button>Save</Button>
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
