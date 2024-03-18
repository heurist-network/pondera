import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'react-hot-toast'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useCopy } from '@/hooks/useCopy'
import { useChatStore } from '@/store/chat'

export function Share() {
  const [open, setOpen] = useState(false)
  const [activeId, list] = useChatStore((state) => [state.activeId, state.list])
  const [loading, setLoading] = useState(false)
  const [shareLink, setShareLink] = useState('')
  const [deleteLink, setDeleteLink] = useState('')

  const [isCopied, copy] = useCopy()

  const activeList = list.find((item) => item.chat_id === activeId)

  const onOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setShareLink('')
      setDeleteLink('')
    }
    setOpen(isOpen)
  }

  const onCreateShare = () => {
    const params = {
      model: activeList?.chat_model,
      name: activeList?.chat_name,
      list: activeList?.chat_list,
    }

    setLoading(true)

    fetch('/api/share', {
      method: 'POST',
      body: JSON.stringify(params),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.code) {
          toast.error(res.msg || 'Create share link failed')
        } else {
          setShareLink(`${window.location.origin}/share/${res.data.id}`)
          setDeleteLink(
            `${window.location.origin}/api/delete-share?id=${res.data.deleteId}`,
          )
        }
      })
      .catch((err) => {
        toast.error(err.msg || 'Create share link failed')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8"
          disabled={!activeList?.chat_list?.length}
        >
          <span className="i-mingcute-share-2-fill" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Chat</DialogTitle>
          <DialogDescription>
            A snapshot of the current chat will be stored on Pondera server in
            order to share with other people.
          </DialogDescription>
        </DialogHeader>
        {shareLink ? (
          <>
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <Label htmlFor="link" className="sr-only">
                  Link
                </Label>
                <Input id="link" value={shareLink} readOnly />
              </div>
              <Button
                size="sm"
                className="px-3"
                onClick={() => {
                  if (isCopied) return
                  copy(shareLink)
                }}
              >
                <span className="sr-only">Copy</span>
                {isCopied ? (
                  <span className="i-mingcute-check-fill h-4 w-4" />
                ) : (
                  <span className="i-mingcute-copy-2-line h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="text-sm">
              Open this URL{' '}
              <Link
                className="text-red-500 underline transition-colors hover:text-red-500/80"
                href={deleteLink}
                target="_blank"
              >
                {deleteLink}
              </Link>{' '}
              if you want to cancel this share.
            </div>
          </>
        ) : (
          <div>
            <Button type="button" onClick={onCreateShare} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create share link
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
