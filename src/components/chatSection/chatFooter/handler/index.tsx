import React from "react";
import Locale from "@/locales";
import { useChannelStore } from "@/hooks/useChannel";
import { Button } from "@/components/ui/button";
import Setting from "./settingForm";
import ClearContext from "./clearContext";

export default function Handler() {
  const addContext = useChannelStore((state) => state.addContext);

  return (
    <div className="flex justify-between items-center mb-1.5">
      <div className="flex gap-2">
        <Setting />
        {/* <Button
          className="rounded-full w-7 lg:w-auto lg:px-[10px] h-7 text-xs"
          size="icon"
        >
          <span className="i-mingcute-share-2-line h-4 w-4" />
          <span className="hidden lg:inline-block ml-1.5">
            {Locale.global.share}
          </span>
        </Button> */}
        <Button
          className="rounded-full w-7 lg:w-auto lg:px-[10px] h-7 text-xs"
          size="icon"
          onClick={addContext}
        >
          <span className="i-mingcute-add-line h-4 w-4" />
          <span className="hidden lg:inline-block ml-1.5">
            {Locale.chat["new-chat"]}
          </span>
        </Button>
      </div>
      <ClearContext />
    </div>
  );
}
