"use client";
import { usePathname } from "next/navigation";
import { AppLink } from "../AppLink";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function NavLink({
  href,
  children,
  onClick,
  className = "",
}: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <AppLink
      href={href}
      onClick={onClick}
      className={`text-[var(--header-link)] hover:text-[var(--header-link-active)] transition-colors ${
        isActive ? "text-[var(--header-link-active)] font-medium" : ""
      } ${className}`}
    >
      {children}
    </AppLink>
  );
}
