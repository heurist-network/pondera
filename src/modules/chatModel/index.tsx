/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import Image from 'next/image'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useChatStore } from '@/store/chat'

export function ChatModel({ children }: { children: React.ReactNode }) {
  const {
    models,
    updateChat,
    getActiveChat,
    activeId,
    addMessage,
    updateMessage,
  } = useChatStore()

  const activeChat = getActiveChat(activeId)

  const onChangeModel = (model: string) => {
    const findModel = models.find((item) => item.name === model)
    const prompt = findModel?.system_prompt || 'You are a helpful AI assistant.'
    const isDeepseekR1Model =
      model === 'deepseek/deepseek-r1' ||
      model === 'NaniDAO/deepseek-r1-qwen-2.5-32B-ablated' ||
      model === 'deepseek/deepseek-r1-distill-llama-70b'

    updateChat(activeId, {
      model,
      prompt,
      chainOfThought: isDeepseekR1Model ? true : activeChat?.chainOfThought,
    })

    if (!activeChat?.list.length) return

    if (activeChat?.list.at(-1)?.role !== 'system') {
      addMessage({
        id: activeId,
        role: 'system',
        content: `switch to ${model} model`,
        model: model,
      })
    } else {
      updateMessage({
        chat_id: activeId,
        message_id: activeChat?.list.at(-1)?.id!,
        content: `switch to ${model} model`,
        model: model,
      })
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuRadioGroup
          value={activeChat?.model}
          onValueChange={onChangeModel}
        >
          {models.map((model) => (
            <DropdownMenuRadioItem key={model.name} value={model.name}>
              <Image
                className="mr-2 rounded-md"
                src={model.icon}
                alt="icon"
                width={24}
                height={24}
              />
              {model.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
