import { create } from "zustand";
import { SCREENS } from "../SCREENS";

type AppState = {
  mqUrl: string;
  aiTextOutput?: string;
  setMqUrl: (url: string) => void;
  setAiTextOutput: (text: string) => void;
  getHashFromUrl: () => keyof typeof SCREENS;
};

export const useAppState = create<AppState>((set) => ({
  mqUrl: "",
  aiTextOutput: undefined,
  setMqUrl: (url) => set({ mqUrl: url }),
  setAiTextOutput: (text) => set({ aiTextOutput: text }),
  getHashFromUrl: () => {
    const hash = window.location.hash;
    return hash ? hash.substring(1) : "kiosk";
  },
}));

export const useMqUrl = () => {
  const { mqUrl, setMqUrl } = useAppState();
  return { mqUrl, setMqUrl };
};

export const useAiTextOutput = () => {
  const { aiTextOutput, setAiTextOutput } = useAppState();
  return { aiTextOutput, setAiTextOutput };
};


