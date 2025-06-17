"use client";
import { GlobalSelectors } from "app/containers/global/selectors";
import { ReduxProvider } from "app/store/Provider";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { AppLink } from "../AppLink";
import { LoginButton } from "./LoginButton";
import { NavLink } from "./NavLink";
import { ThemeToggle } from "./themeToggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profile", label: "Profile" },
  // { href: "/settings", label: "Settings" },
];

const Content = ({ theme }: { theme: "light" | "dark" }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLoggedIn = useSelector(GlobalSelectors.isLoggedIn);
  return (
    <header className="w-full bg-[var(--header-bg)] px-6 py-3 flex items-center justify-between shadow-md relative">
      <div className="flex items-center gap-2">
        <AppLink
          href="/"
          className="flex items-center gap-2 text-xl font-bold text-[var(--header-link-active)] hover:no-underline"
        >
          Podium Nexus
        </AppLink>
      </div>
      {/* Desktop nav */}
      <nav className="hidden md:flex gap-8 items-center">
        {isLoggedIn &&
          navLinks.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}
      </nav>
      <div className="flex items-center gap-4">
        <ThemeToggle initialValue={theme} />
        <LoginButton />
      </div>
      {/* Mobile hamburger */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close mobile menu" : "Open mobile menu"}
          className="text-2xl text-[var(--header-link)] focus:outline-none"
        >
          {mobileOpen ? (
            <X className="w-7 h-7" />
          ) : (
            <Menu className="w-7 h-7" />
          )}
        </button>
      </div>
      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="md:hidden absolute top-full left-0 right-0 bg-[var(--header-bg)] p-4 shadow-md">
          {isLoggedIn &&
            navLinks.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                className="block py-2"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
        </nav>
      )}
    </header>
  );
};

export default function Header({ theme }: { theme: "light" | "dark" }) {
  return (
    <ReduxProvider>
      <Content theme={theme} />
    </ReduxProvider>
  );
}
