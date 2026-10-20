import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center cursor-pointer rounded-[14px] text-sm font-semibold transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:pointer-events-none ring-offset-background relative overflow-hidden group ",
  {
    variants: {
      variant: {
        primary:
          "bg-grad-primary text-[var(--p-on-accent)] shadow-[0_6px_22px_-8px_color-mix(in_oklab,var(--p-accent)_60%,transparent)] hover:brightness-110 hover:scale-[1.02] active:scale-[0.97] disabled:opacity-50 disabled:hover:scale-100 disabled:hover:brightness-100",
        outline:
          "border-2 border-primary/30 bg-background/50 backdrop-blur-sm text-foreground hover:bg-primary/10 hover:border-primary/50 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100",
        ghost:
          "bg-transparent text-foreground hover:bg-accent/50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100",
        secondary:
          "bg-secondary text-foreground border border-border hover:bg-surface-raised hover:border-border-strong hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100",
        destructive:
          "bg-destructive text-white shadow-[0_6px_22px_-8px_color-mix(in_oklab,var(--p-danger)_60%,transparent)] hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100",
      },
      size: {
        xxs: "h-6 px-2 text-xs",
        xs: "h-7 px-2.5 text-xs",
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 py-2 text-sm",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
      },
      noScale: {
        true: "hover:scale-100 active:scale-100",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      noScale: false,
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  noScale?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, noScale, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, noScale, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
