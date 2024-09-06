import { Inter } from 'next/font/google'
import type { Metadata, Viewport } from 'next'

import { Provider } from './providers'

import './globals.css'

import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'Pondera | Open-source AI Chat',
  description:
    'Pondera is an open-source conversational AI assistant that makes the best language models available to everyone. Powered by Heurist.',
}

export const viewport: Viewport = {
  width: 'device-width',
  height: 'device-height',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={cn(inter.className)}>
      <body>
        <Provider>{children}</Provider>
        <Toaster />
      </body>
    </html>
  )
}
