"use client";

import React from "react";
import { useChannelStore, type ChannelModel } from "@/hooks/useChannel";
import Locale from "@/locales";
import { MODLES } from "@/lib/models";

export default function Title() {
  const [activeId, channelList] = useChannelStore((state) => [
    state.activeId,
    state.list,
  ]);

  const { channel_name, channel_model } = React.useMemo(() => {
    const find = channelList.find((ch) => ch.channel_id === activeId);
    return {
      channel_name: find?.channel_name || "",
      channel_model: find?.channel_model || ({} as ChannelModel),
    };
  }, [activeId, channelList]);

  const modelName = React.useMemo(() => {
    const findModel = MODLES.find((item) => item.value === channel_model.name);
    return findModel?.name || "";
  }, [channel_model]);

  return (
    <div className="flex flex-col justify-center h-full items-center">
      <div className="truncate max-w-[calc(100%-200px)] font-semibold transition-colors">
        {channel_name || Locale.chat["new-conversation"]}
      </div>
      <div className="text-xs text-muted-foreground">{modelName}</div>
    </div>
  );
}
