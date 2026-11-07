import { Button } from "../Button/Button";
import { StatusMessage } from "../StatusMessage/StatusMessage";

type PageOutOfRangeStateProps = {
  onGoToFirstPage: () => void;
};

export function PageOutOfRangeState({ onGoToFirstPage }: PageOutOfRangeStateProps) {
  return (
    <StatusMessage
      title="This page does not exist."
      message="There are no draws on this page number."
      action={<Button onClick={onGoToFirstPage}>Go to page 1</Button>}
    />
  );
}
