/*
useStore.ts

Global store for the app, created with Zustand (an entirely hook-based Redux alternative).
The create function from Zustand creates a hook that provides a global store.
We import and use the hook in components to access and modify the store.
The app's functionality pretty much revolves around this global store, which is broken up into sections:

Sections:

- reference
  - RefImage components read from and update this map to decide how/what/where to render
  - RefImage components update/sync the store when they are dragged or resized.
  - File input methods add to this map, and deletion methods remove from this map.

- selection
  - selection events, like clicking and shift-clicking work by modifying selectedUrls
  - the size and positioning of the cyan multi-selection box is calculated by cross-referencing selectedUrls with refMap

- context menu
  - Pretty straightforward, just show/hide the context menu and set its position

- pan and zoom
  - Store a reference to the PanZoom instance for world-space calculations
  - Stores scale to pass to Rnds to compensate for scale when dragging and resizing
  - Provide a function for converting absolute coordinates to world-space coordinates

Everything else, like mouse event logic, file handling, dragging/resizing, UI, etc., is handled by the components themselves.
*/

import { PanZoom } from "panzoom";
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
  refMap: Map<string, RefData>; // URL -> RefData, tells RefImage components how to render and used for export
  addRef: (url: string, worldX?: number, worldY?: number) => void; // Add reference image to map at given world-space coordinates (worldX, worldY)
  delRef: (url: string) => void; // Delete reference image from map and revoke URL
  setRef: (url: string, data: RefData) => void; // Update reference image data, used by RefImages to update/sync the store
  topRef: (url: string) => void; // Move reference image to top by deleting and re-adding it

  //////// Selection state ////////
  selectedUrls: Set<string>; // Set of selected URLs
  selectUrl: (url: string, moveToTop: boolean) => void; // Add URL to selection and move reference image to top
  unselectUrl: (url: string) => void; // Remove URL from selection
  clearSelection: () => void; // Clear all selections

  //////// Context menu state ////////
  contextMenuX: number; // X coordinate of context menu
  contextMenuY: number; // Y coordinate of context menu
  contextMenuShown: boolean; // Whether context menu is shown
  hideContextMenu: () => void; // Hide context menu
  showContextMenu: (x: number, y: number) => void; // Show context menu at x, y

  //////// Pan and zoom state ////////
  panZoomInstance: PanZoom | null; // The PanZoom instance, needed to calculate world-space coordinates
  setPanZoomInstance: (panZoomInstance: PanZoom) => void; // Set the PanZoom instance, should only be called once
  scale: number; // Zoom level, passed into Rnd to get correct drag and resize deltas when parent is scaled
  setScale: (scale: number) => void; // Set zoom level
  getWorldPosition: (
    clientX: number,
    clientY: number,
  ) => { x: number; y: number }; // Convert client (absolute) coordinates to world-space coordinates
};

// Zustand with Typescript requires curried version of create function. Notice create<T>() instead of create<T>.
const useStore = create<State>()((set, get) => ({
  //////// Reference map state ////////
  refMap: new Map(),
  addRef: (url: string, worldX?: number, worldY?: number) => {
    set((state) => {
      console.log("addRef");
      if (worldX === undefined || worldY === undefined) {
        // If worldX and worldY are not provided, center the image in the viewport.
        const { x, y } = state.getWorldPosition(
          window.innerWidth / 2,
          window.innerHeight / 2,
        );
        worldX = x;
        worldY = y;
      }
      const newRefMap = new Map(state.refMap);
      newRefMap.set(url, {
        x: worldX,
        y: worldY,
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
  selectUrl: (url: string, moveToTop: boolean) => {
    console.log("selectUrl");
    set((state) => {
      const newSelectedUrls = new Set(state.selectedUrls);
      newSelectedUrls.add(url);
      if (moveToTop && state.selectedUrls.size === 0) {
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

  //////// Canvas pan and zoom state ////////
  panZoomInstance: null,
  setPanZoomInstance: (panZoomInstance: PanZoom) => {
    console.log("setPanZoomInstance");
    set({ panZoomInstance });
  },
  scale: 1,
  setScale: (scale: number) => {
    console.log("setScale");
    set({ scale });
  },
  getWorldPosition: (clientX: number, clientY: number) => {
    const panZoomInstance = get().panZoomInstance;
    const worldCoordinates = { x: 0, y: 0 }; // Default to 0, 0 (should never happen since this should only get called after panZoomInstance has been set).
    if (panZoomInstance) {
      const { x, y, scale } = panZoomInstance.getTransform();
      const originX = -x / scale;
      const originY = -y / scale;
      worldCoordinates.x = originX + clientX / scale;
      worldCoordinates.y = originY + clientY / scale;
    }
    return worldCoordinates;
  },
}));

export default useStore;
