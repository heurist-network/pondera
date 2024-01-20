"use client";

import React from "react";
import { useChannelStore } from "@/hooks/useChannel";
import { Button } from "@/components/ui/button";
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
import Locale from "@/locales";

export default function ChannelHandler() {
  const addContext = useChannelStore((state) => state.addContext);
  const clearList = useChannelStore((state) => state.clearList);

  return (
    <div className="flex gap-1.5">
      <Button className="flex-1" onClick={addContext}>
        {Locale.chat["new-chat"]}
      </Button>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="icon">
            <span className="i-mingcute-delete-2-line h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{Locale.chat["clear-context"]}</AlertDialogTitle>
            <AlertDialogDescription>
              {Locale.chat["clear-all-context"]}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {Locale.global["cancel-spacing"]}
            </AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={clearList}>
              {Locale.global["ok-spacing"]}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
