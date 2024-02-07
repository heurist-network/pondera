import { create } from "zustand";
import { persist } from "zustand/middleware";
import { fetchEventSource } from "@fortaine/fetch-event-source";
import { toast } from "react-hot-toast";
import { clone } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import { ChatListItem, ChatStore, LOADING_STATE, Message } from "./type";
import { BASE_PROMPT, GENERATE_CHAT_NAME_PROMPT } from "@/lib/constant";

export type { ChatListItem, Message };

export { LOADING_STATE } from "./type";

export const initChatItem: ChatListItem = {
  chat_id: uuidv4(),
  chat_name: "",
  chat_model: {
    type: "mistralai",
    name: "Mixtral-8x7B-v0.1",
  },
  chat_prompt: BASE_PROMPT,
  chat_state: LOADING_STATE.NONE,
  chat_context_length: 8,
  chat_list: [],
};

export const useChatStore = create<ChatStore>()(
  persist(
    (set) => ({
      activeId: initChatItem.chat_id,
      list: [initChatItem],
      abort: {},

      toggleChatActive: (chat_id) => {
        set({ activeId: chat_id });
      },
      addChat: () => {
        const chat_id = uuidv4();
        const chatItem = { ...initChatItem, chat_id };

        set((state) => ({
          list: [...state.list, chatItem],
          activeId: chat_id,
        }));
      },
      deleteChat: (chat_id) => {
        console.log(chat_id, "chat_id");

        set((state) => {
          if (state.list.length <= 1) {
            const activeId = initChatItem.chat_id;
            return { activeId, list: [initChatItem] };
          } else {
            const list = state.list.filter((item) => item.chat_id !== chat_id);

            if (chat_id === state.activeId) {
              return { activeId: list[0].chat_id, list };
            }

            return { list };
          }
        });
      },
      clearChat: () => {
        set(() => {
          const activeId = initChatItem.chat_id;
          return { activeId, list: [initChatItem] };
        });
      },
      updateChatName: (chat_id, chat_name) => {
        set((state) => {
          const newList: ChatListItem[] = clone(state.list);
          const findChat = newList.find((chat) => chat.chat_id === chat_id);
          if (!findChat) return {};
          findChat.chat_name = chat_name;

          return { list: newList };
        });
      },
      addMessage: ({ chat_id, message, role }) => {
        set((state) => {
          const newList: ChatListItem[] = clone(state.list);
          const findChat = newList.find((chat) => chat.chat_id === chat_id);
          if (!findChat) return {};

          findChat.chat_list.push({
            id: uuidv4(),
            role,
            content: message,
            time: String(+new Date()),
          });

          return { list: newList };
        });
      },
      deleteMessage: ({ chat_id, message_id }) => {
        set((state) => {
          const newList: ChatListItem[] = clone(state.list);
          const findChat = newList.find((chat) => chat.chat_id === chat_id);
          if (!findChat) return {};
          findChat.chat_list = findChat.chat_list.filter(
            (item) => item.id !== message_id
          );
          return { list: newList };
        });
      },
      updateMessage: ({ chat_id, message_id, content }) => {
        set((state) => {
          const newList: ChatListItem[] = clone(state.list);
          const findChat = newList.find((chat) => chat.chat_id === chat_id);
          if (!findChat) return {};
          const findMessage = findChat.chat_list.find(
            (item) => item.id === message_id
          );
          if (!findMessage) return {};

          findMessage.content = content;

          return { list: newList };
        });
      },

      // Chat Action
      sendChat: async ({ chat_id }) => {
        let findChat: ChatListItem | undefined;

        set((state) => {
          const newList: ChatListItem[] = clone(state.list);
          findChat = newList.find((chat) => chat.chat_id === chat_id);
          if (!findChat) return {};
          findChat.chat_state = LOADING_STATE.CONNECTING;

          return { list: newList };
        });

        if (!findChat) return;

        const controller = new AbortController();

        const messages = findChat.chat_list.map((item) => ({
          role: item.role,
          content: item.content,
        }));

        fetchEventSource("/api/chat", {
          method: "POST",
          signal: controller.signal,
          openWhenHidden: true,
          body: JSON.stringify({ messages }),
          onopen: async (res) => {
            const isError = !res.ok || res.status !== 200 || !res.body;
            if (isError) {
              set((state) => {
                const newList: ChatListItem[] = clone(state.list);
                const findChat = newList.find(
                  (chat) => chat.chat_id === chat_id
                );
                if (!findChat) return {};
                findChat.chat_state = LOADING_STATE.NONE;

                return { list: newList };
              });

              const errRes = await res.json();
              toast.error(errRes.msg || "Error");
            }
          },
          onmessage: (res) => {
            const data = JSON.parse(res.data).choices[0];
            // response over
            if (data.finish_reason === "stop") {
              set((state) => {
                const newList: ChatListItem[] = clone(state.list);
                const findChat = newList.find(
                  (chat) => chat.chat_id === chat_id
                );
                if (!findChat) return {};
                findChat.chat_state = LOADING_STATE.NONE;

                // If no title, generate one.
                if (!findChat.chat_name) {
                  state.generateChatName({
                    chat_id,
                    messages: [
                      ...messages,
                      {
                        role: "user",
                        content: GENERATE_CHAT_NAME_PROMPT,
                      },
                    ],
                  });
                }

                return { list: newList };
              });

              return console.log("response over");
            }

            try {
              const content = data.delta;
              if (!content) return;

              set((state) => {
                const newList: ChatListItem[] = clone(state.list);
                const findChat = newList.find(
                  (chat) => chat.chat_id === chat_id
                );
                if (!findChat) return {};

                findChat.chat_state = LOADING_STATE.RESPONDING;

                const lastItem = findChat.chat_list.at(-1);
                if (!lastItem) return {};

                if (lastItem.role === "user") {
                  findChat.chat_list.push({
                    id: uuidv4(),
                    role: "assistant",
                    time: String(+new Date()),
                    content,
                  });
                } else {
                  lastItem.content += content;
                }

                return { list: newList };
              });
            } catch (error) {}
          },
          onerror: () => {
            throw null;
          },
          onclose: () => {
            console.log("onclose");
          },
        });
      },
      generateChatName: ({ chat_id, messages }) => {
        setTimeout(() => {
          fetchEventSource("/api/chat", {
            method: "POST",
            openWhenHidden: true,
            body: JSON.stringify({ messages }),
            onmessage: (res) => {
              try {
                const data = JSON.parse(res.data).choices[0];
                if (data.finish_reason === "stop") return;

                const content = data.delta;
                if (!content) return;

                set((state) => {
                  const newList: ChatListItem[] = clone(state.list);
                  const findChat = newList.find(
                    (item) => item.chat_id === chat_id
                  );
                  if (!findChat) return {};

                  findChat.chat_name += content;

                  return { list: newList };
                });
              } catch {}
            },
            onerror: (error) => {
              console.log(error, "generateChatName error");
              throw null;
            },
            onclose: () => {
              console.log("generateChatName error");
            },
          });
        }, 1000);
      },

      // Hydration
      _hasHydrated: false,
      setHasHydrated: (state) => {
        set({
          _hasHydrated: state,
        });
      },
    }),
    {
      name: "chat-list",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      merge: (persistedState: any, currentState) => {
        // reset data
        if (persistedState) {
          persistedState.list.forEach((item: any) => {
            item.chat_state = LOADING_STATE.NONE;
          });
        }

        return Object.assign({}, currentState, persistedState);
      },
    }
  )
);
