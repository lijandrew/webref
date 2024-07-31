import { create } from "zustand";

type ContextMenuStoreState = {
  contextMenuX: number;
  contextMenuY: number;
  contextMenuShown: boolean;
  hideContextMenu: () => void;
  showContextMenu: (x: number, y: number) => void;
};

const useContextMenuStore = create<ContextMenuStoreState>((set) => ({
  contextMenuX: 0,
  contextMenuY: 0,
  contextMenuShown: false,
  hideContextMenu: () => set({ contextMenuShown: false }),
  showContextMenu: (x: number, y: number) =>
    set({ contextMenuX: x, contextMenuY: y, contextMenuShown: true }),
}));

export default useContextMenuStore;
