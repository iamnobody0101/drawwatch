import type { Meta, StoryObj } from "@storybook/react-vite";
import { DrawCard } from "./DrawCard";

const meta = {
  title: "Components/DrawCard",
  component: DrawCard,
  tags: ["autodocs"],
  args: {
    gameName: "Lotto 6/49",
    date: "2026-01-07",
    numbers: [3, 12, 27, 33, 41, 49],
    bonus: 8,
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "38rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof DrawCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Lotto649: Story = {};

export const LottoMax: Story = {
  args: {
    gameName: "Lotto Max",
    date: "2026-01-06",
    numbers: [5, 9, 14, 22, 31, 38, 47],
    bonus: 16,
  },
};

export const DailyGrand: Story = {
  args: {
    gameName: "Daily Grand",
    date: "2026-01-05",
    numbers: [4, 11, 19, 28, 36],
    bonus: 2,
  },
};

export const NarrowScreen: Story = {
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "20rem" }}>
        <Story />
      </div>
    ),
  ],
};
