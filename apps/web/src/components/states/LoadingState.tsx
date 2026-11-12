import { StatusMessage } from "../StatusMessage/StatusMessage";

type LoadingStateProps = {
  subject?: string; // what is loading, for example "statistics"
};

export function LoadingState({ subject = "draws" }: LoadingStateProps) {
  return <StatusMessage title={`Loading ${subject}...`} message="Please wait a moment." />;
}
