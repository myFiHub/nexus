"use client";
import { searchDialog } from "app/components/Dialog";
import { GlobalSelectors } from "app/containers/global/selectors";
import { NotificationsBell } from "app/containers/notifications";
import { ReduxProvider } from "app/store/Provider";
import { Menu, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AppLink } from "../AppLink";
import { Button } from "../Button";
import { Img } from "../Img";
import { LoginButton } from "./LoginButton";
import { NavLink } from "./NavLink";
import { ThemeToggle } from "./themeToggle";

const navLinks = [
  { href: "/", label: "Home" },
  // { href: "/dashboard", label: "Dashboard" },
  { href: "/profile", label: "Profile" },
  { href: "/my_outposts", label: "My Outposts" },
  // { href: "/settings", label: "Settings" },
];

const Content = ({ theme }: { theme: "light" | "dark" }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const isLoggedIn = useSelector(GlobalSelectors.isLoggedIn);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setIsVisible(false);
      } else {
        // Scrolling up
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleSearchClick = async () => {
    await searchDialog({
      title: "Search Everything",
    });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-[var(--header-bg)] shadow-md transition-transform duration-300 ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="py-3 flex items-center justify-between">
          <div className="flex items-center ">
            <AppLink
              href="/"
              className="flex items-center gap-1 text-xl font-bold text-[var(--header-link-active)] hover:no-underline px-0"
            >
              <Img src="/logo.png" alt="Podium Nexus" className="w-6 h-6" />
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
          <div className="flex items-center gap-1">
            <ThemeToggle initialValue={theme} />

            <Button
              variant="ghost"
              size="sm"
              className={`relative`}
              onClick={handleSearchClick}
              aria-label={`Search`}
            >
              <Search className="w-5 h-5" />
            </Button>

            {isLoggedIn && <NotificationsBell />}
            <LoginButton />
          </div>
          {/* Mobile hamburger */}
          {isLoggedIn && (
            <div className="md:hidden flex items-center ">
              <button
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={
                  mobileOpen ? "Close mobile menu" : "Open mobile menu"
                }
                className="text-2xl text-[var(--header-link)] focus:outline-none"
              >
                {mobileOpen ? (
                  <X className="w-7 h-7" />
                ) : (
                  <Menu className="w-7 h-7" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      {/* Mobile menu */}
      {mobileOpen && (
        <div className="bg-[var(--header-bg)] shadow-md">
          <div className="max-w-7xl mx-auto px-4">
            <nav className="py-4">
              <button
                onClick={() => {
                  handleSearchClick();
                  setMobileOpen(false);
                }}
                className="flex items-center gap-2 w-full py-2 text-[var(--header-link)] hover:text-[var(--header-link-active)] transition-colors duration-200"
              >
                <Search className="w-5 h-5" />
                Search
              </button>
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
          </div>
        </div>
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
