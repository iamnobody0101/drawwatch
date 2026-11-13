import { defineConfig, devices } from "@playwright/test";

const isCI = Boolean(process.env.CI);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://localhost:5173",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
    { name: "pixel", use: { ...devices["Pixel 7"] } },
    { name: "iphone", use: { ...devices["iPhone 15"] } },
  ],
  webServer: [
    {
      command: "npm run start --workspace @drawwatch/api",
      cwd: "../..",
      url: "http://localhost:3000/api/v1/health",
      reuseExistingServer: false,
    },
    {
      command: "npm run build && npm run preview -- --port 5173 --strictPort",
      env: { VITE_API_URL: "http://localhost:3000" },
      url: "http://localhost:5173",
      reuseExistingServer: false,
      timeout: 120_000,
    },
  ],
});
