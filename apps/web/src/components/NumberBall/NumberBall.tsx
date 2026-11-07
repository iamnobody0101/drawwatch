import styles from "./NumberBall.module.css";

type NumberBallProps = {
  value: number;
};

export function NumberBall({ value }: NumberBallProps) {
  return <span className={styles.ball}>{value}</span>;
}
