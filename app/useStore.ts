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
  //////// Reference map state ////////
  refMap: Map<string, RefData>; // URL -> RefData, tells RefImage components how to render and used for export (to-do)
  addRef: (url: string) => void; // Add reference image to map
  delRef: (url: string) => void; // Delete reference image from map and revoke URL
  setRef: (url: string, data: RefData) => void; // Update reference image data, used by RefImages to update/sync the store
  topRef: (url: string) => void; // Move reference image to top by deleting and re-adding it

  //////// Selection state ////////
  selectedUrls: Set<string>; // Set of selected URLs
  selectUrl: (url: string) => void; // Add URL to selection and move reference image to top
  unselectUrl: (url: string) => void; // Remove URL from selection
  clearSelection: () => void; // Clear all selections

  //////// Context menu state ////////
  contextMenuX: number; // X coordinate of context menu
  contextMenuY: number; // Y coordinate of context menu
  contextMenuShown: boolean; // Whether context menu is shown
  hideContextMenu: () => void; // Hide context menu
  showContextMenu: (x: number, y: number) => void; // Show context menu at x, y
};

// Zustand with Typescript requires curried create. Notice create<T>() instead of create<T>.
const useStore = create<State>()((set) => ({
  //////// Reference map state ////////
  refMap: new Map(),
  addRef: (url: string) => {
    set((state) => {
      console.log("addRef");
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
    console.log("delRef");
    set((state) => {
      const newRefMap = new Map(state.refMap);
      newRefMap.delete(url);
      URL.revokeObjectURL(url);
      return { refMap: newRefMap };
    });
  },
  setRef: (url: string, data: RefData) => {
    console.log("setRef");
    set((state) => {
      const newRefMap = new Map(state.refMap);
      newRefMap.set(url, data);
      return { refMap: newRefMap };
    });
  },
  topRef: (url: string) => {
    console.log("topRef");
    set((state) => {
      const newRefMap = new Map(state.refMap);
      const data = newRefMap.get(url);
      if (data) {
        newRefMap.delete(url);
        newRefMap.set(url, data);
      }
      return { refMap: newRefMap };
    });
  },

  //////// Selection state ////////
  selectedUrls: new Set(),
  selectUrl: (url: string) => {
    console.log("selectUrl");
    set((state) => {
      const newSelectedUrls = new Set(state.selectedUrls);
      newSelectedUrls.add(url);
      if (state.selectedUrls.size === 0) {
        state.topRef(url); // Move selected reference image to top if this is the first selection
        // get().topRef(url); <-- I think zustand get() just returns the previous State in case you need it when not using set(state => result)
      }
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

  //////// Context menu state ////////
  contextMenuX: 0,
  contextMenuY: 0,
  contextMenuShown: false,
  hideContextMenu: () => {
    console.log("hideContextMenu");
    set({ contextMenuShown: false });
  },
  showContextMenu: (x: number, y: number) => {
    console.log("showContextMenu");
    set({ contextMenuX: x, contextMenuY: y, contextMenuShown: true });
  },
}));

export default useStore;
