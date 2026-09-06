import { cva, type VariantProps } from "class-variance-authority";
import { type ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-extrabold select-none transition-[transform,background-color,color,box-shadow,filter,opacity] duration-150 ease-out focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-sky disabled:pointer-events-none disabled:bg-border disabled:text-subtle disabled:shadow-none disabled:opacity-70 active:not-disabled:translate-y-1",
  {
    variants: {
      variant: {
        primary:
          "bg-accent text-white shadow-[0_4px_0_var(--color-accent-dark)] hover:brightness-105 hover:-translate-y-px active:shadow-none",
        secondary:
          "bg-elevated text-fg shadow-[0_3px_0_var(--color-border),0_0_0_2px_var(--color-border)] hover:bg-accent-soft hover:text-accent-dark active:shadow-none",
        ghost: "text-muted hover:bg-accent-soft hover:text-accent-dark",
        pad: "bg-elevated text-fg font-display tabular-nums shadow-[0_3px_0_var(--color-border),0_0_0_2px_var(--color-border)] hover:bg-accent-soft hover:text-accent-dark active:shadow-none",
        enter:
          "bg-accent text-white shadow-[0_3px_0_var(--color-accent-dark)] hover:brightness-105 active:shadow-none",
      },
      size: {
        sm: "h-9 px-3 rounded-[var(--radius-sm)] text-sm",
        md: "h-11 px-4 rounded-[var(--radius-md)] text-sm",
        lg: "h-12 px-5 rounded-[var(--radius-md)] text-base",
        xl: "h-14 px-6 rounded-[var(--radius-lg)] text-base",
        pad: "h-14 rounded-[var(--radius-lg)] text-xl",
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
  extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

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
