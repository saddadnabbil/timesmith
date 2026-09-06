import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Languages } from "lucide-react";
import { useI18n, type Locale } from "@/lib/i18n";

const OPTIONS: Array<{ value: Locale; code: string; label: string }> = [
  { value: "id", code: "ID", label: "Bahasa Indonesia" },
  { value: "en", code: "EN", label: "English" },
];

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          aria-label={t("Change language")}
          className="flex min-h-11 items-center gap-1.5 rounded-[var(--radius-md)] px-2.5 text-sm font-extrabold text-muted transition-[background-color,color,transform] duration-150 hover:bg-accent-soft hover:text-accent-dark active:scale-[0.96] data-[state=open]:bg-accent-soft data-[state=open]:text-accent-dark"
        >
          <Languages className="size-5" strokeWidth={2.25} />
          <span className="text-xs tracking-wide">{locale.toUpperCase()}</span>
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={8}
          align="end"
          collisionPadding={12}
          className="z-[120] w-56 rounded-[var(--radius-lg)] bg-elevated p-1.5 text-fg shadow-[var(--shadow-paper)] outline-none data-[state=open]:anim-pop"
        >
          <DropdownMenu.Label className="px-3 py-2 text-xs font-extrabold tracking-wide text-subtle uppercase">
            {t("Language")}
          </DropdownMenu.Label>
          <DropdownMenu.RadioGroup value={locale} onValueChange={(value) => setLocale(value as Locale)}>
            {OPTIONS.map((option) => (
              <DropdownMenu.RadioItem
                key={option.value}
                value={option.value}
                className="flex min-h-11 select-none items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 text-sm font-extrabold text-muted outline-none transition-colors focus:bg-accent-soft focus:text-accent-dark data-[state=checked]:bg-accent-soft data-[state=checked]:text-accent-dark"
              >
                <span className="flex-1">{option.label}</span>
                <span className="rounded-md bg-bg px-2 py-1 text-xs font-black tracking-wide text-subtle group-data-[state=checked]:text-accent-dark">
                  {option.code}
                </span>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
