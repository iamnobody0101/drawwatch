import type { ReactNode } from "react";
import { useDraws, useGames } from "../api/queries.ts";
import { DrawCard } from "../components/DrawCard/DrawCard.tsx";
import { EmptyState } from "../components/states/EmptyState.tsx";
import { ErrorState } from "../components/states/ErrorState.tsx";
import { LoadingState } from "../components/states/LoadingState.tsx";
import styles from "./ResultsPage.module.css";

export function ResultsPage() {
  const games = useGames();
  const draws = useDraws({});

  let content: ReactNode;
  if (draws.isPending) {
    content = <LoadingState />;
  } else if (draws.isError) {
    content = <ErrorState onRetry={() => void draws.refetch()} />;
  } else if (draws.data.items.length === 0) {
    content = <EmptyState />;
  } else {
    content = (
      <ul className={styles.list}>
        {draws.data.items.map((draw) => (
          <li key={draw.id}>
            <DrawCard
              gameName={games.data?.find((game) => game.id === draw.gameId)?.name ?? draw.gameId}
              date={draw.date}
              numbers={draw.numbers}
              bonus={draw.bonus}
            />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div>
      <h1 className={styles.title}>Results</h1>
      {content}
    </div>
  );
}
