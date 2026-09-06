import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.TIMESMITH_UI_URL ?? "http://127.0.0.1:8090";
const browser = await chromium.launch({ headless: true });
const errors = [];

function trackErrors(page) {
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(String(error)));
}

async function createGamePage(viewport) {
  const page = await browser.newPage({ viewport });
  await page.addInitScript(() => localStorage.setItem("timesmith.onboarding.v1", "complete"));
  trackErrors(page);
  return page;
}

async function assertNoOverflow(page) {
  const overflows = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );
  assert.equal(overflows, false, "page should not horizontally overflow");
}

async function assertTourPlacement(page, targetName) {
  await page.waitForTimeout(250);
  const placement = await page.evaluate((name) => {
    const target = document.querySelector(`[data-tour-target="${name}"]`)?.getBoundingClientRect();
    const spotlight = document.querySelector(`[data-tour-spotlight="${name}"]`)?.getBoundingClientRect();
    const tooltip = document.querySelector(`[data-tour-tooltip="${name}"]`)?.getBoundingClientRect();
    if (!target || !spotlight || !tooltip) return null;
    const overlaps = !(tooltip.right <= spotlight.left || tooltip.left >= spotlight.right || tooltip.bottom <= spotlight.top || tooltip.top >= spotlight.bottom);
    return {
      overlaps,
      target: { top: target.top, right: target.right, bottom: target.bottom, left: target.left },
      spotlight: { top: spotlight.top, right: spotlight.right, bottom: spotlight.bottom, left: spotlight.left },
      tooltip: { top: tooltip.top, right: tooltip.right, bottom: tooltip.bottom, left: tooltip.left },
      targetVisible: target.top >= 0 && target.left >= 0 && target.bottom <= innerHeight && target.right <= innerWidth,
      tooltipVisible: tooltip.top >= 0 && tooltip.left >= 0 && tooltip.bottom <= innerHeight && tooltip.right <= innerWidth,
    };
  }, targetName);
  assert.ok(placement, `tour elements for ${targetName} should render`);
  assert.equal(placement.overlaps, false, `tour card should not cover ${targetName}: ${JSON.stringify(placement)}`);
  assert.equal(placement.targetVisible, true, `${targetName} should be scrolled into view`);
  assert.equal(placement.tooltipVisible, true, `tour card for ${targetName} should fit the viewport`);
}

try {
  const desktop = await createGamePage({ width: 1280, height: 800 });
  await desktop.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });

  await desktop.locator('button[aria-haspopup="dialog"]').click();
  await desktop.getByRole("button", { name: "Switch to dark mode" }).click();
  await desktop.getByRole("button", { name: "Close profile" }).click();
  await desktop.reload({ waitUntil: "domcontentloaded" });
  assert.equal(await desktop.locator("html").getAttribute("data-theme"), "dark");

  await desktop.getByRole("button", { name: "Practice", exact: true }).click();
  assert.equal(await desktop.locator(".hero-forge").isVisible(), false);
  await desktop.reload({ waitUntil: "domcontentloaded" });
  assert.equal(await desktop.locator(".hero-forge").isVisible(), false);
  assert.equal(await desktop.getByRole("button", { name: "Practice", exact: true }).getAttribute("aria-current"), "page");
  await desktop.getByRole("button", { name: "Progress", exact: true }).click();
  await desktop.reload({ waitUntil: "domcontentloaded" });
  await desktop.getByRole("heading", { name: "Progress", exact: true }).waitFor();
  assert.equal(await desktop.getByRole("button", { name: "Progress", exact: true }).getAttribute("aria-current"), "page");
  await assertNoOverflow(desktop);

  const activeDrill = await createGamePage({ width: 390, height: 844 });
  await activeDrill.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
  await activeDrill.getByRole("button", { name: "Start quick practice" }).click();
  assert.match(activeDrill.url(), /[?&]tab=practice/);
  await activeDrill.reload({ waitUntil: "domcontentloaded" });
  assert.equal(await activeDrill.locator(".hero-forge").isVisible(), false);
  await assertNoOverflow(activeDrill);

  const league = await createGamePage({ width: 1280, height: 800 });
  await league.goto(`${baseUrl}/?tab=leaderboard`, { waitUntil: "domcontentloaded" });
  await league.getByText("Preview standings", { exact: false }).waitFor();
  assert.equal(await league.getByText("Maya Chen", { exact: true }).count(), 1);
  await assertNoOverflow(league);

  const localePage = await createGamePage({ width: 390, height: 844 });
  await localePage.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
  await localePage.getByRole("button", { name: "Change language" }).click();
  await localePage.getByRole("menuitemradio", { name: "Bahasa Indonesia ID" }).click();
  assert.equal(await localePage.locator("html").getAttribute("lang"), "id");
  await localePage.getByRole("button", { name: "Mulai latihan cepat" }).waitFor();
  await localePage.reload({ waitUntil: "networkidle" });
  assert.equal(await localePage.locator("html").getAttribute("lang"), "id");
  assert.match(await localePage.locator("body").innerText(), /Tempa harian/i);
  await assertNoOverflow(localePage);

  const login = await browser.newPage({ viewport: { width: 390, height: 844 } });
  trackErrors(login);
  await login.goto(`${baseUrl}/login`, { waitUntil: "domcontentloaded" });
  assert.equal(await login.getByRole("button", { name: "Continue with Google" }).count(), 1);
  assert.equal(await login.getByText("Continue with X", { exact: true }).count(), 0);
  await assertNoOverflow(login);

  const streak = await createGamePage({ width: 390, height: 844 });
  await streak.addInitScript(() => {
    localStorage.setItem(
      "timesmith.save.v1",
      JSON.stringify({
        version: 3,
        facts: {},
        best: { sprint: {}, streak: {} },
        muted: false,
        profile: { id: "test-user", name: "Test Smith", color: "#2FA8F8" },
        totals: { answered: 7, correct: 5 },
        daily: { currentStreak: 3, bestStreak: 5, lastPracticeDate: "2026-09-06" },
      }),
    );
  });
  await streak.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
  await streak.getByText("3 days", { exact: true }).waitFor();
  assert.equal(await streak.getByText("3 days", { exact: true }).count(), 1);
  await assertNoOverflow(streak);

  const tour = await browser.newPage({ viewport: { width: 390, height: 844 } });
  trackErrors(tour);
  await tour.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
  await tour.getByRole("dialog", { name: "Start with a quick warm-up" }).waitFor();
  await assertTourPlacement(tour, "quick-start");
  await tour.getByRole("button", { name: "Next", exact: true }).click();
  await tour.getByRole("dialog", { name: "Build your own drill" }).waitFor();
  await assertTourPlacement(tour, "practice-tab");
  await tour.getByRole("button", { name: "Next", exact: true }).click();
  await tour.getByRole("dialog", { name: "Try your first drill" }).waitFor();
  await assertTourPlacement(tour, "start-drill");
  await mkdir("screenshots", { recursive: true });
  await tour.screenshot({ path: "screenshots/tour-start-drill-mobile.png" });
  await tour.getByRole("button", { name: "Next", exact: true }).click();
  await tour.getByRole("dialog", { name: "See what to forge next" }).waitFor();
  await assertTourPlacement(tour, "progress-tab");
  await tour.getByRole("button", { name: "Next", exact: true }).click();
  await tour.getByRole("dialog", { name: "Join the weekly league" }).waitFor();
  await assertTourPlacement(tour, "league-tab");
  await tour.screenshot({ path: "screenshots/tour-league-mobile.png" });
  await tour.getByRole("button", { name: "Done", exact: true }).click();
  assert.equal(await tour.getByRole("dialog").count(), 0);
  await tour.reload({ waitUntil: "domcontentloaded" });
  assert.equal(await tour.getByRole("dialog").count(), 0);
  await assertNoOverflow(tour);

  const desktopTour = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  trackErrors(desktopTour);
  await desktopTour.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
  await desktopTour.getByRole("dialog", { name: "Start with a quick warm-up" }).waitFor();
  await desktopTour.getByRole("button", { name: "Next", exact: true }).click();
  await desktopTour.getByRole("dialog", { name: "Build your own drill" }).waitFor();
  await desktopTour.getByRole("button", { name: "Next", exact: true }).click();
  await desktopTour.getByRole("dialog", { name: "Try your first drill" }).waitFor();
  await assertTourPlacement(desktopTour, "start-drill");
  await desktopTour.screenshot({ path: "screenshots/tour-start-drill-desktop.png" });
  await desktopTour.getByRole("button", { name: "Next", exact: true }).click();
  await desktopTour.getByRole("dialog", { name: "See what to forge next" }).waitFor();
  await desktopTour.getByRole("button", { name: "Next", exact: true }).click();
  await desktopTour.getByRole("dialog", { name: "Join the weekly league" }).waitFor();
  await assertTourPlacement(desktopTour, "league-tab");
  await desktopTour.screenshot({ path: "screenshots/tour-league-desktop.png" });

  assert.deepEqual(errors, [], `browser console errors: ${errors.join("; ")}`);
  console.log("Timesmith UI contracts passed");
} finally {
  await browser.close();
}
