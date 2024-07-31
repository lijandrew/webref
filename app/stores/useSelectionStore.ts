import { create } from "zustand";

type SelectionState = {
  selectedUrl: string;
  setSelectedUrl: (url: string) => void;
};

const useSelectionStore = create<SelectionState>()((set) => ({
  selectedUrl: "",
  setSelectedUrl: (url: string) => set({ selectedUrl: url }),
}));

export default useSelectionStore;
