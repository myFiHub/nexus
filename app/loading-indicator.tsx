"use client";
import { clearRoutingEventBusId } from "app/components/listeners/loading/eventBus";
import { usePathname, useSearchParams } from "next/navigation";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { useEffect, useRef } from "react";

// Custom CSS for magenta color
const customStyles = `
  #nprogress .bar {
    background: magenta !important;
  }
  #nprogress .peg {
    box-shadow: 0 0 10px magenta, 0 0 5px magenta !important;
  }
`;

export default function LoadingIndicator() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isNavigating = useRef(false);
  const navigationStartTime = useRef<number | null>(null);
  const navigationTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Inject custom styles
    const styleElement = document.createElement("style");
    styleElement.textContent = customStyles;
    styleElement.setAttribute("data-nprogress-custom", "true");
    document.head.appendChild(styleElement);

    // Configure NProgress
    NProgress.configure({
      showSpinner: false,
      minimum: 0.1,
      easing: "ease",
      speed: 500,
      trickleSpeed: 200,
    });

    // Start progress when navigation begins
    const handleStart = () => {
      if (!isNavigating.current) {
        isNavigating.current = true;
        navigationStartTime.current = Date.now();
        NProgress.start();

        // Fallback timeout to prevent endless loading
        navigationTimeout.current = setTimeout(() => {
          if (isNavigating.current) {
            NProgress.done();
            isNavigating.current = false;
            navigationStartTime.current = null;
          }
        }, 3000); // 3 second fallback
      }
    };

    // Complete progress when navigation ends
    const handleComplete = () => {
      clearRoutingEventBusId();
      if (isNavigating.current) {
        // Clear the fallback timeout
        if (navigationTimeout.current) {
          clearTimeout(navigationTimeout.current);
          navigationTimeout.current = null;
        }

        // Ensure minimum display time for better UX
        const elapsed = Date.now() - (navigationStartTime.current || 0);
        const minDisplayTime = 300; // 300ms minimum

        if (elapsed < minDisplayTime) {
          setTimeout(() => {
            NProgress.done();
            isNavigating.current = false;
            navigationStartTime.current = null;
          }, minDisplayTime - elapsed);
        } else {
          NProgress.done();
          isNavigating.current = false;
          navigationStartTime.current = null;
        }
      }
    };

    // Listen for beforeunload (page refresh/close)
    const handleBeforeUnload = () => {
      handleStart();
    };

    // Add event listeners
    if (typeof window !== "undefined") {
      window.addEventListener("beforeunload", handleBeforeUnload);

      // Listen for click events on links to detect navigation start
      const handleLinkClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const link = target.closest("a");

        if (
          link &&
          link.href &&
          link.href.startsWith(window.location.origin) &&
          !link.target &&
          !e.ctrlKey &&
          !e.metaKey &&
          !e.shiftKey
        ) {
          // Check if we're navigating to the same page
          const currentUrl = window.location.pathname + window.location.search;
          const targetUrl =
            new URL(link.href).pathname + new URL(link.href).search;

          if (currentUrl === targetUrl) {
            // Same page navigation - complete immediately
            handleStart();
            setTimeout(() => {
              handleComplete();
            }, 100);
          } else {
            handleStart();
          }
        }
      };

      // Listen for programmatic navigation (router.push, router.replace)
      const originalPushState = history.pushState;
      const originalReplaceState = history.replaceState;

      history.pushState = function (...args) {
        handleStart();
        return originalPushState.apply(this, args);
      };

      history.replaceState = function (...args) {
        handleStart();
        return originalReplaceState.apply(this, args);
      };

      document.addEventListener("click", handleLinkClick);

      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
        document.removeEventListener("click", handleLinkClick);

        // Clear any pending timeouts
        if (navigationTimeout.current) {
          clearTimeout(navigationTimeout.current);
        }

        // Remove custom styles
        const styleElement = document.querySelector(
          "style[data-nprogress-custom]"
        );
        if (styleElement) {
          styleElement.remove();
        }

        // Restore original history methods
        history.pushState = originalPushState;
        history.replaceState = originalReplaceState;

        NProgress.done();
      };
    }
  }, []);

  // Handle pathname and search params changes (for App Router)
  useEffect(() => {
    // If we were navigating, complete the progress
    if (isNavigating.current) {
      // Clear the fallback timeout
      if (navigationTimeout.current) {
        clearTimeout(navigationTimeout.current);
        navigationTimeout.current = null;
      }

      // Ensure minimum display time for better UX
      const elapsed = Date.now() - (navigationStartTime.current || 0);
      const minDisplayTime = 300; // 300ms minimum

      if (elapsed < minDisplayTime) {
        setTimeout(() => {
          NProgress.done();
          isNavigating.current = false;
          navigationStartTime.current = null;
        }, minDisplayTime - elapsed);
      } else {
        NProgress.done();
        isNavigating.current = false;
        navigationStartTime.current = null;
      }
    }
  }, [pathname, searchParams]);

  return null;
}
