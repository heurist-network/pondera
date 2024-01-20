import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import type { AIStore, OpenAI, ModelSettingsKey } from "./types";
import { getLocalStore } from "@/lib/localStore";

export type { OpenAI, ModelSettingsKey };

export const useAIStore = createWithEqualityFn<AIStore>(
  (set) => ({
    openai: {
      apiKey: "",
      proxy: "",
    },
    modelSettings: {
      max_tokens: 2000,
      temperature: 1,
      top_p: 1,
      presence_penalty: 0,
      frequency_penalty: 0,
    },

    updateOpenAI: (openai) => {
      if (!openai) return;
      localStorage.setItem("openaiConfig", JSON.stringify(openai));
      set({ openai });
    },
    updateModelSettings: (modelSettings) => {
      if (!modelSettings) return;
      localStorage.setItem("modelSettings", JSON.stringify(modelSettings));
      set({ modelSettings });
    },
  }),
  shallow
);

export const useAIInit = () => {
  const updateOpenAI = useAIStore((state) => state.updateOpenAI);
  const updateModelSettings = useAIStore((state) => state.updateModelSettings);

  const init = () => {
    const localOpenAIConfig = getLocalStore("openaiConfig") || {
      apiKey: "",
      proxy: "",
    };
    const localModelSettings = getLocalStore("modelSettings") || {
      max_tokens: 2000,
      temperature: 1,
      top_p: 1,
      presence_penalty: 0,
      frequency_penalty: 0,
    };

    updateOpenAI(localOpenAIConfig);
    updateModelSettings(localModelSettings);
  };

  return init;
};
