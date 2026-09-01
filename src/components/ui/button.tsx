import { cva, type VariantProps } from "class-variance-authority";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium select-none transition-[transform,background-color,color,box-shadow,opacity] duration-150 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96]",
  {
    variants: {
      variant: {
        primary: "bg-fg text-bg hover:bg-accent",
        secondary:
          "bg-elevated text-fg shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
        ghost: "text-muted hover:bg-elevated hover:text-fg",
        pad: "bg-elevated text-fg font-display tabular-nums shadow-[var(--shadow-border)] hover:shadow-[var(--shadow-border-hover)]",
        enter: "bg-fg text-bg hover:bg-accent",
      },
      size: {
        sm: "h-9 px-3 rounded-[var(--radius-sm)] text-sm",
        md: "h-11 px-4 rounded-[var(--radius-md)] text-sm",
        lg: "h-12 px-5 rounded-[var(--radius-md)] text-base",
        xl: "h-14 px-6 rounded-[var(--radius-lg)] text-base",
        pad: "h-14 rounded-[var(--radius-md)] text-xl",
        icon: "size-11 rounded-[var(--radius-md)]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
