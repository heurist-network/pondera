import React from "react";
import { useFormatter } from "next-intl";
import Locale from "@/locales";
import {
  type ChatItem,
  type ChannelListItem,
  type SendGPT,
  type SendTTS,
  useChannelStore,
} from "@/hooks/useChannel";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { useScrollStore } from "@/hooks/useScroll";
import { useAIStore } from "@/hooks/useAI";
import { useTTSStore } from "@/hooks/useTTS";
import { cn } from "@/lib/utils";
import { isUrl } from "@/lib/is";
import ChatConfigure from "../chatConfigure";
import Avatar from "./avatar";
import ChatContent from "../chatContent";
import Handler from "./handler";

export default function ChatList() {
  const formats = useFormatter();
  const [activeId, list] = useChannelStore((state) => [
    state.activeId,
    state.list,
  ]);
  const AIStore = useAIStore((state) => ({
    openai: state.openai,
  }));
  const modelSettings = useAIStore((state) => state.modelSettings);

  const updateList = useChannelStore((state) => state.updateList);
  const scrollToBottom = useScrollStore((state) => state.scrollToBottom);
  const sendGPT = useChannelStore((state) => state.sendGPT);
  const sendDall = useChannelStore((state) => state.sendDall);
  const sendTTS = useChannelStore((state) => state.sendTTS);
  const pauseTTS = useChannelStore((state) => state.pauseTTS);
  const clearTTS = useChannelStore((state) => state.clearTTS);

  const updateOpenTTS = useTTSStore((state) => state.updateOpen);

  const findChannel = list.find((item) => item.channel_id === activeId);

  React.useEffect(() => {
    scrollToBottom();
    clearTTS();
  }, [activeId]);

  if (!findChannel) return null;

  const chatList = findChannel.chat_list || [];

  const onDelete = (item: ChatItem) => {
    const { id, is_summarized } = item;
    const newList: ChannelListItem[] = JSON.parse(JSON.stringify(list));
    const findCh = newList.find((item) => item.channel_id === activeId);
    if (!findCh) return;
    findCh.chat_list = findCh.chat_list.filter((item) => item.id !== id);

    if (is_summarized) {
      findCh.channel_summarize = "";
      findCh.chat_list.forEach((item) => {
        if (item.is_summarized) item.is_summarized = false;
      });
    }

    updateList(newList);
  };

  const onRegenerate = async (item: ChatItem) => {
    const newList: ChannelListItem[] = JSON.parse(JSON.stringify(list));
    const findCh = newList.find((item) => item.channel_id === activeId);
    if (!findCh) return;

    const { channel_loading, channel_loading_connect, chat_list } = findCh;
    if (channel_loading || channel_loading_connect) return;

    const findIndex = chat_list.findIndex((val) => val.id === item.id);

    let arr: ChatItem[] = [];
    if (item.role === "assistant") {
      arr = chat_list.slice(0, findIndex);
    } else if (item.role === "user") {
      arr = chat_list.slice(0, findIndex + 1);
    }
    if (!arr.length) return;

    findCh.chat_list = arr;

    updateList(newList);

    const modelName = findCh.channel_model.name;

    const ai = AIStore["openai"];

    if (!ai.apiKey) {
      return toast.error(Locale.code["10002"], { id: "10002", duration: 4000 });
    }

    const params: SendGPT = {
      channel_id: findCh.channel_id,
      apiKey: ai.apiKey,
      model: modelName,
      max_tokens: modelSettings.max_tokens,
      temperature: modelSettings.temperature,
      channel_size: findCh.channel_size,
    };

    if (AIStore.openai.proxy && !isUrl(AIStore.openai.proxy)) {
      return toast.error(Locale.code["10006"], { id: "10006" });
    }
    params.proxy = AIStore.openai.proxy;

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

  const onHandlerVoice = (item: ChatItem) => {
    if (!item.play_tts) return onPlayVoice(item);
    onPauseVoice(item);
  };

  const onPlayVoice = async (item: ChatItem) => {
    if (item.tts_loading) return;

    const newList: ChannelListItem[] = JSON.parse(JSON.stringify(list));
    const findCh = newList.find((item) => item.channel_id === activeId);
    if (!findCh) return;

    const { channel_loading, channel_loading_connect } = findCh;
    if (channel_loading || channel_loading_connect) return;

    const ai = AIStore["openai"];

    if (!ai.apiKey) {
      return toast.error(Locale.code["10002"], { id: "10002", duration: 4000 });
    }

    const params: SendTTS = {
      channel_id: findCh.channel_id,
      chat_id: item.id,
      apiKey: ai.apiKey,
    };

    if (AIStore.openai.proxy && !isUrl(AIStore.openai.proxy)) {
      return toast.error(Locale.code["10006"], { id: "10006" });
    }
    params.proxy = AIStore.openai.proxy;

    sendTTS(params).catch((error) => {
      toast.error((Locale.apiError as any)[error.code] || "system error", {
        id: "apiError",
        duration: 4000,
      });
    });
  };

  const onPauseVoice = (item: ChatItem) => {
    const newList: ChannelListItem[] = JSON.parse(JSON.stringify(list));
    const findCh = newList.find((item) => item.channel_id === activeId);
    if (!findCh) return;

    pauseTTS({
      channel_id: findCh.channel_id,
      chat_id: item.id,
    });
  };

  const openTTS = () => updateOpenTTS(true);

  return (
    <>
      {!chatList.length && findChannel && (
        <ChatConfigure list={list} channel={findChannel} />
      )}
      <div className="mt-5 flex flex-col gap-5">
        {chatList.map((item, index) => (
          <div
            key={item.id}
            className={cn("flex gap-3 group", { "mt-12": index === 0 })}
          >
            <Avatar role={item.role} model={findChannel.channel_model} />
            <div className="flex flex-col gap-1">
              <div className="text-muted-foreground text-sm flex h-6 items-center gap-4 whitespace-nowrap">
                {formats.dateTime(new Date(Number(item.time)), {
                  month: "numeric",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                })}
                <Handler
                  item={item}
                  onDelete={() => onDelete(item)}
                  onRegenerate={() => onRegenerate(item)}
                />
              </div>
              <div
                className={cn("self-start rounded-xl px-4 py-2 max-w-[125ch]", {
                  "bg-blue-200/70 dark:bg-[hsl(217.2,91.2%,59.8%)]":
                    item.role === "user",
                  "bg-neutral-200/60 dark:bg-[#252525]":
                    item.role === "assistant",
                })}
              >
                <ChatContent item={item} />
              </div>
              {item.role === "assistant" && !item.is_dall && (
                <div className="flex gap-1">
                  <Button
                    className="w-7 h-7 group"
                    variant="outline"
                    size="icon"
                    onClick={() => onHandlerVoice(item)}
                    disabled={item.tts_loading}
                  >
                    {!!item.tts_loading && (
                      <span className="i-ri-loader-4-line animate-spin text-muted-foreground w-4 h-4" />
                    )}

                    {!!item.play_tts && (
                      <span className="i-ri-pause-circle-fill text-muted-foreground transition-colors group-hover:text-black w-4 h-4" />
                    )}

                    {!item.tts_loading && !item.play_tts && (
                      <span className="i-ri-play-fill text-muted-foreground transition-colors group-hover:text-black h-4 w-4" />
                    )}
                  </Button>

                  <Button
                    className="w-7 h-7 group"
                    variant="outline"
                    size="icon"
                    onClick={openTTS}
                  >
                    <span className="i-ri-settings-3-line text-muted-foreground transition-colors group-hover:text-black h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
        {!!findChannel.channel_loading_connect && (
          <span className="ml-11 i-lucide-loader-2 h-5 w-5 animate-spin" />
        )}
        <div className="h-28 overflow-hidden" />
      </div>
    </>
  );
}
