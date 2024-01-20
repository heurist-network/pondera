import React from "react";
import type { ChatItem, ChannelModel } from "@/hooks/useChannel";
import Model from "@/components/site/model";

export interface AvatarProps {
  role: ChatItem["role"];
  model: ChannelModel;
}

export default function ChatAvatar({ role, model }: AvatarProps) {
  if (role === "assistant") return <Model model={model} />;

  if (role === "user") {
    return (
      <div className="h-8 w-8 bg-black/25 dark:bg-slate-50 rounded-full flex flex-shrink-0 justify-center items-center">
        <span className="i-mingcute-user-3-fill h-5 w-5 text-white dark:text-neutral-600" />
      </div>
    );
  }

  return null;
}
