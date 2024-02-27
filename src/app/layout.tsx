import { Inter } from 'next/font/google'
import type { Metadata, Viewport } from 'next'

import { env } from '@/env.mjs'

import '@/styles/globals.css'

import { Toaster } from 'react-hot-toast'

import { Provider } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  width: 'device-width',
  height: 'device-height',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: 'Pondera | Open-source AI Chat',
  description:
    'Pondera is an open-source conversational AI assistant that makes the best language models available to everyone. Powered by Heurist.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      {!!(env.UMAMI_URL && env.UMAMI_WEBSITE_ID) && (
        <script
          async
          src={env.UMAMI_URL}
          data-website-id={env.UMAMI_WEBSITE_ID}
        />
      )}
      <body className={inter.className}>
        <Provider>{children}</Provider>
        <Toaster />
      </body>
    </html>
  )
}
