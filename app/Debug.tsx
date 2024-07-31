import useStore from "./useStore";
import styles from "./Debug.module.css";

export default function Debug() {
  const refMap = useStore((state) => state.refMap);
  const selectedUrl = useStore((state) => state.selectedUrl);

  return (
    <div className={styles.Debug}>
      <button
        onClick={() => {
          console.log(refMap);
          console.log(selectedUrl);
        }}
      >
        Log refMap
      </button>
    </div>
  );
}
