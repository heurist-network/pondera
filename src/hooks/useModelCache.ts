import { create } from "zustand";
import { MODLES } from "@/lib/models";
import type { ChannelListItem } from "./useChannel";

export interface ModelCache {
  model_type: string;
  model_name: string;
  updateType: (model_type: string) => void;
  updateName: (model_name: string) => void;
  checkModel: (item: ChannelListItem) => void;
}

export const useModelCacheStore = create<ModelCache>((set) => ({
  model_type: "",
  model_name: "",

  updateType: (model_type) => {
    localStorage.setItem("recent_model_type", model_type);
    set({ model_type });
  },
  updateName: (model_name) => {
    localStorage.setItem("recent_model_name", model_name);
    set({ model_name });
  },

  checkModel: (item) => {
    set((state) => {
      if (!state.model_type || !state.model_name) return {};

      const findModelName = MODLES.find(
        (item) => item.value === state.model_name
      );

      if (!!findModelName) {
        item.channel_model.type = state.model_type;
        item.channel_model.name = state.model_name;
      }

      return {};
    });
  },
}));

export const useModelCacheInit = () => {
  const updateType = useModelCacheStore((state) => state.updateType);
  const updateName = useModelCacheStore((state) => state.updateName);

  const init = () => {
    const localModelType = localStorage.getItem("recent_model_type") || "";
    const localModelName = localStorage.getItem("recent_model_name") || "";

    updateType(localModelType);
    updateName(localModelName);
  };

  return init;
};
