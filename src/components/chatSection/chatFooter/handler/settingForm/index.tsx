import React from "react";
import Locale from "@/locales";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Form, { type FormRef } from "./form";

export default function Setting() {
  const [open, setOpen] = React.useState(false);

  const formRef = React.useRef<FormRef>(null);

  const onClose = () => setOpen(false);

  const onOk = () => formRef.current?.submit();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="rounded-full w-7 lg:w-auto lg:px-[10px] h-7 text-xs"
          size="icon"
        >
          <span className="i-mingcute-settings-4-line h-4 w-4" />
          <span className="hidden lg:inline-block ml-1.5">
            {Locale.chat["conversation-setting"]}
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[520px]">
        <DialogHeader>
          <DialogTitle>{Locale.chat["conversation-setting"]}</DialogTitle>
        </DialogHeader>
        <Form ref={formRef} onClose={onClose} />
        <DialogFooter>
          <div className="flex justify-between flex-1">
            <Button variant="ghost" onClick={onClose}>
              {Locale.global["cancel-spacing"]}
            </Button>
            <Button onClick={onOk}>{Locale.global["ok-spacing"]}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
