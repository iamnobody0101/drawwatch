import { useServerHealth } from "../../api/queries.ts";
import { useAfterDelay } from "../../hooks/useAfterDelay.ts";
import { WakingUpState } from "../states/WakingUpState.tsx";

export function ServerStatus() {
  const health = useServerHealth();
  const isSlow = useAfterDelay(health.isPending, 3000);

  if (!isSlow) {
    return null;
  }
  return <WakingUpState />;
}
