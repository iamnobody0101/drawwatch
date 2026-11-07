import { StatusMessage } from "../StatusMessage/StatusMessage";

export function EmptyState() {
  return <StatusMessage title="No draws found" message="Try another game." />;
}
