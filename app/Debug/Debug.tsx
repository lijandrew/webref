import useStore from "@/useStore";
import styles from "./Debug.module.css";

export default function Debug() {
  const refMap = useStore((state) => state.refMap);
  const selectedUrls = useStore((state) => state.selectedUrls);

  return (
    <div className={styles.Debug}>
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
    </div>
  );
}
