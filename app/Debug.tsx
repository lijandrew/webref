import useStore from "./useStore";
import styles from "./Debug.module.css";

export default function Debug() {
  const refMap = useStore((state) => state.refMap);
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
