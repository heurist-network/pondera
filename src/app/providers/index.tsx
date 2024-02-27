'use client'

import * as React from 'react'

import { ZunstandProvider } from './zustand'

export function Provider({ children }: { children: React.ReactNode }) {
  return <ZunstandProvider>{children}</ZunstandProvider>
}
