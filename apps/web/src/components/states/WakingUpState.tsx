import { StatusMessage } from "../StatusMessage/StatusMessage";

export function WakingUpState() {
  return (
    <StatusMessage
      title="Waking up the server..."
      message="The free server sleeps when nobody uses it. This can take up to a minute."
    />
  );
}
