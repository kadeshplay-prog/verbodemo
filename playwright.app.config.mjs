import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/app",
  outputDir: "work/app-test-results",
  fullyParallel: true,
  timeout: 45000,
  expect: { timeout: 10000 },
  retries: 0,
  workers: 3,
  reporter: [
    ["list"],
    ["html", { outputFolder: "work/app-report", open: "never" }],
    ["json", { outputFile: "work/app-test-results/results.json" }],
  ],
  use: {
    baseURL: process.env.APP_BASE_URL || "http://127.0.0.1:5173",
    locale: "es-MX",
    timezoneId: "America/Mexico_City",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium-desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 1000 },
        launchOptions: { args: ["--use-fake-device-for-media-stream"] },
      },
    },
    {
      name: "chromium-mobile",
      use: {
        ...devices["Pixel 7"],
        viewport: { width: 390, height: 844 },
        deviceScaleFactor: 1,
      },
    },
    {
      name: "firefox-desktop",
      use: {
        ...devices["Desktop Firefox"],
        viewport: { width: 1440, height: 1000 },
      },
    },
    {
      name: "webkit-desktop",
      use: {
        ...devices["Desktop Safari"],
        viewport: { width: 1440, height: 1000 },
        deviceScaleFactor: 1,
      },
    },
  ],
  webServer: process.env.APP_BASE_URL
    ? undefined
    : {
        command: "npm run preview -- --port 5173",
        url: "http://127.0.0.1:5173",
        reuseExistingServer: !process.env.CI,
        timeout: 30000,
      },
});
