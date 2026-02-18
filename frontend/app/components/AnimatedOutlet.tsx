import { AnimatePresence, motion } from "motion/react";
import { Outlet, useLocation } from "react-router";

/**
 * AnimatedOutlet provides a wrapper for the React Router Outlet.
 * It uses the current pathname as a key to trigger Motion transitions.
 */
export function AnimatedOutlet() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname}>
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}
