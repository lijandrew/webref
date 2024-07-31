import { create } from "zustand";

type RefData = {
  x: number;
  y: number;
  width: number;
  height: number | string;
  // We don't actually need numerical height for image creation since aspect ratio is locked,
  // but we will likely need it to calculate intersections for drag multi-selections.
};

type RefStoreState = {
  // Keep track of reference images by mapping URL to RefData (x, y, width, height)
  // The reference image components are created based on this map.
  // After every drag and resize operation, the reference image component will update the store to keep the map in sync.
  // We need the map in sync to access the position and size of the reference images for exporting to zip.
  refMap: Map<string, RefData>;
  addRef: (url: string) => void;
  delRef: (url: string) => void;
  setRef: (url: string, data: RefData) => void; // Used by reference image components to update/sync the store
};

const useRefStore = create<RefStoreState>((set) => ({
  refMap: new Map(),
  addRef: (url: string) => {
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
    set((state) => {
      const newRefMap = new Map(state.refMap);
      newRefMap.delete(url);
      URL.revokeObjectURL(url);
      return { refMap: newRefMap };
    });
  },
  setRef: (url: string, data: RefData) => {
    set((state) => {
      const newRefMap = new Map(state.refMap);
      newRefMap.set(url, data);
      return { refMap: newRefMap };
    });
  },
}));

export default useRefStore;
