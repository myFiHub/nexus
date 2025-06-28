"use client";

import {
  CookieKeys,
  getClientCookie,
  setClientCookie,
} from "app/lib/client-cookies";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../Button";

export const ThemeToggle = ({
  initialValue,
}: {
  initialValue: "light" | "dark";
}) => {
  const [theme, setTheme] = useState<"light" | "dark">(initialValue);

  useEffect(() => {
    const savedTheme = getClientCookie(CookieKeys.theme) as "light" | "dark";
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    setClientCookie(CookieKeys.theme, newTheme, { expires: 365 });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`relative`}
      onClick={toggleTheme}
      aria-label={`Theme`}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: theme === "dark" ? 180 : 0,
          scale: 1,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
        }}
      >
        {theme === "dark" ? (
          <Moon className="w-5 h-5 text-foreground" />
        ) : (
          <Sun className="w-5 h-5 text-foreground" />
        )}
      </motion.div>
    </Button>
  );
};
