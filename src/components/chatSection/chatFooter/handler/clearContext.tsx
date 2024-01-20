import React from "react";
import Locale from "@/locales";
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

export default function ClearContext() {
  const clearContext = useChannelStore((state) => state.clearContext);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          className="rounded-full w-7 lg:w-auto lg:px-[10px] h-7 text-xs"
          variant="destructive"
          size="icon"
        >
          <span className="i-mingcute-broom-line h-4 w-4" />
          <span className="hidden lg:inline-block ml-1.5">
            {Locale.chat["clear-context"]}
          </span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{Locale.chat["clear-context"]}</AlertDialogTitle>
          <AlertDialogDescription>
            {Locale.chat["clear-current-context"]}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {Locale.global["cancel-spacing"]}
          </AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={clearContext}>
            {Locale.global["ok-spacing"]}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
