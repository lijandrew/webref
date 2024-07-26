import { create } from "zustand";
import React from "react";
import RefImage from "./RefImage";

type State = {
  refMap: Map<string, React.JSX.Element>;
  addRef: (url: string) => void;
  delRef: (url: string) => void;
  selectedUrl: string;
  setSelectedUrl: (url: string) => void;
  contextMenuX: number;
  contextMenuY: number;
  contextMenuShown: boolean;
  hideContextMenu: () => void;
  showContextMenu: (x: number, y: number) => void;
};

const useStore = create<State>((set) => ({
  // Reference image management
  refMap: new Map(),
  addRef: (url: string) =>
    set((state) => {
      const newRefMap = new Map(state.refMap);
      newRefMap.set(
        url,
        <RefImage
          key={url}
          url={url}
          defaultX={0}
          defaultY={0}
          defaultWidth={300} // Defaulting this to 300px for now.
        />,
      );
      return { refMap: newRefMap };
    }),
  delRef: (url: string) =>
    set((state) => {
      const newRefMap = new Map(state.refMap);
      newRefMap.delete(url);
      URL.revokeObjectURL(url);
      return { refMap: newRefMap };
    }),

  // Selection management
  selectedUrl: "",
  setSelectedUrl: (url: string) => set({ selectedUrl: url }),

  // Context menu management
  contextMenuX: 0,
  contextMenuY: 0,
  contextMenuShown: false,
  hideContextMenu: () => set({ contextMenuShown: false }),
  showContextMenu: (x: number, y: number) =>
    set({ contextMenuX: x, contextMenuY: y, contextMenuShown: true }),
}));

export default useStore;
