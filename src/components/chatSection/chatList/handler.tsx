import React from "react";
import Locale from "@/locales";
import { Button } from "@/components/ui/button";
import { useClipboard } from "@/hooks/useClipboard";
import type { ChatItem } from "@/hooks/useChannel";
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
import Edit from "./edit";

export default function Handler({
  item,
  onDelete,
  onRegenerate,
}: {
  item: ChatItem;
  onDelete: () => void;
  onRegenerate: () => void;
}) {
  const { isCopied, copy } = useClipboard();

  const onCopy = () => {
    if (isCopied) return;
    copy(item.content);
  };

  return (
    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="flex gap-2">
        <Button
          variant="outline"
          className="rounded-full w-[34px] h-6 p-0"
          onClick={onCopy}
        >
          {isCopied ? (
            <span className="i-mingcute-check-line h-4 w-4" />
          ) : (
            <span className="i-mingcute-copy-2-line h-4 w-4" />
          )}
        </Button>

        <Edit item={item} />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" className="rounded-full w-[34px] h-6 p-0">
              <span className="i-mingcute-delete-2-line h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
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
        <Button
          variant="outline"
          className="rounded-full w-[34px] h-6 p-0"
          onClick={onRegenerate}
        >
          <span className="i-mingcute-refresh-3-line h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
