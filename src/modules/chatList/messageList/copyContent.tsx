import Image from 'next/image'

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useCopy } from '@/hooks/useCopy'

export function CopyContent({ content }: { content: string }) {
  const [isCopied, copy] = useCopy()

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md transition-colors hover:bg-[#F0F0EF]"
          onClick={() => {
            if (isCopied) return

            copy(content)
          }}
        >
          {isCopied ? (
            <span className="i-mingcute-check-line h-5 w-5 text-[#52ce7c]" />
          ) : (
            <Image src="/icon/copy.svg" alt="copy" width={20} height={20} />
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p>Copy</p>
      </TooltipContent>
    </Tooltip>
  )
}
