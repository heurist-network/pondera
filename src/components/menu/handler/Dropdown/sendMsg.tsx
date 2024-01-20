"use client";

import React from "react";
import {
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { getPlatform, type Platform } from "@/lib/platform";
import Locale from "@/locales";
import { useConfigStore, type ConfigStore } from "@/hooks/useConfig";

export default function SendMsg() {
  const [plat, setPlat] = React.useState<Platform>("windows");
  const sendMessageType = useConfigStore((state) => state.sendMessageType);

  const updateSendMessageType = useConfigStore(
    (state) => state.updateSendMessageType
  );

  React.useEffect(() => {
    setPlat(getPlatform());
  }, []);

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <span className="i-mingcute-send-line mr-2 h-4 w-4" />
        <span>{Locale.global["send-message"]}</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuRadioGroup
            value={sendMessageType}
            onValueChange={(value) =>
              updateSendMessageType(value as ConfigStore["sendMessageType"])
            }
          >
            <DropdownMenuRadioItem value="Enter">
              <span>Enter</span>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="CommandEnter">
              <span>{plat === "mac" ? "⌘" : "Ctrl"} + Enter</span>
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
