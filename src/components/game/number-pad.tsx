import { Delete } from "lucide-react";
import { Button } from "@/components/ui/button";

const KEYS = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "back", "0", "enter"] as const;

interface NumberPadProps {
  disabled?: boolean;
  onDigit: (d: string) => void;
  onBack: () => void;
  onEnter: () => void;
}

export function NumberPad({ disabled, onDigit, onBack, onEnter }: NumberPadProps) {
  return (
    <div className="grid grid-cols-3 gap-2" role="group" aria-label="Number pad">
      {KEYS.map((key) => {
        if (key === "back") {
          return (
            <Button
              key={key}
              variant="pad"
              size="pad"
              disabled={disabled}
              aria-label="Backspace"
              onClick={onBack}
            >
              <Delete className="size-5" strokeWidth={1.75} />
            </Button>
          );
        }
        if (key === "enter") {
          return (
            <Button
              key={key}
              variant="enter"
              size="pad"
              disabled={disabled}
              aria-label="Submit answer"
              className="font-sans text-sm font-semibold tracking-wide"
              onClick={onEnter}
            >
              Enter
            </Button>
          );
        }
        return (
          <Button
            key={key}
            variant="pad"
            size="pad"
            disabled={disabled}
            onClick={() => onDigit(key)}
          >
            {key}
          </Button>
        );
      })}
    </div>
  );
}
