"use client";

import React from "react";
import { useChannelStore } from "@/hooks/useChannel";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Locale from "@/locales";
import { useFormatter } from "next-intl";
import Model from "@/components/site/model";
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

function Delete({ onDelete }: { onDelete: () => void }) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <span
          className="i-mingcute-delete-2-line h-5 w-5 absolute right-1.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        />
      </AlertDialogTrigger>
      <AlertDialogContent onClick={(e) => e.stopPropagation()}>
        <AlertDialogHeader>
          <AlertDialogTitle>{Locale.chat["delete-chat"]}</AlertDialogTitle>
          <AlertDialogDescription>
            {Locale.chat["delete-chat-tip"]}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {Locale.global["cancel-spacing"]}
          </AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onDelete}>
            {Locale.global["ok-spacing"]}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function List() {
  const [activeId, channelList] = useChannelStore((state) => [
    state.activeId,
    state.list,
  ]);

  const formats = useFormatter();
  const updateActiveId = useChannelStore((state) => state.updateActiveId);
  const deleteContext = useChannelStore((state) => state.deleteContext);

  const onChangeChannel = (id: string) => {
    if (id === activeId) return;
    updateActiveId(id);
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="flex flex-col gap-1">
        {channelList.map((channel) => (
          <Button
            key={channel.channel_id}
            className={cn("px-2 h-16 justify-start gap-2 relative group", {
              "bg-sky-100 hover:bg-sky-100 dark:bg-slate-600 dark:hover:bg-slate-600":
                channel.channel_id === activeId,
            })}
            variant="ghost"
            onClick={() => onChangeChannel(channel.channel_id)}
          >
            <Model
              model={channel.channel_model}
              loading={channel.channel_loading}
            />
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex items-center">
                <span className="truncate max-w-[204px]">
                  {channel.channel_name || Locale.chat["new-conversation"]}
                </span>
              </div>
              <div className="flex justify-between w-full text-xs text-muted-foreground">
                {channel.chat_list.length} {Locale.chat.messages}
                <div className="group-hover:opacity-0">
                  {!!(
                    channel.chat_list.length && channel.chat_list.at(-1)?.time
                  ) &&
                    formats.dateTime(
                      new Date(Number(channel.chat_list.at(-1)?.time)),
                      {
                        month: "numeric",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric",
                      }
                    )}
                </div>
              </div>
            </div>
            <Delete onDelete={() => deleteContext(channel.channel_id)} />
          </Button>
        ))}
      </div>
    </div>
  );
}
