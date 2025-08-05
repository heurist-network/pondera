import { Inter } from 'next/font/google'
import type { Metadata, Viewport } from 'next'
import Script from 'next/script'

import { Provider } from './providers'

import './globals.css'

import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: 'Pondera by Heurist - Free AI Chat with Advanced Language Models',
  description:
    'Chat with cutting-edge AI models including GPT, Claude, DeepSeek R1, and 30+ more through Heurist\'s infrastructure. Experience the power of Heurist Cloud with serverless AI inference for coding, reasoning, and creative tasks. Free and open-source.',
  keywords: 'Pondera, Heurist, AI chat, Heurist Cloud, AI infrastructure, language models, GPT OSS 20B, GPT OSS 120B, OpenAI open source, DeepSeek R1, Claude, Llama 3.3, serverless AI, AI economy, Qwen Coder, Mixtral, open source AI, free chatbot, AI assistant, coding AI',
  openGraph: {
    title: 'Pondera - AI Chat Platform by Heurist',
    description: 'Experience Heurist\'s AI infrastructure through Pondera. Chat with OpenAI\'s open-weight GPT, DeepSeek R1, Claude, and 30+ models via Heurist Cloud\'s serverless inference.',
    url: 'https://pondera.heurist.ai',
    siteName: 'Pondera by Heurist',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pondera - Heurist\'s AI Chat Interface',
    description: 'Access GPT, Claude, DeepSeek, and dozens of AI models through Heurist\'s full-stack infrastructure for the AI economy.',
  },
  alternates: {
    canonical: 'https://pondera.heurist.ai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
  const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

  return (
    <html lang="en" className={cn(inter.className)}>
      <head>
      <Script
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body>
        <Provider>{children}</Provider>
        <Toaster />
      </body>
    </html>
  )
}
