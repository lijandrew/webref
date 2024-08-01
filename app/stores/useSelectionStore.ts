import { create } from "zustand";

type SelectionState = {
  selectedUrls: Set<string>;
  selectUrl: (url: string) => void; // Better name? addSelection? Does that miss the url part?
  unselectUrl: (url: string) => void;
  clearSelection: () => void;
};

const useSelectionStore = create<SelectionState>()((set) => ({
  selectedUrls: new Set(),
  selectUrl: (url: string) => {
    console.log("selectUrl");
    set((state) => {
      const newSelectedUrls = new Set(state.selectedUrls);
      newSelectedUrls.add(url);
      return { selectedUrls: newSelectedUrls };
    });
  },
  unselectUrl: (url: string) => {
    console.log("unselectUrl");
    set((state) => {
      const newSelectedUrls = new Set(state.selectedUrls);
      newSelectedUrls.delete(url);
      return { selectedUrls: newSelectedUrls };
    });
  },
  clearSelection: () => {
    console.log("clearSelection");
    set({ selectedUrls: new Set() });
  },
}));

export default useSelectionStore;
