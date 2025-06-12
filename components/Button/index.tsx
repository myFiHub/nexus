import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center cursor-pointer rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        primary: "primary",
        outline: "border bg-transparent",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3",
        lg: "h-12 px-6",
      },
      colorScheme: {
        primary: "bg-primary hover:bg-primary-hover text-white",
        danger: "bg-danger hover:bg-danger-hover text-white",
        warning: "bg-warning hover:bg-warning-hover text-white",
      },
    },
    compoundVariants: [
      // Default variant with color schemes
      {
        variant: "primary",
        colorScheme: ["primary", "danger", "warning"],
        className: "text-white",
      },
      // Outline variant with color schemes
      {
        variant: "outline",
        colorScheme: "primary",
        className:
          "border-primary text-primary hover:bg-primary hover:text-white",
      },
      {
        variant: "outline",
        colorScheme: "danger",
        className: "border-danger text-danger hover:bg-danger hover:text-white",
      },
      {
        variant: "outline",
        colorScheme: "warning",
        className:
          "border-warning text-warning hover:bg-warning hover:text-white",
      },
      // Ensure text is white for all color schemes
      {
        colorScheme: ["primary", "danger", "warning"],
        className: "text-white",
      },
    ],
    defaultVariants: {
      colorScheme: "primary",
      variant: "primary",
      size: "default",
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
