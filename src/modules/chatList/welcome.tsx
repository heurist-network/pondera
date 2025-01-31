'use client'

import Image from 'next/image'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { UploadDialog } from '@/components/uploadDialog'
import { useRandomPrompts } from '@/hooks/useRandomPrompts'
import { cn } from '@/lib/utils'
import { ChatInput } from '@/modules/chatInput'
import { ChatModel } from '@/modules/chatModel'
import { Prompt } from '@/modules/prompt'
import { useChatStore } from '@/store/chat'

export function Welcome() {
  const { models, getActiveChat, activeId, sendChat, addMessage } =
    useChatStore()
  const [uploadOpen, setUploadOpen] = useState(false)
  const { list } = useChatStore()

  const chat = getActiveChat(activeId)
  const findModel = models.find((model) => model.name === chat?.model)
  const randomPrompts = useRandomPrompts()
  const hasWorkspace = list.some((chat) => chat.hasDocument)

  return (
    <div className="flex h-full">
      <div
        className={cn(
          'mx-auto max-w-5xl px-4',
          'flex max-w-[768px] flex-col justify-center',
        )}
      >
        <div className="flex flex-col items-center">
          <div className="w-[288px] md:w-auto">
            <div
              className={cn(
                'text-center font-bold -tracking-[0.0192em]',
                'text-[32px] leading-[1] md:text-[36px] lg:text-[40px] xl:text-[44px] 2xl:text-[48px]',
              )}
            >
              What can I do for you today?
            </div>
            <div className="mb-4 mt-2 text-center">
              Write blog articles, build software, solve math problems, and much
              more.
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="text-[13px] font-medium leading-[18px] text-gray-400">
                Current Model:
              </div>
              <div className="flex items-center">
                <div className="flex h-[34px] flex-row items-center rounded-full bg-[#01E3F5] pl-4 pr-1 text-[13px] font-medium leading-[18px]">
                  {findModel?.icon && (
                    <Image
                      className="rounded-md"
                      src={findModel.icon}
                      alt="model"
                      width={20}
                      height={20}
                    />
                  )}
                  <div className="ml-1 mr-6 line-clamp-1">
                    {findModel?.name}
                  </div>
                  <ChatModel>
                    <div className="flex h-[26px] cursor-pointer items-center gap-[3px] rounded-full bg-gray-950 pl-3 pr-2 text-white">
                      <div className="text-[13px] font-medium">Model</div>
                      <span className="i-mingcute-down-fill" />
                    </div>
                  </ChatModel>
                </div>
                <Prompt>
                  <Button
                    className="ml-2 h-[34px] rounded-full text-[13px] leading-[18px]"
                    variant="outline"
                  >
                    Advanced
                  </Button>
                </Prompt>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        <Button
                          className="ml-2 h-[34px] w-[34px] rounded-full p-0"
                          variant="outline"
                          onClick={() => setUploadOpen(true)}
                          disabled={hasWorkspace}
                        >
                          <span className="i-mingcute-plus-line text-lg" />
                        </Button>
                      </div>
                    </TooltipTrigger>
                    {hasWorkspace && (
                      <TooltipContent>
                        <p>
                          Only one workspace is allowed. Upload files to the
                          existing workspace.
                        </p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
          <div className="mb-3 mt-20 w-full md:mt-16">
            <ChatInput />
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {randomPrompts.map((item, index) => (
              <div
                key={index}
                className="flex h-9 cursor-pointer items-center rounded-lg border bg-white px-3 text-sm font-medium text-gray-950"
                onClick={() => {
                  addMessage({
                    id: activeId,
                    role: 'user',
                    content: item.value,
                    model: chat?.model ?? 'mistralai/mistral-small-24b-instruct',
                  })
                  sendChat(activeId, chat?.model ?? 'mistralai/mistral-small-24b-instruct')
                }}
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} />
    </div>
  )
}
