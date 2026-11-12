import { Button } from "../Button/Button";
import { StatusMessage } from "../StatusMessage/StatusMessage";

type ErrorStateProps = {
  onRetry: () => void;
  subject?: string; // what could not be loaded, for example "statistics"
};

export function ErrorState({ onRetry, subject = "draws" }: ErrorStateProps) {
  return (
    <StatusMessage
      title={`Sorry, the ${subject} could not be loaded.`}
      message="Check your connection, or the server may be busy. Please try again."
      role="alert"
      action={<Button onClick={onRetry}>Try again</Button>}
    />
  );
}
