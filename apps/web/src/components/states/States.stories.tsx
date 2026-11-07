import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { LoadingState } from "./LoadingState";
import { WakingUpState } from "./WakingUpState";

const meta = {
  title: "Components/States",
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "38rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  render: () => <LoadingState />,
};

export const Empty: Story = {
  render: () => <EmptyState />,
};

export const Failed: Story = {
  render: () => <ErrorState onRetry={fn()} />,
};

export const WakingUp: Story = {
  render: () => <WakingUpState />,
};
