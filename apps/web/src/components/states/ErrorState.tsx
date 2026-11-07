import { Button } from "../Button/Button";
import { StatusMessage } from "../StatusMessage/StatusMessage";

type ErrorStateProps = {
  onRetry: () => void;
};

export function ErrorState({ onRetry }: ErrorStateProps) {
  return (
    <StatusMessage
      title="Sorry, the draws could not be loaded."
      message="Check your connection, or the server may be busy. Please try again."
      role="alert"
      action={<Button onClick={onRetry}>Try again</Button>}
    />
  );
}
