"use client";
import { searchDialog } from "app/components/Dialog";
import { GlobalSelectors } from "app/containers/global/selectors";
import { NotificationsBell } from "app/containers/notifications";
import { AnimatePresence, motion } from "framer-motion";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { AppLink } from "../AppLink";
import { Button } from "../Button";
import { Img } from "../Img";
import { LoginButton } from "./LoginButton";
import { ThemeToggle } from "./themeToggle";

const Content = () => {
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const isLoggedIn = !!useSelector(GlobalSelectors.podiumUserInfo);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      const delta = y - lastScrollY.current;
      if (y < 64) setIsVisible(true);
      else if (Math.abs(delta) > 8) setIsVisible(delta < 0);
      else return;
      lastScrollY.current = y;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearchClick = async () => {
    await searchDialog({
      title: "Search Everything",
    });
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 bg-[var(--header-bg)] backdrop-blur-xl border-b border-border/60 transition-transform duration-300 ${
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
              <Img
                src="/logo.png"
                alt="Podium Nexus"
                className="w-6 h-6"
                sizes="24px"
              />
              <span className="hidden lg:block">Podium Nexus</span>
            </AppLink>
          </div>
          {/* Desktop nav */}

          <div className="flex items-center gap-1">
            <ThemeToggle />

            <Button
              variant="ghost"
              size="sm"
              className={`relative`}
              onClick={handleSearchClick}
              aria-label={`Search`}
            >
              <Search className="w-5 h-5" />
            </Button>
            <AnimatePresence>
              {isLoggedIn && (
                <motion.div
                  initial={{ opacity: 0, x: 20, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: "auto" }}
                  exit={{ opacity: 0, x: 20, width: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  style={{ overflow: "hidden" }}
                >
                  <NotificationsBell />
                </motion.div>
              )}
            </AnimatePresence>
            <div className="w-1" />
            <LoginButton fancy />
          </div>
          {/* Mobile hamburger */}
        </div>
      </div>
    </header>
  );
};

export default function Header() {
  return <Content />;
}
