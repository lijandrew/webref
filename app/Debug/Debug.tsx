import useRefStore from "@/stores/useRefStore";
import styles from "./Debug.module.css";

export default function Debug() {
  const refMap = useRefStore((state) => state.refMap);

  return (
    <div className={styles.Debug}>
      <button
        onClick={() => {
          console.log(refMap);
        }}
      >
        Log refMap
      </button>
    </div>
  );
}
