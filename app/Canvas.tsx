import useStore from "./useStore";
import styles from "./Canvas.module.css";

export default function Canvas() {
  const refMap = useStore((state) => state.refMap);
  return <div className={styles.Canvas}> {Array.from(refMap.values())} </div>;
}
