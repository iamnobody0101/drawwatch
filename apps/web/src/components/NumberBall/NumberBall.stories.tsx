import type { Meta, StoryObj } from "@storybook/react-vite";
import { NumberBall } from "./NumberBall";

const meta = {
  title: "Components/NumberBall",
  component: NumberBall,
  tags: ["autodocs"],
  args: { value: 7 },
} satisfies Meta<typeof NumberBall>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SingleDigit: Story = {};

export const TwoDigits: Story = {
  args: { value: 49 },
};

export const Row: Story = {
  render: () => (
    <div style={{ display: "flex", gap: "var(--space-2)" }}>
      {[3, 12, 27, 33, 41, 49].map((number) => (
        <NumberBall key={number} value={number} />
      ))}
    </div>
  ),
};
