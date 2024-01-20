import React from "react";
import RemarkMath from "remark-math";
import RemarkBreaks from "remark-breaks";
import RehypeKatex from "rehype-katex";
import RemarkGfm from "remark-gfm";
import Image from "next/image";
import type { ChatItem } from "@/hooks/useChannel";
import { MemoizedReactMarkdown } from "./reactMarkdown";
import CodeBlock from "./codeBlock";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export default function ChatContent({ item }: { item: ChatItem }) {
  if (item.is_dall) {
    return (
      <div className="py-1 relative">
        <Image
          className="rounded-lg w-[500px] max-w-[calc(100vw-8rem)]"
          src={item.content}
          alt="dall-e-3"
          width={1024}
          height={1024}
        />
        <Dialog>
          <DialogTrigger asChild>
            <div className="absolute left-1 bottom-1 bg-[rgba(0,0,0,0.30)] text-white rounded-lg text-sm px-1 font-bold cursor-pointer">
              ALT
            </div>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Image prompt</DialogTitle>
              <DialogDescription>{item.dall_prompt}</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <MemoizedReactMarkdown
      className="prose dark:prose-invert md:max-w-[calc(100vw-416px)] max-w-[calc(100vw-136px)]"
      remarkPlugins={[RemarkGfm, RemarkMath, RemarkBreaks]}
      rehypePlugins={[RehypeKatex]}
      components={{
        code(props) {
          const { children, className } = props;
          const match = /language-(\w+)/.exec(className || "");
          return match ? (
            <CodeBlock
              value={String(children).replace(/\n$/, "")}
              language={match[1]}
            />
          ) : (
            <code className={className}>{children}</code>
          );
        },
        table({ children }) {
          return (
            <table className="border-collapse border border-black py-1 px-3 dark:border-white">
              {children}
            </table>
          );
        },
        th({ children }) {
          return (
            <th
              className={cn(
                "border border-black bg-gray-500 text-white py-1 px-3 break-words",
                "dark:bg-gray-700 dark:border-white/70"
              )}
            >
              {children}
            </th>
          );
        },
        td({ children }) {
          return (
            <td className="border border-black py-1 px-3 break-words dark:border-white/70">
              {children}
            </td>
          );
        },
      }}
    >
      {item.content}
    </MemoizedReactMarkdown>
  );
}
