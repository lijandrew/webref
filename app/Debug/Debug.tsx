import React, { useState } from "react";
import useStore from "@/useStore";
import styles from "./Debug.module.css";
import Image from "next/image";

const consoleLog = console.log; // Save console.log
console.log = function () {}; // Disable console.log by default

export default function Debug() {
  const refMap = useStore((state) => state.refMap);
  const selectedUrls = useStore((state) => state.selectedUrls);
  const [show, setShow] = useState(false);

  function handleClick() {
    setShow((prev) => {
      if (prev) {
        console.log = function () {}; // Disable console.log
      } else {
        console.log = consoleLog; // Restore console.log
      }
      return !prev;
    });
  }

  return (
    <div className={styles.Debug}>
      <Image
        className={styles.wrench}
        onClick={handleClick}
        src={show ? "/wrench-on.svg" : "/wrench-off.svg"}
        alt="Devtools"
        width={24}
        height={24}
      />
      {show && (
        <React.Fragment>
          <button
            onClick={() => {
              console.log(refMap);
            }}
          >
            Log refMap
          </button>
          <button
            onClick={() => {
              console.log(selectedUrls);
            }}
          >
            Log selectedUrls
          </button>
        </React.Fragment>
      )}
    </div>
  );
}
