import React from "react";
import RefImage from "./RefImage";
import type { RefMap, SetRefMap } from "./page";

type Props = {
  refMap: RefMap;
  setRefMap: SetRefMap;
};

export default function UploadButton({ refMap, setRefMap }: Props) {
  // Creates new RefImage components, assumes no previously saved position or width.
  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const files = Array.from(e.target.files || []);
    const newRefMap = new Map(refMap); // Shallow copy for setState
    for (const file of files) {
      // For each file, create URL and map it to RefImage component
      const url = URL.createObjectURL(file);
      newRefMap.set(
        url,
        <RefImage url={url} defaultX={0} defaultY={0} defaultWidth="auto" />,
      );
    }
    setRefMap(newRefMap);
  }
  return (
    <input
      onChange={handleChange}
      type="file"
      multiple
      accept=".png,.jpg,.jpeg,.gif"
    />
  );
}
