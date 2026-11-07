import type { ReactNode } from "react";
import { Link as RouterLink, useLocation, useParams } from "react-router";
import { ApiError } from "../api/client.ts";
import { useDraw, useGames } from "../api/queries.ts";
import { DrawCard } from "../components/DrawCard/DrawCard.tsx";
import { ErrorState } from "../components/states/ErrorState.tsx";
import { StatusMessage } from "../components/StatusMessage/StatusMessage.tsx";
import { parseBackTo } from "./backTo.ts";
import styles from "./DrawDetailPage.module.css";

export function DrawDetailPage() {
  const { id = "" } = useParams();
  const location = useLocation();
  const draw = useDraw(id);
  const games = useGames();

  let content: ReactNode;
  if (draw.isPending) {
    content = <StatusMessage title="Loading draw..." message="Please wait a moment." />;
  } else if (draw.isError) {
    content =
      draw.error instanceof ApiError && draw.error.status === 404 ? (
        <StatusMessage
          title="Draw not found"
          message="There is no draw with this address. Go back to the results and pick another one."
        />
      ) : (
        <ErrorState onRetry={() => void draw.refetch()} />
      );
  } else {
    content = (
      <DrawCard
        gameName={
          games.data?.find((game) => game.id === draw.data.gameId)?.name ?? draw.data.gameId
        }
        date={draw.data.date}
        numbers={draw.data.numbers}
        bonus={draw.data.bonus}
      />
    );
  }

  return (
    <div>
      <RouterLink className={styles.backLink} to={parseBackTo(location.state)}>
        Back to results
      </RouterLink>
      <h1 className={styles.title}>Draw details</h1>
      {content}
    </div>
  );
}
