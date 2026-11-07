import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatusMessage } from "./StatusMessage";

const meta = {
  title: "Components/StatusMessage",
  component: StatusMessage,
  tags: ["autodocs"],
  args: {
    title: "Loading draws...",
    message: "Please wait a moment.",
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "38rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof StatusMessage>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Alert: Story = {
  args: {
    title: "Something went wrong",
    message: "Please try again later.",
    role: "alert",
  },
};

export const WithAction: Story = {
  args: {
    title: "Something went wrong",
    message: "Please try again later.",
    role: "alert",
    action: <button type="button">Try again</button>,
  },
};
