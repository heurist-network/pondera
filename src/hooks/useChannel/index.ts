import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import { v4 as uuidv4 } from "uuid";
import { fetchEventSource } from "@fortaine/fetch-event-source";
import { MODLES, LLM_PROXY } from "@/lib/models";
import { useScrollStore } from "../useScroll";
import { useTTSStore } from "../useTTS";
import type { ChannelListItem, ChannelStore, ChatItem } from "./types";
import { BASE_PROMPT } from "@/lib/constant";
import { useModelCacheStore } from "../useModelCache";
import Locale from "@/locales";
import { initChannelList, getInitChannelList, getInitActiveId } from "./lib";
import toast from "react-hot-toast";

export type {
  ChannelListItem,
  ChatItem,
  ChannelModel,
  ChannelSize,
  ChannelQuality,
  ChannelStyle,
  SendGPT,
  SendTTS,
} from "./types";

export { initChannelList };

export const useChannelStore = createWithEqualityFn<ChannelStore>(
  (set) => ({
    activeId: "",
    list: [],
    abort: {},
    audio: {},
    audioAbort: {},

    updateActiveId: (activeId) => {
      localStorage.setItem("activeId", activeId);
      set({ activeId });
    },

    updateContent: (id, content) => {
      set((state) => {
        const newList: ChannelListItem[] = JSON.parse(
          JSON.stringify(state.list)
        );
        const findCh = newList.find(
          (item) => item.channel_id === state.activeId
        );
        if (!findCh) return {};

        const findChat = findCh.chat_list.find((item) => item.id === id);
        if (!findChat) return {};

        findChat.content = content;

        localStorage.setItem("channelList", JSON.stringify(newList));

        return { list: newList };
      });
    },

    updateList: (list) => {
      localStorage.setItem("channelList", JSON.stringify(list));
      set({ list });
    },
    // 清空所有会话
    // Clear all conversations
    clearList: () => {
      set(() => {
        const activeId = initChannelList[0].channel_id;
        localStorage.setItem("channelList", JSON.stringify(initChannelList));
        localStorage.setItem("activeId", activeId);
        return { activeId, list: initChannelList };
      });
    },

    // 添加会话
    // Add conversation
    addContext: () => {
      set((state) => {
        try {
          const channel_id = uuidv4();
          const addItem = { ...initChannelList[0], channel_id };

          const { checkModel } = useModelCacheStore.getState();
          checkModel(addItem);

          const list = [addItem, ...state.list];
          const activeId = channel_id;
          localStorage.setItem("channelList", JSON.stringify(list));
          localStorage.setItem("activeId", activeId);
          return { list, activeId };
        } catch {
          return {};
        }
      });
    },

    // 清空当前会话
    // Clear current session
    clearContext: () => {
      set((state) => {
        const newList: ChannelListItem[] = JSON.parse(
          JSON.stringify(state.list)
        );
        const findCh = newList.find(
          (item) => item.channel_id === state.activeId
        );
        if (!findCh) return {};

        // If the user selects a certain role, the character-related content
        // will not be cleared when clearing the conversation.
        if (findCh.channel_prompt_name === "system") {
          findCh.channel_name = "";
          findCh.channel_prompt = BASE_PROMPT;
          findCh.channel_prompt_name = "system";
        }

        findCh.chat_list = [];
        findCh.channel_loading_connect = false;
        findCh.channel_loading = false;

        localStorage.setItem("channelList", JSON.stringify(newList));

        return { list: newList };
      });
    },

    // 删除当前会话
    // Delete current session
    deleteContext: (id) => {
      set((state) => {
        if (state.list.length <= 1) {
          const activeId = initChannelList[0].channel_id;
          localStorage.setItem("channelList", JSON.stringify(initChannelList));
          localStorage.setItem("activeId", activeId);
          return { activeId, list: initChannelList };
        } else {
          const list = state.list.filter((item) => item.channel_id !== id);
          localStorage.setItem("channelList", JSON.stringify(list));
          if (id === state.activeId) {
            const activeId = list[0].channel_id;
            localStorage.setItem("activeId", activeId);
            return { list, activeId };
          }
          return { list };
        }
      });
    },

    // 更新当前会话的 prompt
    // Update the prompt of the current session
    updateCharacter: (item) => {
      set((state) => {
        const newList: ChannelListItem[] = JSON.parse(
          JSON.stringify(state.list)
        );
        const findCh = newList.find(
          (item) => item.channel_id === state.activeId
        );
        if (!findCh) return {};

        findCh.channel_name = item.name;
        findCh.channel_prompt_name = item.name;
        findCh.channel_prompt = item.content;
        findCh.channel_model = {
          type: item.model_config.model_type,
          name: item.model_config.model_name,
        };
        findCh.channel_context_length = item.model_config.context_length;
        if (item.welcome && !findCh.chat_list.length) {
          findCh.chat_list.push({
            id: uuidv4(),
            role: "assistant",
            time: String(+new Date()),
            content: item.welcome,
          });
        }

        localStorage.setItem("channelList", JSON.stringify(newList));

        return { list: newList };
      });
    },

    // 重置为默认 system prompt
    resetCharacter: () => {
      set((state) => {
        const newList: ChannelListItem[] = JSON.parse(
          JSON.stringify(state.list)
        );
        const findCh = newList.find(
          (item) => item.channel_id === state.activeId
        );
        if (!findCh) return {};

        findCh.channel_name = "";
        findCh.channel_prompt_name = "system";
        findCh.channel_prompt = BASE_PROMPT;

        localStorage.setItem("channelList", JSON.stringify(newList));

        return { list: newList };
      });
    },

    // 添加聊天内容
    // Add chat content
    addChatItem: (content) => {
      set((state) => {
        const newList: ChannelListItem[] = JSON.parse(
          JSON.stringify(state.list)
        );
        const findCh = newList.find(
          (item) => item.channel_id === state.activeId
        );
        if (!findCh) return {};

        findCh.chat_list.push({
          id: uuidv4(),
          role: "user",
          time: String(+new Date()),
          content,
        });

        localStorage.setItem("channelList", JSON.stringify(newList));

        return { list: newList };
      });
    },

    // 发送 GPT 请求
    // Send GPT request
    sendGPT: ({
      channel_id,
      apiKey,
      proxy,
      model,
      max_tokens,
      temperature,
    }) => {
      return new Promise((resolve, reject) => {
        let findCh: ChannelListItem | undefined;

        set((state) => {
          const newList: ChannelListItem[] = JSON.parse(
            JSON.stringify(state.list)
          );
          findCh = newList.find((item) => item.channel_id === channel_id);
          if (!findCh) return {};

          if (!findCh.channel_prompt) findCh.channel_prompt = BASE_PROMPT;
          findCh.channel_loading_connect = true;
          findCh.channel_loading = true;

          localStorage.setItem("channelList", JSON.stringify(newList));

          return { list: newList };
        });

        if (!findCh) return reject(null);

        const controller = new AbortController();

        const path = `${proxy || LLM_PROXY}/chat/completions`;

        const headers: Record<string, string> = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        };

        set((state) => {
          return { abort: { ...state.abort, [channel_id]: controller } };
        });

        try {
          fetchEventSource(path, {
            method: "POST",
            openWhenHidden: true,
            headers,
            signal: controller.signal,
            body: JSON.stringify({
              stream: true,
              max_tokens,
              // model: "meta/llama-2-70b-chat",
              model,
              temperature,
              messages: [
                { role: "system", content: findCh.channel_prompt },
                ...findCh.chat_list.map((item) => ({
                  role: item.role,
                  content: item.content,
                })),
              ],
            }),
            onopen: async (res) => {
              const isError = !res.ok || res.status !== 200 || !res.body;

              set((state) => {
                const newList: ChannelListItem[] = JSON.parse(
                  JSON.stringify(state.list)
                );
                const findCh = newList.find(
                  (item) => item.channel_id === channel_id
                );
                if (!findCh) return {};

                findCh.channel_loading_connect = false;

                if (isError) findCh.channel_loading = false;

                localStorage.setItem("channelList", JSON.stringify(newList));

                return { list: newList };
              });

              if (isError) {
                const errRes = await res.json();
                reject(errRes);
              }
            },
            onmessage: (res) => {
              if (res.data === "[DONE]") {
                set((state) => {
                  const newList: ChannelListItem[] = JSON.parse(
                    JSON.stringify(state.list)
                  );
                  const findCh = newList.find(
                    (item) => item.channel_id === channel_id
                  );
                  if (!findCh) return {};

                  const findModelLabel: any = MODLES.find(
                    (item: any) => item.value === findCh?.channel_model.name
                  );

                  if (!findModelLabel) return {};

                  localStorage.setItem("channelList", JSON.stringify(newList));

                  if (!findCh.channel_name) {
                    const path = `${proxy || LLM_PROXY}/chat/completions`;
                    state.generateTitle({
                      channel: findCh,
                      path,
                      headers,
                      body: JSON.stringify({
                        stream: true,
                        max_tokens,
                        // gpt-3.5-turbo-1106 is fast
                        model: "gpt-3.5-turbo-1106",
                        temperature,
                        messages: [
                          ...findCh.chat_list.map((item) => ({
                            role: item.role,
                            content: item.content,
                          })),
                          {
                            role: "user",
                            content: Locale.prompt["get-title"],
                          },
                        ],
                      }),
                    });
                  }

                  return { list: newList };
                });
                return resolve(null);
              }

              try {
                const content = JSON.parse(res.data).choices[0].delta.content;
                if (!content) return;
                set((state) => {
                  const newList: ChannelListItem[] = JSON.parse(
                    JSON.stringify(state.list)
                  );
                  const findCh = newList.find(
                    (item) => item.channel_id === channel_id
                  );
                  if (!findCh) return {};

                  const lastItem = findCh.chat_list.at(-1);
                  if (!lastItem) return {};

                  if (lastItem.role === "user") {
                    findCh.chat_list.push({
                      id: uuidv4(),
                      role: "assistant",
                      time: String(+new Date()),
                      content,
                    });
                  } else {
                    lastItem.content += content;
                  }

                  useScrollStore.getState().scrollToBottom();

                  localStorage.setItem("channelList", JSON.stringify(newList));

                  return { list: newList };
                });
              } catch {}
            },
            onerror: (error) => {
              console.log(error, "sendGPT error");
              throw null;
            },
            onclose: () => {
              console.log("gpt onclose");
              set((state) => {
                const newList: ChannelListItem[] = JSON.parse(
                  JSON.stringify(state.list)
                );
                const findCh = newList.find(
                  (item) => item.channel_id === channel_id
                );
                if (!findCh) return {};

                findCh.channel_loading_connect = false;
                findCh.channel_loading = false;

                localStorage.setItem("channelList", JSON.stringify(newList));

                return { list: newList };
              });
              reject({ code: -1, msg: "gpt onclose" });
            },
          });
        } catch {}
      });
    },

    // 取消 GPT 请求
    // Cancel GPT request
    cancelGPT: (channel_id) => {
      set((state) => {
        if (!state.abort[channel_id]) return {};
        state.abort[channel_id].abort();
        delete state.abort[channel_id];

        const newList: ChannelListItem[] = JSON.parse(
          JSON.stringify(state.list)
        );
        const findCh = newList.find((item) => item.channel_id === channel_id);
        if (findCh) {
          findCh.channel_loading_connect = false;
          findCh.channel_loading = false;

          localStorage.setItem("channelList", JSON.stringify(newList));
        }

        return { abort: state.abort, list: newList };
      });
    },

    sendDall: ({ channel_id, apiKey, proxy, channel_size }) => {
      return new Promise((resolve, reject) => {
        let findCh: ChannelListItem | undefined;

        set((state) => {
          const newList: ChannelListItem[] = JSON.parse(
            JSON.stringify(state.list)
          );
          findCh = newList.find((item) => item.channel_id === channel_id);
          if (!findCh) return {};

          if (!findCh.channel_prompt) findCh.channel_prompt = BASE_PROMPT;
          findCh.channel_loading_connect = true;
          findCh.channel_loading = true;

          localStorage.setItem("channelList", JSON.stringify(newList));

          return { list: newList };
        });

        if (!findCh) return reject(null);

        const controller = new AbortController();

        const path = `${proxy || LLM_PROXY}/images/generations`;

        set((state) => {
          return { abort: { ...state.abort, [channel_id]: controller } };
        });

        try {
          fetch(path, {
            method: "post",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            signal: controller.signal,
            body: JSON.stringify({
              prompt: findCh.chat_list.at(-1)?.content || "",
              model: "dall-e-3",
              quality: findCh.channel_quality,
              size: findCh.channel_size,
              style: findCh.channel_style,
            }),
          })
            .then((res) => res.json())
            .then((res) => {
              if (res.error) {
                toast.error(res.error.message);
              } else {
                set((state) => {
                  const newList: ChannelListItem[] = JSON.parse(
                    JSON.stringify(state.list)
                  );
                  const findCh = newList.find(
                    (item) => item.channel_id === channel_id
                  );
                  if (!findCh) return {};

                  const lastItem = findCh.chat_list.at(-1);
                  if (!lastItem) return {};

                  findCh.chat_list.push({
                    id: uuidv4(),
                    role: "assistant",
                    time: String(+new Date()),
                    content: res.data[0].url,
                    channel_size,
                    is_dall: true,
                    dall_prompt: res.data[0].revised_prompt,
                  });

                  useScrollStore.getState().scrollToBottom();

                  localStorage.setItem("channelList", JSON.stringify(newList));

                  return { list: newList };
                });
              }
            })
            .catch((err) => {
              console.log(err, "err");
            })
            .finally(() => {
              set((state) => {
                const newList: ChannelListItem[] = JSON.parse(
                  JSON.stringify(state.list)
                );
                const findCh = newList.find(
                  (item) => item.channel_id === channel_id
                );
                if (!findCh) return {};

                findCh.channel_loading_connect = false;
                findCh.channel_loading = false;

                localStorage.setItem("channelList", JSON.stringify(newList));

                return { list: newList };
              });
            });
        } catch {}
      });
    },

    /**
     * 请求 openai tts
     */
    sendTTS: ({ channel_id, chat_id, apiKey, proxy }) => {
      return new Promise(async (resolve, reject) => {
        let findChatItem: ChatItem | undefined;
        let hasAudioContext = false;

        /**
         * 1. 每次开始加载或播放 tts 之前，先把之前除了不是自己 chat_id 的 tts 停止。audio 和 audioAbort 都要清空
         */

        set((state) => {
          const newList: ChannelListItem[] = JSON.parse(
            JSON.stringify(state.list)
          );
          const findCh = newList.find((item) => item.channel_id === channel_id);
          if (!findCh) return {};
          findChatItem = findCh.chat_list.find((item) => item.id === chat_id);
          if (!findChatItem) return {};

          findCh.chat_list.forEach((item) => {
            item.play_tts = false;
            item.tts_loading = false;
          });

          const response: any = {
            audioAbort: {},
          };

          Object.keys(state.audioAbort).forEach((key) => {
            state.audioAbort[key].abort();
          });

          if (state.audio[chat_id]) {
            hasAudioContext = true;
            state.audio[chat_id].resume();
            response.audio = { [chat_id]: state.audio[chat_id] };

            findChatItem.play_tts = true;
            findChatItem.tts_loading = false;
          } else {
            Object.keys(state.audio).forEach((key) => {
              state.audio[key].close();
            });
            response.audio = {};
          }

          response.list = newList;
          localStorage.setItem("channelList", JSON.stringify(newList));

          return response;
        });

        if (!findChatItem) return reject(null);
        if (hasAudioContext) return resolve(null);

        const controller = new AbortController();

        set((state) => {
          const newList: ChannelListItem[] = JSON.parse(
            JSON.stringify(state.list)
          );
          const findCh = newList.find((item) => item.channel_id === channel_id);
          if (!findCh) return {};
          findChatItem = findCh.chat_list.find((item) => item.id === chat_id);
          if (!findChatItem) return {};

          findChatItem.tts_loading = true;
          findChatItem.play_tts = false;

          localStorage.setItem("channelList", JSON.stringify(newList));

          return { audioAbort: { [chat_id]: controller }, list: newList };
        });

        const path = `${proxy || LLM_PROXY}/audio/speech`;

        const { model, voice } = useTTSStore.getState();

        try {
          const res = await fetch(path, {
            method: "post",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            signal: controller.signal,
            body: JSON.stringify({
              model,
              voice,
              input: findChatItem.content,
            }),
          });

          if (res.status !== 200) {
            set((state) => {
              const newList: ChannelListItem[] = JSON.parse(
                JSON.stringify(state.list)
              );
              const findCh = newList.find(
                (item) => item.channel_id === channel_id
              );
              if (!findCh) return {};

              const findChatItem = findCh.chat_list.find(
                (item) => item.id === chat_id
              );
              if (!findChatItem) return {};

              findChatItem.tts_loading = false;
              findChatItem.play_tts = false;

              localStorage.setItem("channelList", JSON.stringify(newList));

              return { list: newList };
            });
            return reject(await res.json());
          }

          const arrayBuffer = await res.arrayBuffer();

          const audioContext = new AudioContext();

          set((state) => {
            const newList: ChannelListItem[] = JSON.parse(
              JSON.stringify(state.list)
            );
            const findCh = newList.find(
              (item) => item.channel_id === channel_id
            );
            if (!findCh) return {};

            findChatItem = findCh.chat_list.find((item) => item.id === chat_id);
            if (!findChatItem) return {};

            findChatItem.tts_loading = false;
            findChatItem.play_tts = true;

            localStorage.setItem("channelList", JSON.stringify(newList));

            return { list: newList, audio: { [chat_id]: audioContext } };
          });

          const audioSource = audioContext.createBufferSource();

          audioContext.decodeAudioData(arrayBuffer, (buffer) => {
            audioSource.buffer = buffer;
            audioSource.connect(audioContext.destination);
            audioSource.start();
          });

          audioSource.onended = () => {
            set((state) => {
              const newList: ChannelListItem[] = JSON.parse(
                JSON.stringify(state.list)
              );
              const findCh = newList.find(
                (item) => item.channel_id === channel_id
              );
              if (!findCh) return {};
              const findChatItem = findCh.chat_list.find(
                (item) => item.id === chat_id
              );
              if (!findChatItem) return {};

              state.audio[chat_id].close();

              findChatItem.tts_loading = false;
              findChatItem.play_tts = false;

              localStorage.setItem("channelList", JSON.stringify(newList));

              return { audio: {}, list: newList };
            });
          };
        } catch (error) {
          console.log(error, "sendTTS error");
          return reject(null);
        }
      });
    },

    pauseTTS: ({ channel_id, chat_id }) => {
      set((state) => {
        const newList: ChannelListItem[] = JSON.parse(
          JSON.stringify(state.list)
        );
        const findCh = newList.find((item) => item.channel_id === channel_id);
        if (!findCh) return {};

        const findChatItem = findCh.chat_list.find(
          (item) => item.id === chat_id
        );
        if (!findChatItem) return {};

        findChatItem.tts_loading = false;
        findChatItem.play_tts = false;

        state.audio[chat_id].suspend();

        localStorage.setItem("channelList", JSON.stringify(newList));

        return { list: newList };
      });
    },

    clearTTS: () => {
      set((state) => {
        const newList: ChannelListItem[] = JSON.parse(
          JSON.stringify(state.list)
        );

        newList.forEach((item) => {
          item.chat_list.forEach((chat) => {
            chat.tts_loading = false;
            chat.play_tts = false;
          });
        });

        Object.keys(state.audio).forEach((key) => {
          state.audio[key].close();
        });
        Object.keys(state.audioAbort).forEach((key) => {
          state.audioAbort[key].abort();
        });

        localStorage.setItem("channelList", JSON.stringify(newList));

        return { list: newList, audio: {}, audioAbort: {} };
      });
    },

    // 生成会话 title
    // Generate Conversation Title
    generateTitle: ({ channel, path, headers, body }) => {
      fetchEventSource(path, {
        method: "POST",
        openWhenHidden: true,
        headers,
        body,
        onmessage: (res) => {
          if (res.data === "[DONE]") {
            return set((state) => {
              const newList: ChannelListItem[] = JSON.parse(
                JSON.stringify(state.list)
              );
              const findCh = newList.find(
                (item) => item.channel_id === channel.channel_id
              );
              if (!findCh) return {};

              localStorage.setItem("channelList", JSON.stringify(newList));

              return { list: newList };
            });
          }

          try {
            const content = JSON.parse(res.data).choices[0].delta.content;
            if (!content) return;
            set((state) => {
              const newList: ChannelListItem[] = JSON.parse(
                JSON.stringify(state.list)
              );
              const findCh = newList.find(
                (item) => item.channel_id === channel.channel_id
              );
              if (!findCh) return {};

              findCh.channel_name += content;

              localStorage.setItem("channelList", JSON.stringify(newList));
              return { list: newList };
            });
          } catch {}
        },
        onerror: (error) => {
          console.log(error, "generateTitle error");
          throw null;
        },
        onclose: () => {
          console.log("generateTitle error");
        },
      });
    },
  }),
  shallow
);

export const useChannelInit = () => {
  const updateActiveId = useChannelStore((state) => state.updateActiveId);
  const updateList = useChannelStore((state) => state.updateList);

  const init = () => {
    const initChannelList = getInitChannelList();
    const initActiveId = getInitActiveId(initChannelList);

    updateList(initChannelList);
    updateActiveId(initActiveId);
  };

  return init;
};
