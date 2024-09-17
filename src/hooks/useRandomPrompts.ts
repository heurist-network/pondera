import { useEffect, useState } from 'react'

import { PROMPT_STORE } from '@/lib/constant'

export function useRandomPrompts() {
  const [prompts, setPrompts] = useState<any[]>([])

  useEffect(() => {
    const randomPrompts = PROMPT_STORE.sort(() => Math.random() - 0.5).slice(
      0,
      3,
    )
    setPrompts(randomPrompts)
  }, [])

  return prompts
}
