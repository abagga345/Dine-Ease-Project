import { useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Resets the window scroll position to the top on every route change.
 *
 * React Router keeps the previous scroll offset when navigating, which on a
 * long page (or on mobile) drops the user straight into the footer of the new
 * page. We scroll instantly — not smoothly — so the new page always opens at
 * the top with no visible slide.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
}
