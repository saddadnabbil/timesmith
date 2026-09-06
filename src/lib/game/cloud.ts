import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { validateProgressSnapshot } from "./progress-snapshot";
import type { SaveData, Subject } from "./types";

type LeaderboardInput = { subject: Subject; mode: "sprint" | "streak" | "practice" };
type RunInput = LeaderboardInput & {
  ticketId: string;
  displayName: string;
  score: number;
  accuracy: number;
  durationMs: number;
};

export const startRankedRun = createServerFn({ method: "POST" })
  .validator(leaderboardInput)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const id = crypto.randomUUID();
    await sql`
      insert into timesmith_run_tickets (id, user_id, subject, mode)
      values (${id}, ${context.userId}, ${data.subject}, ${data.mode})
    `;
    return { ticketId: id };
  });

function leaderboardInput(input: LeaderboardInput): LeaderboardInput {
  if (!input || !["arithmetic", "algebra"].includes(input.subject))
    throw new Error("Invalid subject");
  if (!input || !["sprint", "streak", "practice"].includes(input.mode))
    throw new Error("Invalid mode");
  return input;
}

export const getLeaderboard = createServerFn({ method: "GET" })
  .validator(leaderboardInput)
  .handler(async ({ data }) => {
    const sql = await getSql();
    return sql<{
      rank: number;
      displayName: string;
      score: number;
      accuracy: number;
      subject: Subject;
      mode: string;
    }>`
      select row_number() over (order by score desc, accuracy desc, duration_ms asc)::int as rank,
             display_name as "displayName", score, accuracy, subject, mode
      from timesmith_runs
      where week_start = (date_trunc('week', current_timestamp at time zone 'UTC'))::date
        and subject = ${data.subject}
        and mode = ${data.mode}
      order by score desc, accuracy desc, duration_ms asc
      limit 50
    `;
  });

export const submitRun = createServerFn({ method: "POST" })
  .validator((input: RunInput) => {
    leaderboardInput(input);
    if (!/^[0-9a-f-]{36}$/i.test(input.ticketId)) throw new Error("Invalid run ticket");
    const displayName = input.displayName.trim().replace(/\s+/g, " ").slice(0, 24);
    const score = Math.round(input.score);
    const accuracy = Math.round(input.accuracy);
    const durationMs = Math.round(input.durationMs);
    if (!displayName || score < 0 || score > 250000) throw new Error("Invalid score");
    if (accuracy < 0 || accuracy > 100) throw new Error("Invalid accuracy");
    if (durationMs < 1000 || durationMs > 3600000) throw new Error("Invalid duration");
    if (input.mode === "sprint" && (durationMs < 55000 || durationMs > 90000))
      throw new Error("Invalid sprint duration");
    if (input.mode === "sprint" && score > 150000) throw new Error("Invalid sprint score");
    if (input.mode === "practice" && (durationMs < 5000 || score > 20000))
      throw new Error("Invalid practice run");
    return { ...input, displayName, score, accuracy, durationMs };
  })
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const id = crypto.randomUUID();
    const inserted = await sql<{ id: string }>`
      with claimed as (
        update timesmith_run_tickets
        set used_at = now()
        where id = ${data.ticketId}
          and user_id = ${context.userId}
          and subject = ${data.subject}
          and mode = ${data.mode}
          and used_at is null
          and started_at > now() - interval '2 hours'
        returning id
      )
      insert into timesmith_runs
        (id, user_id, display_name, subject, mode, score, accuracy, duration_ms)
      select ${id}, ${context.userId}, ${data.displayName}, ${data.subject}, ${data.mode},
             ${data.score}, ${data.accuracy}, ${data.durationMs}
      from claimed
      returning id
    `;
    if (inserted.length === 0) throw new Error("Run ticket is missing, expired, or already used");
    return { ok: true };
  });

export const saveCloudProgress = createServerFn({ method: "POST" })
  .validator(validateProgressSnapshot)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      insert into timesmith_progress (user_id, save_json, updated_at)
      values (${context.userId}, ${JSON.stringify(data)}::jsonb, now())
      on conflict (user_id) do update
      set save_json = excluded.save_json, updated_at = excluded.updated_at
      where timesmith_progress.user_id = ${context.userId}
    `;
    return { ok: true };
  });

export const loadCloudProgress = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{ save: SaveData }>`
      select save_json as save from timesmith_progress where user_id = ${context.userId} limit 1
    `;
    return rows[0]?.save ?? null;
  });
