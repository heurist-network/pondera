import { useEffect, useState } from 'react'

import { PROMPT_STORE } from '@/lib/constant'

export function useRandomPrompts() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
