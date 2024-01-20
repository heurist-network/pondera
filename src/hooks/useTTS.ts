import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";

type TTSModel = "tts-1" | "tts-1-hd";
type TTSVoice = "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";

type TTSConfig = {
  model: TTSModel;
  voice: TTSVoice;
};

export type TTSStore = {
  open: boolean;
  model: TTSModel;
  voice: TTSVoice;

  updateOpen: (open: boolean) => void;
  updateTTS: ({ model, voice }: TTSConfig) => void;
};

export const useTTSStore = createWithEqualityFn<TTSStore>(
  (set) => ({
    open: false,
    model: "tts-1",
    voice: "alloy",

    updateOpen: (open) => set(() => ({ open })),

    updateTTS: ({ model, voice }) => {
      localStorage.setItem("ttsConfig", JSON.stringify({ model, voice }));
      set(() => ({ model, voice }));
    },
  }),
  shallow
);

export const useTTSInit = () => {
  const updateTTS = useTTSStore((state) => state.updateTTS);

  const init = () => {
    let localTTSConfig;

    try {
      localTTSConfig = JSON.parse(
        localStorage.getItem("ttsConfig") ||
          JSON.stringify({
            model: "tts-1",
            voice: "alloy",
          })
      );
    } catch (error) {
      localTTSConfig = {
        model: "tts-1",
        voice: "alloy",
      };
    }

    updateTTS(localTTSConfig);
  };

  return init;
};
