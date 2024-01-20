import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import LanSelect from "./lanSelect";
import DropdownMenu from "./Dropdown";
import { env } from "@/env.mjs";

export default function Handler() {
  return (
    <div className="flex flex-col">
      <Link href={env.NEXT_PUBLIC_LE_AI_API_LINK} target="_blank">
        <Button
          className="h-11 text-lg font-semibold w-full !text-transparent"
          variant="ghost"
        >
          <span className="bg-clip-text animate-flow bg-logo bg-[size:400%]">
            Le-AI API
          </span>
        </Button>
      </Link>
      <div className="h-8 flex items-center justify-center text-sm text-muted-foreground">
        <div className="flex h-5 items-center space-x-4">
          <Link
            href="https://docs.le-ai.app/client/privacy"
            target="_blank"
            className="hover:underline"
          >
            Privacy
          </Link>
          <Separator orientation="vertical" className="dark:bg-slate-600" />
          <Link
            href="https://docs.le-ai.app"
            target="_blank"
            className="hover:underline"
          >
            Docs
          </Link>
          <Separator orientation="vertical" className="dark:bg-slate-600" />
          <Link
            href="https://docs.le-ai.app/client/faq"
            target="_blank"
            className="hover:underline"
          >
            FAQS
          </Link>
        </div>
      </div>

      <div className="h-11 flex justify-between items-center">
        <Link href="https://github.com/LTopx/Le-AI" target="_blank">
          <Button variant="ghost" size="icon">
            <span className="i-mingcute-github-line h-6 w-6" />
          </Button>
        </Link>
        <Link href="https://t.me/+7fLJJoGV_bJhYTk1" target="_blank">
          <Button variant="ghost" size="icon">
            <span className="i-mingcute-telegram-fill h-6 w-6 text-[#28a2e9]" />
          </Button>
        </Link>
        <LanSelect />
        <DropdownMenu />
      </div>
    </div>
  );
}
