import type { Meta, StoryObj } from "@storybook/react-vite";
import { BarChart } from "./BarChart";
import type { BarItem } from "./BarChart";

// 49 made-up counts between 48 and 83, like a Lotto 6/49 chart.
const lottoItems: BarItem[] = Array.from({ length: 49 }, (_, index) => {
  const value = 48 + ((index * 7) % 36);
  const group = value >= 80 ? "hot" : value <= 51 ? "cold" : undefined;
  return { label: String(index + 1), value, group };
});

const meta = {
  title: "Components/BarChart",
  component: BarChart,
  args: {
    title: "How often each number was drawn",
    items: lottoItems,
    labelName: "Number",
    valueName: "Times drawn",
    summary: "Most drawn: 6 (83 times). Least drawn: 1 and 37 (48 times each).",
  },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: "50rem" }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof BarChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const LottoNumbers: Story = {};

export const FewNumbers: Story = {
  args: {
    items: [
      { label: "1", value: 12, group: "hot" },
      { label: "2", value: 7 },
      { label: "3", value: 3, group: "cold" },
      { label: "4", value: 9 },
    ],
    summary: "Most drawn: 1 (12 times). Least drawn: 3 (3 times).",
  },
};

// A phone that is 320px wide has about 288px left after the page margins.
export const Narrow: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: "288px" }}>
        <Story />
      </div>
    ),
  ],
};
