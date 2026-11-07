import type { Game } from "@drawwatch/shared";
import styles from "./GameSelect.module.css";

type GameSelectProps = {
  games: Game[];
  value: string;
  onChange: (value: string) => void;
};

export function GameSelect({ games, value, onChange }: GameSelectProps) {
  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor="game-select">
        Game
      </label>
      <select
        id="game-select"
        className={styles.select}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        <option value="">All games</option>
        {games.map((game) => (
          <option key={game.id} value={game.id}>
            {game.name}
          </option>
        ))}
      </select>
    </div>
  );
}
