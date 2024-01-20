import React from "react";
import { useDebounceFn } from "ahooks";
import Locale from "@/locales";
import { toast } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { isUrl } from "@/lib/is";
import { useChannelStore, type SendGPT } from "@/hooks/useChannel";
import { useAIStore } from "@/hooks/useAI";
import { useScrollStore } from "@/hooks/useScroll";
import Handler from "./handler";
import Stop from "./handler/stop";
import Textarea from "./textarea";

export default function ChatFooter() {
  const [activeId, list] = useChannelStore((state) => [
    state.activeId,
    state.list,
  ]);

  const AIStore = useAIStore((state) => ({
    openai: state.openai,
  }));

  const modelSettings = useAIStore((state) => state.modelSettings);

  const [inputValue, setInputValue] = React.useState("");

  const findChannel = list.find((item) => item.channel_id === activeId);

  const addChatItem = useChannelStore((state) => state.addChatItem);
  const cancelGPT = useChannelStore((state) => state.cancelGPT);
  const scrollToBottom = useScrollStore((state) => state.scrollToBottom);
  const sendGPT = useChannelStore((state) => state.sendGPT);
  const sendDall = useChannelStore((state) => state.sendDall);
  const { run: onSubmit } = useDebounceFn(() => onSend(), { wait: 200 });

  if (!findChannel) return null;

  const loadingChannel = !!findChannel.channel_loading;

  const onCancel = () => {
    cancelGPT(findChannel.channel_id);
    toast.error(Locale.global["canceled"], { id: "canceled" });
  };

  const onSend = async () => {
    if (loadingChannel || !findChannel) return;
    if (!inputValue?.trim()) {
      return toast.error(Locale.global["please-enter"], { id: "please-enter" });
    }

    // check model
    const modelName = findChannel.channel_model.name;

    const ai = AIStore["openai"];

    if (!ai.apiKey) {
      return toast.error(Locale.code["10002"], { id: "10002", duration: 4000 });
    }

    const params: SendGPT = {
      channel_id: activeId,
      apiKey: ai.apiKey,
      model: modelName,
      max_tokens: modelSettings.max_tokens,
      temperature: modelSettings.temperature,
      channel_size: findChannel.channel_size,
    };

    if (AIStore.openai.proxy && !isUrl(AIStore.openai.proxy)) {
      return toast.error(Locale.code["10006"], { id: "10006" });
    }
    params.proxy = AIStore.openai.proxy;

    setInputValue("");
    addChatItem(inputValue);
    scrollToBottom();

    if (modelName.startsWith("gpt")) {
      sendGPT(params).catch((error) => {
        toast.error((Locale.apiError as any)[error.code] || "system error", {
          id: "apiError",
          duration: 4000,
        });
      });
    } else if (modelName.startsWith("dall")) {
      sendDall(params);
    }
  };

  return (
    <div
      className={cn(
        "bg-gradient-to-b from-transparent w-full px-5 pb-5 bottom-0 left-0 absolute z-50",
        "via-gray-100 to-gray-100",
        "dark:via-neutral-900 dark:to-neutral-900"
      )}
    >
      {loadingChannel ? <Stop onCancel={onCancel} /> : <Handler />}
      <Textarea
        activeId={activeId}
        value={inputValue}
        loading={loadingChannel}
        onChange={setInputValue}
        onSubmit={onSubmit}
      />
    </div>
  );
}
