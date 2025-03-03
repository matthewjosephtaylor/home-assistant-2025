import { create } from "zustand";

interface ActiveNoteState {
  activeNoteParentId: string | undefined;
  setActiveNoteParentId: (id: string | undefined) => void;
}

export const useActiveNoteStore = create<ActiveNoteState>((set) => ({
  activeNoteParentId: undefined,
  setActiveNoteParentId: (id) => set({ activeNoteParentId: id }),
}));
