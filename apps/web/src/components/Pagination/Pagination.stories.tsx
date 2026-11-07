import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";
import { Pagination } from "./Pagination";

const meta = {
  title: "Components/Pagination",
  component: Pagination,
  tags: ["autodocs"],
  args: {
    page: 1,
    totalPages: 5,
    onPageChange: fn(),
  },
} satisfies Meta<typeof Pagination>;

export default meta;

type Story = StoryObj<typeof meta>;

export const FirstPage: Story = {};

export const MiddlePage: Story = {
  args: { page: 3 },
};

export const LastPage: Story = {
  args: { page: 5 },
};
