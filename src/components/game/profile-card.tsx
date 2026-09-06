import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Cloud, CloudDownload, CloudUpload, HardDrive, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { loadCloudProgress, saveCloudProgress } from "@/lib/game/cloud";
import { GUEST_PROFILE_NAME } from "@/lib/game/save";
import { useGame } from "@/lib/game/store";
import { useI18n } from "@/lib/i18n";

export function ProfileCard() {
  const { t } = useI18n();
  const save = useGame((state) => state.save);
  const setProfileName = useGame((state) => state.setProfileName);
  const replaceSave = useGame((state) => state.replaceSave);
  const { user, isPending } = useCurrentUserState();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(save.profile.name);
  const [status, setStatus] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  async function sync(direction: "up" | "down") {
    setSyncing(true);
    setStatus(null);
    try {
      if (direction === "up") {
        await saveCloudProgress({ data: save });
        setStatus(t("Progress saved to your account."));
      } else {
        const cloud = await loadCloudProgress();
        if (cloud) {
          replaceSave(cloud);
          setName(cloud.profile.name);
          setStatus(t("Cloud progress restored."));
        } else {
          setStatus(t("No cloud save yet."));
        }
      }
    } catch {
      setStatus(t("Sync failed. Please try again."));
    } finally {
      setSyncing(false);
    }
  }

  // The leaderboard handle (`save.profile.name`) is a separate, editable game
  // handle — but a fresh guest save must not keep showing "Guest Smith" once
  // signed in, so seed it from the Google name the first time a session
  // appears on top of an untouched guest save.
  useEffect(() => {
    if (user?.displayName && save.profile.name === GUEST_PROFILE_NAME) {
      setProfileName(user.displayName);
      setName(user.displayName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to sign-in, not every save/name edit
  }, [user?.displayName]);

  return (
    <section>
      <div className="flex flex-col items-center text-center">
        {user?.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt=""
            className="size-16 shrink-0 rounded-[var(--radius-xl)] border-2 border-white object-cover shadow-md"
          />
        ) : (
          <span
            className="flex size-16 shrink-0 items-center justify-center rounded-[var(--radius-xl)] font-display text-2xl font-black text-white shadow-[0_4px_0_var(--color-accent-dark)]"
            style={{ backgroundColor: save.profile.color }}
            aria-hidden="true"
          >
            {save.profile.name.charAt(0).toUpperCase()}
          </span>
        )}
        <div className="mt-4 min-w-0 w-full">
          <p className="text-xs font-extrabold tracking-[0.12em] text-accent-dark uppercase">
            {user ? t("Cloud smith") : t("Guest smith")}
          </p>
          {editing ? (
            <form
              className="mx-auto mt-2 flex max-w-xs gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                setProfileName(name);
                setEditing(false);
              }}
            >
              <label className="sr-only" htmlFor="display-name">
                {t("Display name")}
              </label>
              <input
                id="display-name"
                value={name}
                maxLength={24}
                autoFocus
                onChange={(event) => setName(event.target.value)}
                className="min-w-0 flex-1 rounded-[var(--radius-md)] border-2 border-border bg-bg px-3 py-2 text-sm font-bold outline-none focus:border-accent"
              />
              <Button size="sm" type="submit">
                {t("Save")}
              </Button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="mx-auto mt-1 flex max-w-full items-center justify-center gap-2 text-center"
            >
              <span className="truncate font-display text-2xl font-black">{save.profile.name}</span>
              <Pencil className="size-3.5 shrink-0 text-muted" />
            </button>
          )}
        </div>
      </div>

      {isPending ? (
        <div className="mt-6 h-24 animate-pulse rounded-[var(--radius-lg)] bg-border" />
      ) : user ? (
        <div className="mt-6 space-y-3">
          <div className="overflow-hidden text-xs text-muted">
            <UserButton />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              size="sm"
              disabled={syncing}
              onClick={() => void sync("up")}
            >
              <CloudUpload className="size-4" /> {t("Save")}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={syncing}
              onClick={() => void sync("down")}
            >
              <CloudDownload className="size-4" /> {t("Restore")}
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <div className="flex items-start gap-3 rounded-[var(--radius-lg)] bg-accent-soft px-4 py-3 text-left">
            <HardDrive className="mt-0.5 size-5 shrink-0 text-accent-dark" />
            <div>
              <p className="text-sm font-extrabold text-fg">{t("Saved on this device")}</p>
              <p className="mt-0.5 text-xs font-semibold leading-relaxed text-muted">
                {t("Keep playing as a guest, or connect to protect your progress.")}
              </p>
            </div>
          </div>
          <Link
            to="/login"
            className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-[var(--radius-md)] bg-accent px-4 text-sm font-extrabold text-white shadow-[0_4px_0_var(--color-accent-dark)] transition-[transform,filter,box-shadow] hover:brightness-105 active:translate-y-1 active:shadow-none"
          >
            <Cloud className="size-4" /> {t("Save across devices")}
          </Link>
        </div>
      )}
      <div className="mt-5 flex min-h-14 items-center justify-between border-t border-border pt-4">
        <div>
          <p className="text-sm font-extrabold text-fg">{t("Appearance")}</p>
          <p className="mt-0.5 text-xs font-semibold text-muted">{t("Choose light or dark mode")}</p>
        </div>
        <ThemeToggle />
      </div>
      {status && (
        <p role="status" className="mt-4 text-center text-xs font-bold text-accent-dark">
          {status}
        </p>
      )}
    </section>
  );
}
