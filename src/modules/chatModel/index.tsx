import { useState } from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useChatStore } from '@/store/chat'

export function ChatModel({ children }: { children: React.ReactNode }) {
  const { models } = useChatStore()

  const [position, setPosition] = useState('bottom')

  console.log(models, 'models')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          {models.map((model) => (
            <DropdownMenuRadioItem key={model.name} value={model.name}>
              {model.name}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
