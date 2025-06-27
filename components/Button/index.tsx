import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center cursor-pointer rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        primary: "primary",
        outline: "border bg-transparent",
        ghost: "bg-transparent hover:bg-transparent",
      },
      size: {
        xxs: "h-6 px-2 text-xs",
        xs: "h-7 px-2.5 text-xs",
        sm: "h-8 px-3",
        md: "h-10 px-4 py-2",
        lg: "h-12 px-6",
      },
      colorScheme: {
        primary: "text-white",
        danger: "text-white",
        warning: "text-white",
      },
    },
    compoundVariants: [
      // Default variant with color schemes
      {
        variant: "primary",
        colorScheme: "primary",
        className:
          "bg-primary hover:bg-primary-hover text-white disabled:bg-muted disabled:text-muted-foreground",
      },
      {
        variant: "primary",
        colorScheme: "danger",
        className:
          "bg-danger hover:bg-danger-hover text-white disabled:bg-muted disabled:text-muted-foreground",
      },
      {
        variant: "primary",
        colorScheme: "warning",
        className:
          "bg-warning hover:bg-warning-hover text-white disabled:bg-muted disabled:text-muted-foreground",
      },
      // Outline variant with color schemes
      {
        variant: "outline",
        colorScheme: "primary",
        className:
          "border-primary text-primary hover:bg-primary hover:text-white disabled:border-muted disabled:text-muted-foreground disabled:hover:bg-transparent",
      },
      {
        variant: "outline",
        colorScheme: "danger",
        className:
          "border-danger text-danger hover:bg-danger hover:text-white disabled:border-muted disabled:text-muted-foreground disabled:hover:bg-transparent",
      },
      {
        variant: "outline",
        colorScheme: "warning",
        className:
          "border-warning text-warning hover:bg-warning hover:text-white disabled:border-muted disabled:text-muted-foreground disabled:hover:bg-transparent",
      },
      // Ghost variant with color schemes
      {
        variant: "ghost",
        colorScheme: "primary",
        className:
          "text-primary hover:bg-primary/10 disabled:text-muted-foreground disabled:hover:bg-transparent",
      },
      {
        variant: "ghost",
        colorScheme: "danger",
        className:
          "text-danger hover:bg-danger/10 disabled:text-muted-foreground disabled:hover:bg-transparent",
      },
      {
        variant: "ghost",
        colorScheme: "warning",
        className:
          "text-warning hover:bg-warning/10 disabled:text-muted-foreground disabled:hover:bg-transparent",
      },
    ],
    defaultVariants: {
      colorScheme: "primary",
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, colorScheme, ...props }, ref) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant, size, className, colorScheme })
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
