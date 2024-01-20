"use client";

import React from "react";
import { saveAs } from "file-saver";
import { useFormatter } from "next-intl";
import {
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Locale from "@/locales";
import { toast } from "react-hot-toast";
import { useChannelStore } from "@/hooks/useChannel";
import { useAIStore } from "@/hooks/useAI";
import { useConfigStore } from "@/hooks/useConfig";

export function ImportExportInput() {
  const updateActiveId = useChannelStore((state) => state.updateActiveId);
  const updateList = useChannelStore((state) => state.updateList);
  const updateOpenAI = useAIStore((state) => state.updateOpenAI);
  const updateModelSettings = useAIStore((state) => state.updateModelSettings);
  const updateSendMessageType = useConfigStore(
    (state) => state.updateSendMessageType
  );

  const onImport = (files: FileList | null) => {
    if (!files?.length) return;
    const file = files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        if (json.messages) {
          const { activeId, list } = json.messages;
          const find = list.find((item: any) => item.channel_id === activeId);
          if (find) {
            updateActiveId(activeId);
            updateList(list);
          }
        }

        if (json.configure) {
          const { openai, modelSettings, sendMessageType } = json.configure;
          updateOpenAI(openai);
          updateModelSettings(modelSettings);
          updateSendMessageType(sendMessageType);
        }
        toast.success(Locale.global["operation-successful"]);
      } catch (error) {
        console.log(error, "ImportExportInput error");
      }
    };
    reader.readAsText(file);
  };

  return (
    <input
      id="import-export-input"
      className="sr-only"
      tabIndex={-1}
      type="file"
      accept=".json"
      onClick={(e) => {
        (e.target as HTMLInputElement).value = "";
      }}
      onChange={(e) => onImport(e.target.files)}
    />
  );
}

export default function ImportExport() {
  const format = useFormatter();
  const [openai, modelSettings] = useAIStore((state) => [
    state.openai,
    state.modelSettings,
  ]);
  const [activeId, list] = useChannelStore((state) => [
    state.activeId,
    state.list,
  ]);
  const sendMessageType = useConfigStore((state) => state.sendMessageType);

  const onImport = () => {
    document.getElementById("import-export-input")?.click();
  };

  const onExport = () => {
    const exportData = {
      configure: { openai, modelSettings, sendMessageType },
      messages: { activeId, list },
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: "application/json",
    });
    saveAs(blob, `LGPT_Export_${format.dateTime(new Date())}.json`);
  };

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <span className="i-mingcute-file-line mr-2 h-4 w-4" />
        <span>{Locale.global["export-import"]}</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          <DropdownMenuItem onClick={onImport}>
            <span className="i-mingcute-file-import-line mr-2 h-4 w-4" />
            <span>{Locale.global.import}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onExport}>
            <span className="i-mingcute-file-export-line mr-2 h-4 w-4" />
            <span>{Locale.global.export}</span>
          </DropdownMenuItem>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
