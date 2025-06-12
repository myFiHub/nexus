import { cva, type VariantProps } from "class-variance-authority";
import Link, { LinkProps } from "next/link";
import * as React from "react";
import { cn } from "../../lib/utils";

const appLinkVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "text-white font-medium bg-transparent border-none shadow-none rounded-none",
        outline:
          "border border-primary text-primary bg-transparent hover:bg-primary-hover",
      },
      underline: {
        true: "hover:underline",
        false: "no-underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3",
        lg: "h-12 px-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      underline: true,
    },
  }
);

export interface AppLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof appLinkVariants> {
  href: string;
  linkProps?: Omit<LinkProps, "href">;
}

const AppLink = React.forwardRef<HTMLAnchorElement, AppLinkProps>(
  ({ className, variant, size, href, linkProps, underline, ...props }, ref) => {
    return (
      <Link
        href={href}
        className={cn(appLinkVariants({ variant, size, className, underline }))}
        ref={ref}
        {...linkProps}
        {...props}
      />
    );
  }
);
AppLink.displayName = "AppLink";

export { AppLink, appLinkVariants };
