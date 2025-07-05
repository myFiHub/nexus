"use client";

import { useIsMobile } from "app/hooks/use-mobile";
import { cn } from "app/lib/utils";
import { ReduxProvider } from "app/store/Provider";
import { motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";
import { SidebarContent } from "./SidebarContent";
import { TriggerButton } from "./TriggerButton";

const Content = () => {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(isMobile ? false : true);
  const [hasBeenClicked, setHasBeenClicked] = useState(false);
  const triggerControls = useAnimation();

  // Check localStorage for previous mobile menu interaction
  useEffect(() => {
    if (isMobile && typeof window !== "undefined") {
      const mobileMenuClicked = localStorage.getItem("mobile-menu-clicked");
      if (mobileMenuClicked === "true") {
        setHasBeenClicked(true);
      }
    }
  }, [isMobile]);

  // Update CSS custom property for content pushing
  useEffect(() => {
    const root = document.documentElement;
    if (isMobile) {
      root.style.setProperty("--sidebar-width", "0px");
    } else {
      root.style.setProperty("--sidebar-width", isOpen ? "260px" : "70px");
    }
  }, [isOpen, isMobile]);

  // Trigger button pulse animation
  useEffect(() => {
    const pulseAnimation = async () => {
      await triggerControls.start({
        scale: [1, 1.2, 1],
        boxShadow: [
          "0 0 0 0 rgba(139, 92, 246, 0.7)",
          "0 0 0 10px rgba(139, 92, 246, 0)",
          "0 0 0 0 rgba(139, 92, 246, 0)",
        ],
        transition: { duration: 2, repeat: Infinity, repeatDelay: 3 },
      });
    };
    pulseAnimation();
  }, [triggerControls]);

  const toggle = () => {
    setIsOpen(!isOpen);
    // Mark as clicked on first mobile interaction and save to localStorage
    if (isMobile && !hasBeenClicked) {
      setHasBeenClicked(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("mobile-menu-clicked", "true");
      }
    }
  };

  return (
    <>
      {/* Mobile toggle button - positioned outside sidebar container */}
      {isMobile && (
        <TriggerButton
          isOpen={isOpen}
          onClick={toggle}
          controls={triggerControls}
          isMobile={isMobile}
          hasBeenClicked={hasBeenClicked}
        />
      )}

      <motion.div
        className={cn(
          "pt-16 bg-background border-r flex flex-col relative transition-all duration-300 ease-in-out",
          isMobile
            ? cn(
                "fixed inset-y-0 left-0 z-50 w-[260px]",
                isOpen ? "translate-x-0" : "-translate-x-full"
              )
            : cn(
                "fixed inset-y-0 left-0 z-40",
                isOpen ? "w-[260px]" : "w-[70px]"
              )
        )}
        initial={false}
        animate={{
          boxShadow: isOpen
            ? "0 0 50px rgba(0, 0, 0, 0.1)"
            : "0 0 20px rgba(0, 0, 0, 0.05)",
        }}
      >
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5 opacity-0"
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />

        {/* Desktop toggle button - stays in sidebar */}
        {!isMobile && (
          <TriggerButton
            isOpen={isOpen}
            onClick={toggle}
            controls={triggerControls}
            isMobile={isMobile}
          />
        )}

        <SidebarContent isOpen={isOpen} isMobile={isMobile} />
      </motion.div>
    </>
  );
};

export const Sidebar = () => {
  return (
    <ReduxProvider>
      <Content />
    </ReduxProvider>
  );
};
