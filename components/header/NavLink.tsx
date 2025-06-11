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
  return (
    <AppLink
      href={href}
      onClick={onClick}
      className={`text-[var(--header-link)] hover:text-[var(--header-link-active)] transition-colors ${className}`}
    >
      {children}
    </AppLink>
  );
}
