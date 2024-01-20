import { v4 as uuidv4 } from "uuid";
import type { ChannelListItem } from "./types";
import { BASE_PROMPT } from "@/lib/constant";
import { isUndefined } from "@/lib/is";
import { MODLES } from "@/lib/models";

export const initChannelList: ChannelListItem[] = [
  {
    channel_id: uuidv4(),
    channel_name: "",
    channel_model: {
      type: "openai",
      name: "gpt-3.5-turbo",
    },
    channel_prompt: BASE_PROMPT,
    channel_prompt_name: "system",
    channel_loading_connect: false,
    channel_loading: false,
    channel_context_length: 8,
    channel_plugins: [],
    channel_summarize: "",
    channel_summarize_threshold: 1000,
    channel_size: "1024x1024",
    channel_quality: "standard",
    channel_style: "vivid",
    chat_list: [],
  },
];

export const getInitChannelList = () => {
  let channelList = initChannelList;

  try {
    const localChannelList = localStorage.getItem("channelList");
    if (localChannelList && JSON.parse(localChannelList).length) {
      channelList = JSON.parse(localChannelList).map(
        (item: ChannelListItem) => {
          if (!item.channel_model) {
            item.channel_model = {
              type: "openai",
              name: "gpt-3.5-turbo",
            };
            item.channel_prompt = "";
            item.channel_prompt_name = "";
          } else {
            const find = MODLES.find(
              (val) => val.value === item.channel_model.name
            );
            if (!find) {
              item.channel_model = {
                type: "openai",
                name: "gpt-3.5-turbo",
              };
            }
          }
          if (!item.channel_prompt) item.channel_prompt = BASE_PROMPT;
          if (!item.channel_prompt_name) item.channel_prompt_name = "system";

          // 默认 size：1024x1024
          if (!item.channel_size) item.channel_size = "1024x1024";
          if (!item.channel_quality) item.channel_quality = "standard";
          if (!item.channel_style) item.channel_style = "vivid";

          item.channel_loading_connect = false;
          item.channel_loading = false;

          item.chat_list.forEach((item) => {
            item.tts_loading = false;
            item.play_tts = false;
          });

          if (isUndefined(item.channel_context_length)) {
            item.channel_context_length = 8;
          }

          item.channel_plugins = item.channel_plugins || [];

          if (isUndefined(item.channel_summarize_threshold)) {
            item.channel_summarize_threshold = 1000;
          }

          return item;
        }
      );
    }
  } catch (error) {
    console.log(error, "getInitChannelList error");
  }

  return channelList;
};

export const getInitActiveId = (channelList: ChannelListItem[]) => {
  const localActiveId = localStorage.getItem("activeId");
  if (localActiveId) {
    const find = channelList.find((item) => item.channel_id === localActiveId);
    if (find) return localActiveId;
  }

  if (channelList.length) return channelList[0].channel_id;

  return "";
};
