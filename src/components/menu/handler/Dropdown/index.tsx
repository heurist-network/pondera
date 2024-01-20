import React from "react";
import Link from "next/link";
import Locale from "@/locales";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Theme from "./theme";
import ImportExport, { ImportExportInput } from "./importExport";
import ApiConfigure from "./apiConfigure";
import ApiConfigureDialog from "./apiConfigure/doalog";
import ModelSetting from "./modelSetting";
import ModelSettingDialog from "./modelSetting/dialog";
import SendMsg from "./sendMsg";
import Plugin from "./plugin";
import ResetData from "./resetData";
import ResetDialog from "./resetData/dialog";
import TTS from "./tts";

export default function Dropdown() {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <span className="i-mingcute-settings-3-line h-6 w-6" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel className="py-0">
            <div className="flex items-center justify-center">
              <Image src="/logo.png" alt="logo" width={26} height={26} />
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Theme />
            <ApiConfigure />
            <ModelSetting />
            <ImportExport />
            <SendMsg />
            <DropdownMenuItem disabled>
              <span className="i-mingcute-cloud-line mr-2 h-4 w-4" />
              <span>{Locale.global["backup-sync"]}</span>
            </DropdownMenuItem>
            <TTS />
            <Plugin />
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <span className="i-mingcute-contacts-line mr-2 h-4 w-4" />
                <span>{Locale.global.contact}</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem asChild>
                    <Link
                      href="https://twitter.com/peekbomb"
                      target="_blank"
                      className="flex items-center"
                    >
                      <span className="i-ri-twitter-x-fill mr-2 h-4 w-4" />
                      <span>X</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link
                      href="https://goethan.cc"
                      target="_blank"
                      className="flex items-center"
                    >
                      <span className="i-mingcute-book-5-line mr-2 h-4 w-4" />
                      <span>Blog</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem asChild>
              <Link
                href="https://docs.le-ai.app/client/privacy"
                target="_blank"
                className="flex items-center"
              >
                <span className="i-mingcute-safe-lock-line mr-2 h-4 w-4" />
                <span>{Locale.global["privacy"]}</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <ResetData />
        </DropdownMenuContent>
      </DropdownMenu>
      <ImportExportInput />
      <ApiConfigureDialog />
      <ModelSettingDialog />
      <ResetDialog />
    </>
  );
}
