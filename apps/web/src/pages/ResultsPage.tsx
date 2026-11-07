import type { ReactNode } from "react";
import { Link as RouterLink, useLocation, useSearchParams } from "react-router";
import { useDraws, useGames } from "../api/queries.ts";
import { DrawCard } from "../components/DrawCard/DrawCard.tsx";
import { GameSelect } from "../components/GameSelect/GameSelect.tsx";
import { Pagination } from "../components/Pagination/Pagination.tsx";
import { EmptyState } from "../components/states/EmptyState.tsx";
import { ErrorState } from "../components/states/ErrorState.tsx";
import { LoadingState } from "../components/states/LoadingState.tsx";
import { PageOutOfRangeState } from "../components/states/PageOutOfRangeState.tsx";
import { parseGameId, parsePage } from "./filters.ts";
import styles from "./ResultsPage.module.css";

export function ResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const gameId = parseGameId(searchParams.get("gameId"));
  const page = parsePage(searchParams.get("page"));
  const games = useGames();
  const draws = useDraws({ gameId, page });

  function changeGame(value: string) {
    const next = new URLSearchParams(searchParams);
    next.delete("page");
    const newGameId = parseGameId(value);
    if (newGameId === undefined) {
      next.delete("gameId");
    } else {
      next.set("gameId", newGameId);
    }
    setSearchParams(next);
  }

  function changePage(newPage: number) {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(newPage));
    setSearchParams(next);
    window.scrollTo({ top: 0 });
  }

  let content: ReactNode;
  if (draws.isPending) {
    content = <LoadingState />;
  } else if (draws.isError) {
    content = <ErrorState onRetry={() => void draws.refetch()} />;
  } else if (draws.data.items.length === 0) {
    content =
      page > 1 ? <PageOutOfRangeState onGoToFirstPage={() => changePage(1)} /> : <EmptyState />;
  } else {
    const totalPages = Math.ceil(draws.data.total / draws.data.pageSize);
    content = (
      <>
        <ul className={styles.list}>
          {draws.data.items.map((draw) => {
            const gameName =
              games.data?.find((game) => game.id === draw.gameId)?.name ?? draw.gameId;
            return (
              <li key={draw.id}>
                <DrawCard
                  gameName={gameName}
                  date={draw.date}
                  numbers={draw.numbers}
                  bonus={draw.bonus}
                  footer={
                    <RouterLink
                      className={styles.detailLink}
                      to={`/draws/${encodeURIComponent(draw.id)}`}
                      state={{ backTo: `${location.pathname}${location.search}` }}
                      aria-label={`View details for ${gameName} on ${draw.date}`}
                    >
                      View details
                    </RouterLink>
                  }
                />
              </li>
            );
          })}
        </ul>
        <Pagination page={page} totalPages={totalPages} onPageChange={changePage} />
      </>
    );
  }

  return (
    <div>
      <h1 className={styles.title}>Results</h1>
      <GameSelect games={games.data ?? []} value={gameId ?? ""} onChange={changeGame} />
      {content}
    </div>
  );
}
