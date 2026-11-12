import type { ReactNode } from "react";
import { useSearchParams } from "react-router";
import type { FrequencyEntry, GameId } from "@drawwatch/shared";
import { useFrequency, useGames } from "../api/queries.ts";
import { BarChart } from "../components/BarChart/BarChart.tsx";
import { GameSelect } from "../components/GameSelect/GameSelect.tsx";
import { NumberBall } from "../components/NumberBall/NumberBall.tsx";
import { StatusMessage } from "../components/StatusMessage/StatusMessage.tsx";
import { ErrorState } from "../components/states/ErrorState.tsx";
import { LoadingState } from "../components/states/LoadingState.tsx";
import { isRangeBackwards, parseDate, parseGameId } from "./filters.ts";
import { buildChartItems, buildSummary, formatTimes } from "./stats.ts";
import styles from "./StatsPage.module.css";

// The Stats page shows one game at a time, so it needs a game even when the address has none.
const DEFAULT_GAME: GameId = "lotto-649";

type NumberListProps = {
  entries: FrequencyEntry[];
};

// A row of number balls, each with how many times it was drawn.
function NumberList({ entries }: NumberListProps) {
  return (
    <ul className={styles.numberList}>
      {entries.map((entry) => (
        <li key={entry.number} className={styles.numberItem}>
          <NumberBall value={entry.number} />
          <span className={styles.count}>{formatTimes(entry.count)}</span>
        </li>
      ))}
    </ul>
  );
}

export function StatsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const gameId = parseGameId(searchParams.get("gameId")) ?? DEFAULT_GAME;
  const from = parseDate(searchParams.get("from"));
  const to = parseDate(searchParams.get("to"));
  const backwards = isRangeBackwards(from, to);
  const games = useGames();
  // When From is after To, we do not ask the server.
  const frequency = useFrequency(
    { gameId, from: from || undefined, to: to || undefined },
    !backwards,
  );
  const gameName = games.data?.find((game) => game.id === gameId)?.name ?? gameId;

  // Puts one value in the address bar, or removes it when the value is empty.
  function setParam(name: string, value: string) {
    const next = new URLSearchParams(searchParams);
    if (value === "") {
      next.delete(name);
    } else {
      next.set(name, value);
    }
    setSearchParams(next);
  }

  let content: ReactNode;
  if (backwards) {
    content = (
      <p className={styles.backwards} role="alert">
        The From date must not be after the To date.
      </p>
    );
  } else if (frequency.isPending) {
    content = <LoadingState subject="statistics" />;
  } else if (frequency.isError) {
    content = <ErrorState subject="statistics" onRetry={() => void frequency.refetch()} />;
  } else if (frequency.data.totalDraws === 0) {
    content = (
      <StatusMessage title="No draws in this date range" message="Try a wider range of dates." />
    );
  } else {
    const result = frequency.data;
    content = (
      <>
        <BarChart
          title={`${gameName}: how often each number was drawn`}
          items={buildChartItems(result)}
          labelName="Number"
          valueName="Times drawn"
          summary={buildSummary(result)}
        />
        <div className={`${styles.section} ${styles.columns}`}>
          <section aria-labelledby="hot-title">
            <h2 id="hot-title" className={styles.sectionTitle}>
              Hot: drawn most often
            </h2>
            <NumberList entries={result.hot} />
          </section>
          <section aria-labelledby="cold-title">
            <h2 id="cold-title" className={styles.sectionTitle}>
              Cold: drawn least often
            </h2>
            <NumberList entries={result.cold} />
          </section>
        </div>
      </>
    );
  }

  return (
    <div>
      <title>Stats | DrawWatch</title>
      <h1 className={styles.title}>Stats</h1>
      <div className={styles.filters}>
        <GameSelect
          games={games.data ?? []}
          value={gameId}
          onChange={(value) => setParam("gameId", parseGameId(value) ?? "")}
          allowAll={false}
        />
        <div className={styles.dateField}>
          <label className={styles.dateLabel} htmlFor="from-date">
            From
          </label>
          <input
            id="from-date"
            className={styles.dateInput}
            type="date"
            value={from}
            onChange={(event) => setParam("from", parseDate(event.target.value))}
          />
        </div>
        <div className={styles.dateField}>
          <label className={styles.dateLabel} htmlFor="to-date">
            To
          </label>
          <input
            id="to-date"
            className={styles.dateInput}
            type="date"
            value={to}
            onChange={(event) => setParam("to", parseDate(event.target.value))}
          />
        </div>
      </div>
      {content}
      <p className={styles.note}>
        Draws are independent. Past frequency does not predict future draws.
      </p>
    </div>
  );
}
