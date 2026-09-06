import { cn } from "@/lib/utils";

/** Flat stopwatch monogram used anywhere the Timesmith brand appears. */
export function TimesmithMark({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 48 48"
      fill="none"
      className={cn("shrink-0 text-accent", className)}
    >
      <path
        d="M17 8h14M24 8v5M14.5 16.5 10.8 12.8M33.5 16.5l3.7-3.7"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="24" cy="28" r="14" stroke="currentColor" strokeWidth="4" />
      <path d="M24 20v9l6 4" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
