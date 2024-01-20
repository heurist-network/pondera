import React from "react";
import { Inter } from "next/font/google";
import type { Metadata, Viewport } from "next";
import Providers from "./providers";
import { Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";
import "@/styles/globals.css";
import { env } from "@/env.mjs";

export const metadata: Metadata = {
  title: "Le-AI",
  description:
    "Le-AI is an open-source software that can serve as your personal AI assistant.",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
        sizes: "any",
      },
      {
        url: "/favicon-96x96.png",
        type: "image/png",
        sizes: "96x96",
      },
      {
        url: "/android-icon-192x192.png",
        type: "image/png",
        sizes: "192x192",
      },
    ],
    apple: [
      {
        sizes: "152x152",
        url: "/apple-icon-152x152.png",
      },
      {
        sizes: "180x180",
        url: "/apple-icon-180x180.png",
      },
    ],
  },
  appleWebApp: { capable: true, title: "Le-AI" },
  openGraph: {
    title: "Le-AI | An AI Assitant Hub",
    description:
      "Le-AI is an open-source software that can serve as your personal AI assistant.",
    url: "https://le-ai.app",
    siteName: "Le-AI",
    locale: "en_US",
    type: "website",
    images: {
      url: "https://le-ai.app/opengraph-image.png?v=2",
      width: 1200,
      height: 675,
      alt: "Le-AI",
    },
  },
  twitter: {
    card: "summary_large_image",
    title: "Le-AI | An AI Assitant Hub",
    description:
      "Le-AI is an open-source software that can serve as your personal AI assistant.",
    site: "@peekbomb",
    creator: "@peekbomb",
    images: {
      url: "https://le-ai.app/twitter-image.png?v=2",
      width: 1200,
      height: 675,
      alt: "Le-AI",
    },
  },
};

export const viewport: Viewport = {
  width: "device-width",
  height: "device-height",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="h-full" lang="en" suppressHydrationWarning>
      {!!(env.UMAMI_SCRIPT_URL && env.UMAMI_WEBSITE_ID) && (
        <script
          async
          src={env.UMAMI_SCRIPT_URL}
          data-website-id={env.UMAMI_WEBSITE_ID}
        />
      )}
      <body
        className={cn(
          "relative h-full before:inset-0 before:bg-global before:bg-cover before:absolute before:opacity-50",
          inter.className
        )}
      >
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  );
}
