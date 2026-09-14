import { useState } from "react";
import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { ArrowLeft, Cloud, RefreshCw, ShieldCheck, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { TimesmithMark } from "@/components/timesmith-mark";
import { AUTH_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  // Already signed in — don't show the sign-in form (this route isn't
  // guarded elsewhere; a signed-in visitor can still navigate here directly).
  // Wait out `isPending` first: bouncing on `user: null` alone would redirect
  // a signed-in visitor away on every hard reload, before the session
  // finishes resolving.
  if (isPending) return null;
  if (user) return <Navigate to="/" />;

  return (
    <main className="min-h-dvh bg-bg px-5 py-6 text-fg sm:grid sm:place-items-center sm:py-10">
      <div className="mx-auto w-full max-w-sm">
        <header className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3" aria-label="Timesmith home">
            <TimesmithMark className="size-10" />
            <span>
              <span className="block text-xs font-extrabold tracking-[0.14em] text-accent-dark uppercase">
                Timesmith
              </span>
              <span className="block text-sm font-extrabold">Cloud forge</span>
            </span>
          </Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Link
              to="/"
              className="inline-flex min-h-11 items-center gap-1.5 rounded-[var(--radius-md)] px-2 text-xs font-extrabold text-muted hover:bg-accent-soft hover:text-accent-dark"
            >
              <ArrowLeft className="size-4" /> Guest mode
            </Link>
          </div>
        </header>

        <section className="forge-card relative mt-7 overflow-hidden rounded-[var(--radius-xl)] p-5 sm:p-7">
          <div className="pointer-events-none absolute -top-3 -right-4 size-28 rounded-full bg-accent-soft/70">
            <img src="/pip-blue.png" alt="" className="h-full w-full object-contain" />
          </div>
          <span className="flex size-11 items-center justify-center rounded-[var(--radius-lg)] bg-accent-soft text-accent-dark">
            <Cloud className="size-5" />
          </span>
          <h1 className="font-display mt-5 max-w-52 text-3xl font-black">Keep your progress</h1>
          <p className="mt-2 max-w-xs text-sm font-semibold text-muted">
            Guest play is always available. Sign in only when you want your forge on every device.
          </p>

          <ul className="mt-5 grid grid-cols-2 gap-2 text-xs font-extrabold">
            <li className="flex min-h-16 flex-col justify-between rounded-[var(--radius-lg)] bg-accent-soft p-3 text-accent-dark">
              <RefreshCw className="size-4" /> Sync mastery
            </li>
            <li className="flex min-h-16 flex-col justify-between rounded-[var(--radius-lg)] border-2 border-border bg-elevated p-3 text-fg">
              <Trophy className="size-4 text-warning" /> Verified scores
            </li>
          </ul>

          <div className="mt-5 space-y-3">
            {authEnabled ? (
              AUTH_PROVIDERS.map((provider) => (
                <Button
                  key={provider.providerId}
                  variant="secondary"
                  size="lg"
                  className="w-full"
                  disabled={pending !== null}
                  onClick={() => {
                    setError(null);
                    setPending(provider.providerId);
                    void signIn(provider.providerId, { callbackURL: "/" }).catch((reason) => {
                      setPending(null);
                      setError(reason instanceof Error ? reason.message : "Sign-in failed");
                    });
                  }}
                >
                  <img src="/google-g.svg" alt="" aria-hidden="true" className="size-5" />
                  {pending === provider.providerId
                    ? "Connecting…"
                    : `Continue with ${provider.label}`}
                </Button>
              ))
            ) : (
              <p className="text-sm text-muted">Sign-in is unavailable in this build.</p>
            )}
          </div>
          {error && (
            <p role="alert" className="mt-4 text-sm font-bold text-danger">
              {error}
            </p>
          )}
          <div className="mt-5 flex gap-3 border-t border-border pt-4 text-xs font-semibold text-muted">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent" />
            Private by default. Your email never appears on the leaderboard.
          </div>
        </section>
        <p className="mt-5 text-center text-xs font-semibold text-muted">
          You can disconnect anytime and keep playing locally.
        </p>
        <nav
          aria-label="Legal"
          className="mt-3 flex justify-center gap-5 text-xs font-bold text-muted"
        >
          <Link to="/privacy" className="hover:text-accent-dark">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-accent-dark">
            Terms
          </Link>
        </nav>
      </div>
    </main>
  );
}
