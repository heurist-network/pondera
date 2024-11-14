import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useChatStore } from '@/store/chat'

export function Prompt({ children }: { children: React.ReactNode }) {
  const { updateChat, getActiveChat, activeId } = useChatStore()

  const [prompt, setPrompt] = useState('')
  const [open, setOpen] = useState(false)

  const activeChat = getActiveChat(activeId)

  const onSave = () => {
    if (activeChat?.prompt?.trim() !== prompt.trim()) {
      localStorage.setItem('custom_prompt', prompt.trim())
      updateChat(activeId, { prompt: prompt.trim() })
    }

    setOpen(false)
  }

  useEffect(() => {
    if (open) {
      const localPrompt = localStorage.getItem('custom_prompt')
      setPrompt(localPrompt || activeChat?.prompt || '')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div>{children}</div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Advanced Settings</DialogTitle>
          <DialogDescription>
            Here, you can make some additional settings for the conversation.
          </DialogDescription>
        </DialogHeader>
        <div className="grid w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="system_prompt">System Prompt</Label>
            <Textarea
              id="system_prompt"
              placeholder="Enter your system prompt here"
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
