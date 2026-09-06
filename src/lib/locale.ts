export type Locale = "en" | "id";

export const LOCALE_STORAGE_KEY = "timesmith-locale";

export function resolveLocale(value: string | null | undefined): Locale {
  return value?.toLowerCase().startsWith("id") ? "id" : "en";
}
