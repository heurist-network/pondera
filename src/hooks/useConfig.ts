import { create } from "zustand";

export type ConfigStore = {
  sendMessageType: "Enter" | "CommandEnter";

  updateSendMessageType: (
    sendMessageType: ConfigStore["sendMessageType"]
  ) => void;
};

export const useConfigStore = create<ConfigStore>((set) => ({
  sendMessageType: "Enter",

  updateSendMessageType: (sendMessageType) => {
    localStorage.setItem("sendMessageType", sendMessageType);
    set({ sendMessageType });
  },
}));

export const useConfigInit = () => {
  const updateSendMessageType = useConfigStore(
    (state) => state.updateSendMessageType
  );

  const init = () => {
    const localSendMessageType =
      (localStorage.getItem(
        "sendMessageType"
      ) as ConfigStore["sendMessageType"]) || "Enter";

    updateSendMessageType(localSendMessageType);
  };

  return init;
};
