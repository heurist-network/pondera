import React from "react";
import { create } from "zustand";
import { useChannelInit } from "./useChannel";
import { useAIInit } from "./useAI";
import { useConfigInit } from "./useConfig";
import { useTTSInit } from "./useTTS";

type Init = {
  isInit: boolean;
  init: () => void;
};

const useStore = create<Init>((set) => ({
  isInit: false,

  init: () => set({ isInit: true }),
}));

export const useInit = () => {
  const isInit = useStore((state) => state.isInit);
  const init = useStore((state) => state.init);

  const initChannel = useChannelInit();
  const initAI = useAIInit();
  const initConfig = useConfigInit();
  const initTTS = useTTSInit();

  React.useEffect(() => {
    initChannel();
    initAI();
    initConfig();
    initTTS();

    init();
  }, []);

  return isInit;
};
