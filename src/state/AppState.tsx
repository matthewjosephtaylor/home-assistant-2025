import { create } from "zustand";

type AppState = {
  mqUrl: string;
  aiTextOutput?: string;
  setMqUrl: (url: string) => void;
  setAiTextOutput: (text: string) => void;
};

export const useAppState = create<AppState>((set) => ({
  mqUrl: "",
  aiTextOutput: undefined,
  setMqUrl: (url) => set({ mqUrl: url }),
  setAiTextOutput: (text) => set({ aiTextOutput: text }),
}));
