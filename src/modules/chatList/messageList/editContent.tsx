import { useEffect, useState } from 'react'
import type { ChatItem } from '@/store/chat'

import { useChatStore } from '@/store/chat'

export function EditContent({ data }: { data: ChatItem }) {
  const { updateMessage, activeId } = useChatStore()
  const [value, setValue] = useState(data.content)

  useEffect(() => {
    const textarea = document.querySelector('textarea')
    if (textarea) {
      textarea.focus()
      textarea.setSelectionRange(value.length, value.length)
    }
  }, [value])

  return (
    <div className="w-full rounded-2xl bg-[#e4e4e3] p-3">
      <div className="m-2">
        <textarea
          className="col-start-1 col-end-2 row-start-1 row-end-2 m-0 w-full resize-none overflow-hidden border-0 bg-transparent p-0 outline-none focus:ring-0 focus-visible:ring-0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </div>
      <div className="flex justify-end gap-2">
        <div
          className="cursor-pointer rounded-full border border-[rgba(0,0,0,0.15)] bg-white px-[14px] py-2 text-sm font-medium"
          onClick={() => {
            updateMessage({
              chat_id: activeId,
              message_id: data.id,
              isEdit: false,
            })
          }}
        >
          Cancel
        </div>
        <div
          className="cursor-pointer rounded-full bg-[#0d0d0d] px-[14px] py-2 text-sm font-medium text-white transition-colors hover:bg-[#0d0d0d]/80"
          onClick={() => {
            if (!value?.trim()) return

            updateMessage({
              chat_id: activeId,
              message_id: data.id,
              isEdit: false,
              content: value,
            })
          }}
        >
          OK
        </div>
      </div>
    </div>
  )
}
