import { NumberBall } from "../NumberBall/NumberBall";
import styles from "./DrawCard.module.css";

type DrawCardProps = {
  gameName: string;
  date: string;
  numbers: number[];
  bonus: number;
};

export function DrawCard({ gameName, date, numbers, bonus }: DrawCardProps) {
  return (
    <article className={styles.card}>
      <h2 className={styles.title}>{gameName}</h2>
      <p className={styles.date}>
        Date: <time dateTime={date}>{date}</time>
      </p>
      <ul className={styles.balls} aria-label="Winning numbers">
        {numbers.map((number) => (
          <li key={number}>
            <NumberBall value={number} />
          </li>
        ))}
      </ul>
      <p className={styles.bonus}>Bonus number: {bonus}</p>
    </article>
  );
}
