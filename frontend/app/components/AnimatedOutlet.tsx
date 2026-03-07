import { AnimatePresence, motion } from "motion/react";
import { Outlet, useLocation, useOutletContext } from "react-router";

/**
 * AnimatedOutlet provides a wrapper for the React Router Outlet.
 * It uses the current pathname as a key to trigger Motion transitions.
 *
 * @param context - Optional context to pass to child routes
 */
export function AnimatedOutlet({
  context,
}: { context?: Record<string, any> } = {}) {
  const location = useLocation();
  const parentContext = useOutletContext<Record<string, any>>();

  // Merge parent context with provided context
  const mergedContext = { ...(parentContext || {}), ...(context || {}) };

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname}>
        <Outlet context={mergedContext} />
      </motion.div>
    </AnimatePresence>
  );
}
