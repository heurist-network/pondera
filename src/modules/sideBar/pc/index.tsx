'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useLocalStorage } from 'usehooks-ts'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import { useChatStore } from '@/store/chat'

import { ChatMenu } from './chatMenu'

function Mask() {
  return (
    <div className="hidden md:block">
      <div className="absolute -bottom-[317px] -left-[201px] h-[490px] w-[490px] bg-[#004C52] blur-[80px]" />
      <div className="absolute -left-[161px] -top-[357px] h-[413px] w-[413px] bg-[#00727B] blur-[80px]" />
    </div>
  )
}

export function SideBar({ className }: { className?: string }) {
  const { addChat } = useChatStore()
  const [isCollapse, setIsCollapse] = useLocalStorage('isCollapse', false)

  const onReset = () => {
    localStorage.clear()
    window.location.reload()
  }

  return (
    <>
      <Mask />
      <div
        className={cn(
          'relative hidden flex-col items-center gap-4 py-4 md:flex transition-all',
          isCollapse ? 'w-[52px]' : 'w-[280px]',
          className,
        )}
      >
        <div>
          <div className='md:flex hidden justify-end'>
            <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-[rgba(255,255,255,0.15)]" onClick={() => setIsCollapse(!isCollapse)}>
              <Image src="/icon/collapse.svg" alt="copy" width={18} height={18} />
            </div>
          </div>
          <div
            className={cn(
              'h-[110px] w-64 flex-shrink-0 cursor-pointer items-center justify-center',
              isCollapse ? 'flex md:hidden' : 'flex'
            )}
            onClick={addChat}
          >
            <Image
              src="/logo.svg"
              alt="logo"
              priority
              width={196}
              height={38}
              style={{ width: '196px', height: '38px' }}
            />
          </div>
        </div>
        <ChatMenu />
        <div className={cn('flex w-full flex-shrink-0 gap-2.5 px-3 text-white', isCollapse ? 'md:hidden' : 'md:flex')}>
          <Link
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-[rgba(255,255,255,0.15)]"
            href="https://www.heurist.ai"
            target="_blank"
          >
            <span className="i-ri-home-3-fill h-[18px] w-[18px]" />
          </Link>
          <Link
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-[rgba(255,255,255,0.15)]"
            href="https://github.com/heurist-network"
            target="_blank"
          >
            <span className="i-ri-github-fill h-[18px] w-[18px]" />
          </Link>
          <Link
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-[rgba(255,255,255,0.15)]"
            href="https://x.com/heurist_ai"
            target="_blank"
          >
            <span className="i-ri-twitter-x-line h-[18px] w-[18px]" />
          </Link>
          <Link
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-[rgba(255,255,255,0.15)]"
            href="https://discord.com/invite/heuristai"
            target="_blank"
          >
            <span className="i-ri-discord-fill h-[18px] w-[18px]" />
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors hover:bg-[rgba(255,255,255,0.15)]">
                <span className="i-mingcute-refresh-4-line h-[18px] w-[18px]" />
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reset Pondera Data?</AlertDialogTitle>
                <AlertDialogDescription>
                  When you encounter some unknown error issues, you can try
                  clearing the data of Pondera. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction variant="destructive" onClick={onReset}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>
    </>
  )
}
