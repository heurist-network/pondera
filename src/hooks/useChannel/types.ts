import { type Character } from "@/lib/character";

export interface ChannelModel {
  type: string;
  name: string;
}

export type ChannelSize = "1024x1024" | "1792x1024" | "1024x1792";
export type ChannelQuality = "standard" | "hd";
export type ChannelStyle = "vivid" | "natural";

export interface ChatItem {
  id: string;
  /** AI Role */
  role: "user" | "assistant" | "system";
  time: string;
  content: string;
  is_summarized?: boolean;
  is_dall?: boolean;
  channel_size?: ChannelSize;
  tts_loading?: boolean;
  play_tts?: boolean;
  dall_prompt?: string;
}

export interface ChannelListItem {
  channel_id: string;
  channel_name: string;
  channel_model: ChannelModel;
  channel_prompt: string;
  channel_prompt_name: string;
  channel_loading_connect: boolean;
  channel_loading: boolean;
  channel_context_length: number;
  channel_plugins: string[];
  channel_summarize: string;
  channel_summarize_threshold: number;
  channel_size: ChannelSize;
  channel_quality: ChannelQuality;
  channel_style: ChannelStyle;
  chat_list: ChatItem[];
}

export interface SendGPT {
  channel_id: string;
  apiKey: string;
  model: string;
  max_tokens: number;
  temperature: number;
  proxy?: string;
  channel_size?: ChannelSize;
}

export interface SendTTS {
  channel_id: string;
  chat_id: string;
  apiKey: string;
  proxy?: string;
}

export type ChannelStore = {
  activeId: string;
  list: ChannelListItem[];
  abort: Record<string, AbortController>;
  audio: Record<string, AudioContext>;
  audioAbort: Record<string, AbortController>;

  updateActiveId: (activeId: string) => void;
  updateContent: (id: string, content: string) => void;
  updateList: (list: ChannelListItem[]) => void;
  clearList: () => void;
  addContext: () => void;
  clearContext: () => void;
  deleteContext: (id: string) => void;
  updateCharacter: (item: Character) => void;
  resetCharacter: () => void;
  addChatItem: (content: string) => void;

  sendGPT: ({
    channel_id,
    apiKey,
    proxy,
  }: SendGPT) => Promise<null | { msg: string; code: number; data?: any }>;
  cancelGPT: (channel_id: string) => void;

  sendDall: ({
    channel_id,
    apiKey,
    proxy,
    channel_size,
  }: SendGPT) => Promise<null | { msg: string; code: number; data?: any }>;

  sendTTS: ({
    channel_id,
    chat_id,
    apiKey,
    proxy,
  }: SendTTS) => Promise<null | { msg: string; code: number; data?: any }>;

  pauseTTS: ({
    channel_id,
    chat_id,
  }: {
    channel_id: string;
    chat_id: string;
  }) => void;

  clearTTS: () => void;

  generateTitle: ({
    channel,
    path,
    headers,
    body,
  }: {
    channel: ChannelListItem;
    path: string;
    headers: Record<string, string>;
    body: BodyInit;
  }) => void;
};
