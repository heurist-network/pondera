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
import { toast } from "react-hot-toast";
import { Textarea } from "@/components/ui/textarea";
import { type ChatItem, useChannelStore } from "@/hooks/useChannel";

export default function Edit({ item }: { item: ChatItem }) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const updateContent = useChannelStore((state) => state.updateContent);

  const onClose = () => setOpen(false);

  const onEdit = () => {
    setValue(item.content);
  };

  const onOk = () => {
    if (!value?.trim()) {
      return toast.error(Locale.global["please-enter"], { id: "please-enter" });
    }
    updateContent(item.id, value);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full w-[34px] h-6 p-0"
          onClick={onEdit}
        >
          <span className="i-mingcute-pencil-line h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[700px]">
        <DialogHeader>
          <DialogTitle>{Locale.chat["edit-content"]}</DialogTitle>
        </DialogHeader>
        <Textarea
          className="h-72 resize-none"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <DialogFooter>
          <div className="flex justify-between flex-1">
            <Button variant="outline" onClick={onClose}>
              {Locale.global["cancel-spacing"]}
            </Button>
            <Button onClick={onOk}>{Locale.global["ok-spacing"]}</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
