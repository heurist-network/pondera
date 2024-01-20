"use client";

import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Locale from "@/locales";
import { useAIStore, type OpenAI } from "@/hooks/useAI";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function PluginHandler() {
  const [open, setOpen] = React.useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();

  const updateOpenAI = useAIStore((state) => state.updateOpenAI);

  const apiKey = searchParams.get("apiKey");
  const proxy = searchParams.get("proxy");

  const onOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) router.replace("/");
  };

  const onOk = () => {
    if (apiKey && proxy) updateOpenAI({ apiKey, proxy });
  };

  React.useEffect(() => {
    if (apiKey && proxy) setOpen(true);
  }, []);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{Locale.newPlugin.notification}</AlertDialogTitle>
          <AlertDialogDescription>
            {Locale.newPlugin.tip}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col gap-4 text-sm font-medium">
          <div className="flex flex-col space-y-1">
            <div>API Key</div>
            <div className="font-normal leading-snug text-muted-foreground">
              {apiKey}
            </div>
          </div>
          <div className="flex flex-col space-y-1">
            <div>API Proxy</div>
            <div className="font-normal leading-snug text-muted-foreground">
              {proxy}
            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {Locale.global["cancel-spacing"]}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onOk}>
            {Locale.global["ok-spacing"]}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
