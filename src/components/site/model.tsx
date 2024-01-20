import React from "react";
import type { ChannelModel } from "@/hooks/useChannel";
import { cn } from "@/lib/utils";

export default function Model({
  model,
  loading,
}: {
  model: ChannelModel;
  loading?: boolean;
}) {
  const { name } = model;

  if (loading) {
    return (
      <span className="i-mingcute-loading-fill h-8 w-8 animate-spin text-sky-400 dark:text-sky-500" />
    );
  }

  return (
    <div
      className={cn("h-8 w-8 rounded-full flex justify-center items-center", {
        "bg-[#5bc083]": name.startsWith("gpt-3"),
        "bg-[#a26bf7]": name.startsWith("gpt-4"),
        "bg-[#df6b29]": name.startsWith("dall"),
      })}
    >
      <span className="i-ri-openai-fill text-white w-7 h-7" />
    </div>
  );
}
