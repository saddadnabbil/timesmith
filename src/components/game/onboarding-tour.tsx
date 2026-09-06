import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n, type Message } from "@/lib/i18n";

type TourTab = "home" | "practice" | "progress" | "leaderboard";
type Rect = { top: number; left: number; width: number; height: number };
type Position = { top: number; left: number; origin: "top" | "bottom" };

const TOUR_STORAGE_KEY = "timesmith.onboarding.v1";
const VIEWPORT_GUTTER = 16;
const TARGET_GAP = 18;
const TARGET_PADDING = 8;
const STEPS: Array<{ target: string; tab: TourTab; title: Message; body: Message }> = [
  { target: "quick-start", tab: "home", title: "Start with a quick warm-up", body: "This starts a simple 20-question drill. You can play as a guest right away." },
  { target: "practice-tab", tab: "practice", title: "Build your own drill", body: "Practice lets you choose the subject, operation, difficulty, and play mode." },
  { target: "start-drill", tab: "practice", title: "Try your first drill", body: "Set up the drill, then press this button. Use the keypad to answer and build your streak." },
  { target: "progress-tab", tab: "progress", title: "See what to forge next", body: "Progress shows your accuracy, completed problems, and facts that need another round." },
  { target: "league-tab", tab: "leaderboard", title: "Join the weekly league", body: "Browse the standings anytime. Sign in only when you want to submit verified scores." },
];

export function OnboardingTour({ onSelectTab }: { onSelectTab: (tab: TourTab) => void }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [targetRect, setTargetRect] = useState<Rect | null>(null);
  const [tooltipSize, setTooltipSize] = useState({ width: 360, height: 244 });
  const tooltipRef = useRef<HTMLElement>(null);
  const current = STEPS[step];
  const isLastStep = step === STEPS.length - 1;

  const dismiss = () => {
    window.localStorage.setItem(TOUR_STORAGE_KEY, "complete");
    setOpen(false);
  };

  useEffect(() => {
    if (window.localStorage.getItem(TOUR_STORAGE_KEY) !== "complete") setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    setTargetRect(null);
    onSelectTab(current.tab);
    let cancelled = false;
    let retryTimer = 0;
    let settleTimer = 0;
    let target: HTMLElement | null = null;

    const measure = () => {
      if (cancelled || !target) return;
      const rect = target.getBoundingClientRect();
      setTargetRect({ top: rect.top, left: rect.left, width: rect.width, height: rect.height });
    };
    const findTarget = (attempt = 0) => {
      if (cancelled) return;
      target = document.querySelector<HTMLElement>(`[data-tour-target="${current.target}"]`);
      if (!target) {
        if (attempt < 12) retryTimer = window.setTimeout(() => findTarget(attempt + 1), 50);
        return;
      }
      if (!current.target.endsWith("-tab")) {
        target.scrollIntoView({ behavior: "auto", block: "center", inline: "nearest" });
      }
      window.requestAnimationFrame(measure);
      settleTimer = window.setTimeout(measure, 180);
    };

    const frame = window.requestAnimationFrame(() => findTarget());
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      window.clearTimeout(retryTimer);
      window.clearTimeout(settleTimer);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [current.tab, current.target, onSelectTab, open]);

  useLayoutEffect(() => {
    if (!targetRect || !tooltipRef.current) return;
    const tooltip = tooltipRef.current;
    const measureTooltip = () => {
      setTooltipSize({ width: tooltip.offsetWidth, height: tooltip.offsetHeight });
    };
    measureTooltip();
    const observer = new ResizeObserver(measureTooltip);
    observer.observe(tooltip);
    return () => observer.disconnect();
  }, [step, targetRect]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") dismiss();
      if (event.key === "ArrowLeft" && step > 0) setStep((value) => value - 1);
      if (event.key === "ArrowRight" && !isLastStep) setStep((value) => value + 1);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isLastStep, open, step]);

  if (!open || !targetRect) return null;
  const spotlight = {
    top: Math.max(4, targetRect.top - TARGET_PADDING),
    left: Math.max(4, targetRect.left - TARGET_PADDING),
    width: Math.min(window.innerWidth - 8, targetRect.width + TARGET_PADDING * 2),
    height: targetRect.height + TARGET_PADDING * 2,
  };
  const position = getTooltipPosition(targetRect, tooltipSize);

  return (
    <div className="fixed inset-0 z-50" aria-live="polite">
      <div data-tour-spotlight={current.target} aria-hidden="true" className="tour-spotlight pointer-events-none fixed rounded-[var(--radius-lg)] border-2 border-accent" style={{ ...spotlight, boxShadow: "0 0 0 9999px rgb(15 23 42 / 0.62)" }} />
      <section
        key={current.target}
        ref={tooltipRef}
        data-tour-tooltip={current.target}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-title"
        className="tour-coachmark fixed z-10 max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-sm overflow-y-auto rounded-[var(--radius-xl)] bg-elevated p-5 text-fg shadow-[var(--shadow-paper)] sm:p-6"
        style={{ top: position.top, left: position.left, transformOrigin: position.origin === "bottom" ? "bottom center" : "top center" }}
      >
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs font-extrabold tracking-[0.14em] text-accent-dark uppercase">{t("Guide")} · {step + 1} {t("of")} {STEPS.length}</p>
          <Button variant="ghost" size="icon" aria-label={t("Skip tour")} onClick={dismiss}><X className="size-5" /></Button>
        </div>
        <h2 id="tour-title" className="font-display mt-3 text-2xl font-black">{t(current.title)}</h2>
        <p className="mt-2 text-sm font-semibold leading-relaxed text-muted">{t(current.body)}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          {step > 0 ? (
            <button type="button" onClick={() => setStep((value) => value - 1)} className="flex min-h-11 items-center gap-1.5 px-1 text-sm font-extrabold text-muted transition-[color,transform] duration-150 hover:text-fg active:scale-[0.97]"><ArrowLeft className="size-4" /> {t("Back")}</button>
          ) : (
            <button type="button" onClick={dismiss} className="min-h-11 px-1 text-sm font-extrabold text-muted transition-[color,transform] duration-150 hover:text-fg active:scale-[0.97]">{t("Skip tour")}</button>
          )}
          <Button size="md" onClick={() => (isLastStep ? dismiss() : setStep((value) => value + 1))}>{isLastStep ? t("Done") : t("Next")}{!isLastStep && <ArrowRight className="size-4" />}</Button>
        </div>
        <div className="mt-4 grid grid-cols-5 gap-1.5" aria-hidden="true">
          {STEPS.map((item, index) => <span key={item.target} className={`h-1 rounded-full ${index <= step ? "bg-accent" : "bg-border"}`} />)}
        </div>
      </section>
    </div>
  );
}

function getTooltipPosition(target: Rect, tooltip: { width: number; height: number }): Position {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const width = Math.min(tooltip.width, viewportWidth - VIEWPORT_GUTTER * 2);
  const height = Math.min(tooltip.height, viewportHeight - VIEWPORT_GUTTER * 2);
  const left = clamp(target.left + target.width / 2 - width / 2, VIEWPORT_GUTTER, viewportWidth - width - VIEWPORT_GUTTER);
  const roomAbove = target.top - TARGET_GAP - VIEWPORT_GUTTER;
  const roomBelow = viewportHeight - target.top - target.height - TARGET_GAP - VIEWPORT_GUTTER;
  if (roomBelow >= height || roomBelow >= roomAbove) {
    return { top: clamp(target.top + target.height + TARGET_GAP, VIEWPORT_GUTTER, viewportHeight - height - VIEWPORT_GUTTER), left, origin: "top" };
  }
  return { top: clamp(target.top - height - TARGET_GAP, VIEWPORT_GUTTER, viewportHeight - height - VIEWPORT_GUTTER), left, origin: "bottom" };
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), Math.max(min, max));
}
