import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/store/chat";

export default function Edit({
  chat_id,
  message_id,
  content,
}: {
  chat_id: string;
  message_id: string;
  content: string;
}) {
  const [value, setValue] = useState("");

  const updateMessage = useChatStore((state) => state.updateMessage);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className="flex justify-center items-center p-1.5 rounded-md cursor-pointer hover:bg-[#f2f2f2] transition-colors"
          onClick={() => {
            setValue(content);
          }}
        >
          <span className="i-ri-edit-line w-[18px] h-[18px] text-[#757574]" />
        </div>
      </DialogTrigger>
      <DialogContent className="w-[700px]" onClick={(e) => e.stopPropagation()}>
        <DialogHeader>
          <DialogTitle>Edit Message</DialogTitle>
        </DialogHeader>
        <Textarea
          className="h-72 resize-none"
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
                  updateMessage({ chat_id, message_id, content: value });
                }}
              >
                Save
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
