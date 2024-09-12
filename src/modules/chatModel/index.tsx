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
  const { models, updateChat, getActiveChat, activeId } = useChatStore()

  const activeChat = getActiveChat(activeId)

  const onChangeModel = (model: string) => updateChat(activeId, { model })

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