import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/default-input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { useCopy } from '@/hooks/useCopy'
import { useChatStore } from '@/store/chat'

export function ShareChat() {
  const { getActiveChat, activeId } = useChatStore()
  const [isCopied, copy] = useCopy()

  const [loading, setLoading] = useState(false)
  const [shareLink, setShareLink] = useState('')
  const [deleteLink, setDeleteLink] = useState('')

  const chat = getActiveChat(activeId)

  const onShare = () => {
    setLoading(true)
    const params = {
      model: chat?.model,
      title: chat?.title,
      list: chat?.list,
    }

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
      .finally(() => setLoading(false))
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="h-9 gap-1 rounded-[10px] px-2">
          <div>Share</div>
          <Image src="/icon/share.svg" alt="share" width={16} height={16} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Chat</DialogTitle>
          <DialogDescription className="text-left">
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
            <Button type="button" onClick={onShare} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create share link
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
