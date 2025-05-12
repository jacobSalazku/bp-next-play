import { create } from "zustand";

type FormMode = "view" | "edit" | "create";

type FormState = {
  mode: FormMode;
  setMode: (mode: FormMode) => void;
};

export const useFormStore = create<FormState>((set) => ({
  mode: "view",
  setMode: (mode) => set({ mode }),
}));
