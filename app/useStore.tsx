import { create } from "zustand";

type RefData = {
  x: number;
  y: number;
  width: number;
  height: number | string;
  // We don't actually need numerical height for image creation since aspect ratio is locked,
  // but we will likely need it to calculate intersections for drag multi-selections.
};

type State = {
  // Reference image management
  // Keep track of reference images by mapping URL to RefData (x, y, width, height)
  // The reference image components are created based on this map.
  // After every drag and resize operation, the reference image component will update the store to keep the map in sync.
  // We need the map in sync to access the position and size of the reference images for exporting to zip.
  refMap: Map<string, RefData>;
  addRef: (url: string) => void;
  delRef: (url: string) => void;
  setRef: (url: string, data: RefData) => void; // Used by reference image components to update/sync the store

  // Selection management, may have to be updated to support multiple selection
  selectedUrl: string;
  setSelectedUrl: (url: string) => void;

  // Context menu management
  contextMenuX: number;
  contextMenuY: number;
  contextMenuShown: boolean;
  hideContextMenu: () => void;
  showContextMenu: (x: number, y: number) => void;
};

const useStore = create<State>((set) => ({
  refMap: new Map(),
  addRef: (url: string) => {
    console.log("addRef\n\n", url);
    set((state) => {
      const newRefMap = new Map(state.refMap);
      newRefMap.set(url, {
        x: 0,
        y: 0,
        width: 300, // Default width 300px for now. Does this compress the image? We don't want that.
        height: "auto", // Setting this to "auto" allows RefImage's img.onload to calculate the correct height.
      });
      return { refMap: newRefMap };
    });
  },
  delRef: (url: string) => {
    console.log("delRef\n\n", url);
    set((state) => {
      const newRefMap = new Map(state.refMap);
      newRefMap.delete(url);
      URL.revokeObjectURL(url);
      return { refMap: newRefMap };
    });
  },
  setRef: (url: string, data: RefData) => {
    // update export map ?
    console.log("setRef\n\n", url, data);
    set((state) => {
      const newRefMap = new Map(state.refMap);
      newRefMap.set(url, data);
      return { refMap: newRefMap };
    });
  },
  selectedUrl: "",
  setSelectedUrl: (url: string) => set({ selectedUrl: url }),
  contextMenuX: 0,
  contextMenuY: 0,
  contextMenuShown: false,
  hideContextMenu: () => set({ contextMenuShown: false }),
  showContextMenu: (x: number, y: number) =>
    set({ contextMenuX: x, contextMenuY: y, contextMenuShown: true }),
}));

export default useStore;
