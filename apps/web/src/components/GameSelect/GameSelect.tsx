import type { Game } from "@drawwatch/shared";
import styles from "./GameSelect.module.css";

type GameSelectProps = {
  games: Game[];
  value: string;
  onChange: (value: string) => void;
  allowAll?: boolean; // show the "All games" choice (default: yes)
};

export function GameSelect({ games, value, onChange, allowAll = true }: GameSelectProps) {
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
        {allowAll ? <option value="">All games</option> : null}
        {games.map((game) => (
          <option key={game.id} value={game.id}>
            {game.name}
          </option>
        ))}
      </select>
    </div>
  );
}
