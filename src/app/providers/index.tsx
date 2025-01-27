'use client'

import * as React from 'react'
import { nanoid } from 'nanoid'

import { clone } from '@/lib/utils'
import { initChatItem, useChatStore } from '@/store/chat'

import { ZunstandProvider } from './zustand'

const URLParamHandler = () => {
  const hasCheckedParams = React.useRef(false)

  React.useEffect(() => {
    if (hasCheckedParams.current) return
    hasCheckedParams.current = true

    const urlParams = new URLSearchParams(window.location.search)
    const modelFromUrl = urlParams.get('model')

    if (modelFromUrl) {
      const id = nanoid()
      const newChat = {
        ...clone(initChatItem),
        id,
        model: modelFromUrl,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }

      const currentState = useChatStore.getState()
      useChatStore.setState({
        list: [...currentState.list, newChat],
        activeId: id,
      })

      // Remove model from URL without reloading
      urlParams.delete('model')
      const newUrl =
        window.location.pathname +
        (urlParams.toString() ? '?' + urlParams.toString() : '')
      window.history.replaceState({}, '', newUrl)
    }
  }, [])

  return null
}

export function Provider({ children }: { children: React.ReactNode }) {
  return (
    <ZunstandProvider>
      <URLParamHandler />
      {children}
    </ZunstandProvider>
  )
}
