import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { GameSelect } from "./GameSelect";

const meta = {
  title: "Components/GameSelect",
  component: GameSelect,
  tags: ["autodocs"],
  args: {
    games: [
      { id: "lotto-649", name: "Lotto 6/49", pickCount: 6, maxNumber: 49, bonusMax: 49 },
      { id: "lotto-max", name: "Lotto Max", pickCount: 7, maxNumber: 50, bonusMax: 50 },
      { id: "daily-grand", name: "Daily Grand", pickCount: 5, maxNumber: 49, bonusMax: 7 },
    ],
    value: "",
    onChange: fn(),
  },
} satisfies Meta<typeof GameSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllGames: Story = {};

export const GameSelected: Story = {
  args: { value: "lotto-max" },
};
