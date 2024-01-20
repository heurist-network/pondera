import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";

export type State = {
  open: boolean;
  updateOpen: (open: boolean) => void;
};

export const useStore = createWithEqualityFn<State>(
  (set) => ({
    open: false,
    updateOpen: (open) => set({ open }),
  }),
  shallow
);
