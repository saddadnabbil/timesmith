import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { ChartNoAxesColumn, Dumbbell, House, Trophy } from "lucide-react";
import { HomeScreen } from "@/components/game/home";
import { LeaderboardScreen } from "@/components/game/leaderboard";
import { PlayScreen } from "@/components/game/play";
import { ProgressScreen } from "@/components/game/progress";
import { ResultsScreen } from "@/components/game/results";
import { OnboardingTour } from "@/components/game/onboarding-tour";
import { writeSave } from "@/lib/game/save";
import { useGame } from "@/lib/game/store";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

type AppTab = "home" | "practice" | "progress" | "leaderboard";

export function GameApp({ initialTab }: { initialTab: AppTab }) {
  const { t } = useI18n();
  const screen = useGame((s) => s.screen);
  const hydrate = useGame((s) => s.hydrate);
  const goHome = useGame((s) => s.goHome);
  const goProgress = useGame((s) => s.goProgress);
  const [tab, setTab] = useState<AppTab>(initialTab);
  const selectTab = useCallback((nextTab: AppTab) => {
    const url = new URL(window.location.href);
    if (nextTab === "home") url.searchParams.delete("tab");
    else url.searchParams.set("tab", nextTab);
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
    setTab(nextTab);
  }, []);
  const guideToTab = useCallback(
    (nextTab: AppTab) => {
      selectTab(nextTab);
      if (nextTab === "progress") goProgress();
      else goHome();
      window.scrollTo({ top: 0, behavior: "instant" });
    },
    [goHome, goProgress, selectTab],
  );

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // The server receives the tab query and renders the correct screen first.
  // This only aligns the client game store for the Progress screen.
  useLayoutEffect(() => {
    if (initialTab === "progress") useGame.getState().goProgress();
  }, []);

  useEffect(() => {
    const flush = () => writeSave(useGame.getState().save);
    const onVis = () => {
      if (document.visibilityState === "hidden") flush();
    };
    window.addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const activeScreen = screen === "home" && tab === "progress" ? "progress" : screen;

  return (
    <main
      className={cn(
        "min-h-dvh bg-bg/95 text-fg",
        (activeScreen === "home" || activeScreen === "progress") && "pb-24",
      )}
    >
      {activeScreen === "home" && tab !== "leaderboard" && (
        <HomeScreen
          view={tab === "practice" ? "practice" : "home"}
          onBeginPractice={() => selectTab("practice")}
          onLeaderboard={() => {
            selectTab("leaderboard");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        />
      )}
      {activeScreen === "home" && tab === "leaderboard" && (
        <LeaderboardScreen onBack={() => selectTab("home")} />
      )}
      {activeScreen === "play" && <PlayScreen />}
      {activeScreen === "results" && <ResultsScreen />}
      {activeScreen === "progress" && <ProgressScreen />}
      {(activeScreen === "home" || activeScreen === "progress") && (
        <nav
          aria-label={t("Primary navigation")}
          className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-elevated/95 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-sm"
        >
          <div className="mx-auto grid max-w-sm grid-cols-4 gap-1">
            <NavButton
              label={t("Home")}
              active={activeScreen === "home" && tab === "home"}
              icon={House}
              tourTarget="home-tab"
              onClick={() => {
                selectTab("home");
                goHome();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
            <NavButton
              label={t("Practice")}
              active={activeScreen === "home" && tab === "practice"}
              icon={Dumbbell}
              tourTarget="practice-tab"
              onClick={() => {
                selectTab("practice");
                goHome();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
            <NavButton
              label={t("Progress")}
              active={activeScreen === "progress"}
              icon={ChartNoAxesColumn}
              tourTarget="progress-tab"
              onClick={() => {
                selectTab("progress");
                goProgress();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
            <NavButton
              label={t("League")}
              active={activeScreen === "home" && tab === "leaderboard"}
              icon={Trophy}
              tourTarget="league-tab"
              onClick={() => {
                selectTab("leaderboard");
                goHome();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        </nav>
      )}
      <OnboardingTour onSelectTab={guideToTab} />
    </main>
  );
}

function NavButton({
  label,
  active,
  icon: Icon,
  onClick,
  tourTarget,
}: {
  label: string;
  active: boolean;
  icon: typeof House;
  onClick: () => void;
  tourTarget: string;
}) {
  return (
    <button
      type="button"
      data-tour-target={tourTarget}
      aria-current={active ? "page" : undefined}
      onClick={onClick}
      className={cn(
        "flex min-h-14 flex-col items-center justify-center gap-1 rounded-[var(--radius-lg)] text-xs font-extrabold transition-[background-color,color,transform] duration-150 active:scale-[0.96]",
        active ? "bg-accent-soft text-accent-dark" : "text-muted hover:bg-accent-soft/60",
      )}
    >
      <Icon className="size-5" strokeWidth={active ? 2.5 : 2} />
      {label}
    </button>
  );
}
