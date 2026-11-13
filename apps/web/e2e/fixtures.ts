import { test as base, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

export const test = base.extend<{ accessibilityScan: void }>({
  accessibilityScan: [
    async ({ page }, use, testInfo) => {
      await use();
      if (testInfo.status !== "passed") {
        return;
      }
      const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
      for (const item of results.incomplete) {
        testInfo.annotations.push({
          type: "axe incomplete",
          description: `${item.id}: ${item.help}`,
        });
      }
      expect(results.violations, "axe found accessibility violations").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };
