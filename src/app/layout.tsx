import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";
import { Provider } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pondera | Open-source AI Chat",
  description: "Pondera is an open-source conversational AI assistant that makes the best language models available to everyone. Powered by Heurist.",
  // icons: {
  //   icon: [
  //     {
  //       url: "/favicon.ico",
  //       type: "image/x-icon",
  //       sizes: "any",
  //     },
  //     {
  //       url: "/favicon-96x96.png",
  //       type: "image/png",
  //       sizes: "96x96",
  //     },
  //     {
  //       url: "/android-icon-192x192.png",
  //       type: "image/png",
  //       sizes: "192x192",
  //     },
  //   ],
  //   apple: [
  //     {
  //       sizes: "152x152",
  //       url: "/apple-icon-152x152.png",
  //     },
  //     {
  //       sizes: "180x180",
  //       url: "/apple-icon-180x180.png",
  //     },
  //   ],
  // },
  // appleWebApp: { capable: true, title: "Le-AI" },
  // openGraph: {
  //   title: "Le-AI | An AI Assitant Hub",
  //   description:
  //     "Le-AI is an open-source software that can serve as your personal AI assistant.",
  //   url: "https://le-ai.app",
  //   siteName: "Le-AI",
  //   locale: "en_US",
  //   type: "website",
  //   images: {
  //     url: "https://le-ai.app/opengraph-image.png?v=2",
  //     width: 1200,
  //     height: 675,
  //     alt: "Le-AI",
  //   },
  // },
  // twitter: {
  //   card: "summary_large_image",
  //   title: "Le-AI | An AI Assitant Hub",
  //   description:
  //     "Le-AI is an open-source software that can serve as your personal AI assistant.",
  //   site: "@peekbomb",
  //   creator: "@peekbomb",
  //   images: {
  //     url: "https://le-ai.app/twitter-image.png?v=2",
  //     width: 1200,
  //     height: 675,
  //     alt: "Le-AI",
  //   },
  // },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Provider>{children}</Provider>
        <Toaster />
      </body>
    </html>
  );
}
