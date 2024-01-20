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
} from "@/components/ui/alert-dialog";
import { useStore } from "./store";
import Locale from "@/locales";

export default function ResetDialog() {
  const [open, setOpen] = useStore((state) => [state.open, state.updateOpen]);

  const onClick = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{Locale.global["reset-data"]}</AlertDialogTitle>
          <AlertDialogDescription>
            {Locale.global["reset-data-tip"]}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            {Locale.global["cancel-spacing"]}
          </AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={onClick}>
            {Locale.global["ok-spacing"]}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
