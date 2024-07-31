import { create } from "zustand";

type SelectionStoreState = {
  selectedUrl: string;
  setSelectedUrl: (url: string) => void;
};

const useSelectionStore = create<SelectionStoreState>((set) => ({
  selectedUrl: "",
  setSelectedUrl: (url: string) => set({ selectedUrl: url }),
}));

export default useSelectionStore;
