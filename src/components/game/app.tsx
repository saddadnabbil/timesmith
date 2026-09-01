import { useEffect } from "react";
import { HomeScreen } from "@/components/game/home";
import { PlayScreen } from "@/components/game/play";
import { ProgressScreen } from "@/components/game/progress";
import { ResultsScreen } from "@/components/game/results";
import { writeSave } from "@/lib/game/save";
import { useGame } from "@/lib/game/store";

export function GameApp() {
  const screen = useGame((s) => s.screen);
  const hydrate = useGame((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

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

  return (
    <main className="min-h-dvh bg-bg text-fg">
      {screen === "home" && <HomeScreen />}
      {screen === "play" && <PlayScreen />}
      {screen === "results" && <ResultsScreen />}
      {screen === "progress" && <ProgressScreen />}
    </main>
  );
}
