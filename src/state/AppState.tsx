import { create } from "zustand";
import { SCREENS } from "../SCREENS";

type AppState = {
  mqUrl: string;
  aiTextOutput?: string;
  userDaimonId?: string;
  setUserDaimonId: (daimonId?: string) => void;
  setMqUrl: (url: string) => void;
  setAiTextOutput: (text: string) => void;
  getHashFromUrl: () => keyof typeof SCREENS;
};

export const useAppState = create<AppState>((set) => ({
  mqUrl: "",
  aiTextOutput: undefined,
  userDaimonId: undefined,
  setMqUrl: (url) => set({ mqUrl: url }),
  setAiTextOutput: (text) => set({ aiTextOutput: text }),
  setUserDaimonId: (daimon) => set({ userDaimonId: daimon }),
  getHashFromUrl: () => {
    const hash = window.location.hash;
    return hash ? hash.substring(1) : "kiosk";
  },
}));
