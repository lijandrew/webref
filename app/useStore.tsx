import { create } from "zustand";
import React from "react";
import RefImage from "./RefImage";

type State = {
  refMap: Map<string, React.JSX.Element>;
  addRef: (url: string) => void;
  delRef: (url: string) => void;
};

const useStore = create<State>((set) => ({
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
      return { refMap: newRefMap };
    }),
}));

export default useStore;
