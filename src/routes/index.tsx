import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { GameApp } from "@/components/game/app";

const tabSchema = z.enum(["home", "practice", "progress", "leaderboard"]);

export const Route = createFileRoute("/")({
  validateSearch: z.object({ tab: tabSchema.optional() }),
  component: Home,
});

function Home() {
  const { tab = "home" } = Route.useSearch();
  return <GameApp initialTab={tab} />;
}
