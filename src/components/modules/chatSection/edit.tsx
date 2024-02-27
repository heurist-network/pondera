import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { useChatStore } from '@/store/chat'

export default function Edit({
  chat_id,
  message_id,
  content,
}: {
  chat_id: string
  message_id: string
  content: string
}) {
  const [value, setValue] = useState('')

  const updateMessage = useChatStore((state) => state.updateMessage)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          className="flex cursor-pointer items-center justify-center rounded-md p-1.5 transition-colors hover:bg-[#f2f2f2]"
          onClick={() => {
            setValue(content)
          }}
        >
          <span className="i-ri-edit-line h-[18px] w-[18px] text-[#757574]" />
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
          <div className="flex flex-1 justify-between">
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                onClick={() => {
                  updateMessage({ chat_id, message_id, content: value })
                }}
              >
                Save
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
