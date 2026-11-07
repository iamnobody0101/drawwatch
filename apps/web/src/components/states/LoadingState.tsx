import { StatusMessage } from "../StatusMessage/StatusMessage";

export function LoadingState() {
  return <StatusMessage title="Loading draws..." message="Please wait a moment." />;
}
