/**
 * Smoke test: loads built app and verifies v2 controls + export modes.
 * Run: npm run preview (port 4173) then npm run smoke
 */
import { chromium } from "playwright";

const BASE = process.env.PANNA_URL || "http://127.0.0.1:4180";

async function setupPage(page) {
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForSelector('button:has-text("Midnight")');
  await page.waitForSelector('button:has-text("ZIP")');
  await page.fill("textarea", "Slide one line");
  await page.click("text=+ Add slide");
  await page.locator("textarea").nth(1).fill("Slide two line");
  const previewCount = await page.locator("text=Slide one line").count();
  if (previewCount < 1) throw new Error("Preview did not render slide text");
}

async function testExport(page, format) {
  if (format === "pngs") {
    await page.getByRole("button", { name: "PNGs", exact: true }).click();
  }
  const exportLabel = format === "zip" ? "Export ZIP" : "Export PNGs";
  const exportBtn = page.getByRole("button", { name: exportLabel });
  await exportBtn.click();
  await exportBtn.waitFor({ hasText: "Downloaded!", timeout: 60000 });
  console.log(`${format.toUpperCase()} export passed`);
}

async function testZipExport(page) {
  await testExport(page, "zip");
}

async function testPngExport(page) {
  await testExport(page, "pngs");
}

async function testAboutModal(page) {
  await page.click('button:has-text("About")');
  await page.waitForSelector("text=Front-end Developer");
  await page.click('button[aria-label="Close"]');
  console.log("About modal passed");
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ acceptDownloads: true });
  const page = await context.newPage();

  const title = await page.goto(BASE, { waitUntil: "networkidle" }).then(() => page.title());
  if (!title.includes("Panna")) throw new Error(`Unexpected title: ${title}`);

  await setupPage(page);
  await testZipExport(page);
  await testPngExport(page);
  await testAboutModal(page);

  await browser.close();
  console.log("All smoke tests passed");
}

main().catch((err) => {
  console.error("Smoke test failed:", err.message);
  process.exit(1);
});
