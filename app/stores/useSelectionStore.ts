import { create } from "zustand";

type SelectionState = {
  selectedUrl: string;
  setSelectedUrl: (url: string) => void;
};

const useSelectionStore = create<SelectionState>()((set) => ({
  selectedUrl: "",
  setSelectedUrl: (url: string) => {
    console.log("setSelectedUrl", url);
    set({ selectedUrl: url });
  },
}));

export default useSelectionStore;
