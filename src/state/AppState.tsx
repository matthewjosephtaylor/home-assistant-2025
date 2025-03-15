import { create } from "zustand";
import { SCREENS } from "../SCREENS";
import type { TextEntry } from "../ui/room/TextEntry";
import { isUndefined } from "@mjt-engine/object";

type AppState = {
  mqUrl: string;
  aiTextOutput?: string;
  userDaimonId?: string;
  setUserDaimonId: (daimonId?: string) => void;
  setMqUrl: (url: string) => void;
  setAiTextOutput: (text: string) => void;
  getUrlHash: () => keyof typeof SCREENS;
  setUrlHash: (hash: keyof typeof SCREENS) => void;
  activeNoteParentId: string | undefined;
  setActiveNoteParentId: (id: string | undefined) => void;
  abortController?: AbortController;
  setAbortController: (abortController?: AbortController) => void;
  textEntryElement: HTMLInputElement | undefined;
  setTextEntryElement: (
    textEntryComponent: HTMLInputElement | undefined
  ) => void;
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
    return hash ? (hash.substring(1) as keyof typeof SCREENS) : "kiosk";
  },
  setUrlHash: (hash) => {
    window.location.hash = hash;
  },
  activeNoteParentId: undefined,
  setActiveNoteParentId: (id) => set({ activeNoteParentId: id }),
  abortController: undefined,
  setAbortController: (abortController) => set({ abortController }),
  textEntryElement: undefined,
  setTextEntryElement: (textEntryElement) => set({ textEntryElement }),
}));


