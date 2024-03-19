'use client'

import { useCopy } from '@/hooks/useCopy'

export function CopyContent({ value }: { value: string }) {
  const [isCopied, copy] = useCopy()

  return (
    <div
      className="flex cursor-pointer items-center rounded-sm p-1.5 transition-colors hover:bg-gray-200"
      onClick={() => copy(value)}
    >
      {isCopied ? (
        <span className="i-mingcute-check-line h-4 w-4 !bg-green-400" />
      ) : (
        <span className="i-mingcute-copy-2-line h-4 w-4 !bg-muted-foreground" />
      )}
    </div>
  )
}
