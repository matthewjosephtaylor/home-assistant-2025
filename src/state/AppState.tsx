import { create } from "zustand";
import { SCREENS } from "../SCREENS";

type AppState = {
  mqUrl: string;
  aiTextOutput?: string;
  userDaimonId?: string;
  setUserDaimonId: (daimonId?: string) => void;
  setMqUrl: (url: string) => void;
  setAiTextOutput: (text: string) => void;
  getUrlHash: () => keyof typeof SCREENS;
  setUrlHash: (hash: keyof typeof SCREENS) => void;
  activeRoomId: string | undefined;
  setActiveRoomId: (id: string | undefined) => void;
  activeAssistantId?: string;
  setActiveAssistantId: (id?: string) => void;
  selectedRoomIds: string[];
  setSelectedRoomIds: (ids: string[]) => void;
  abortController?: AbortController;
  setAbortController: (abortController?: AbortController) => void;
  textEntryElement: HTMLInputElement | undefined;
  setTextEntryElement: (
    textEntryComponent: HTMLInputElement | undefined
  ) => void;
  topRoomId?: string;
  setTopRoomId: (id?: string) => void;
};

export const useAppState = create<AppState>((set) => ({
  mqUrl: "",
  aiTextOutput: undefined,
  userDaimonId: undefined,
  setMqUrl: (url) => set({ mqUrl: url }),
  setAiTextOutput: (text) => set({ aiTextOutput: text }),
  setUserDaimonId: (daimon) => set({ userDaimonId: daimon }),
  getUrlHash: () => {
    const hash = window.location.hash;
    return hash ? (hash.substring(1) as keyof typeof SCREENS) : "room";
  },
  setUrlHash: (hash) => {
    window.location.hash = hash;
  },
  activeRoomId: undefined,
  setActiveRoomId: (id) => set({ activeRoomId: id }),
  activeAssistantId: undefined,
  setActiveAssistantId: (id) => set({ activeAssistantId: id }),
  abortController: undefined,
  setAbortController: (abortController) => set({ abortController }),
  textEntryElement: undefined,
  setTextEntryElement: (textEntryElement) => set({ textEntryElement }),
  topRoomId: undefined,
  setTopRoomId: (id) => set({ topRoomId: id }),
  selectedRoomIds: [],
  setSelectedRoomIds: (ids) => set({ selectedRoomIds: ids }),
}));
