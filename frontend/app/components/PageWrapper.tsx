import { motion, type HTMLMotionProps } from "motion/react";

interface PageWrapperProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
}

/**
 * PageWrapper provides consistent layout padding and base animations
 * for top-level route components.
 */
export function PageWrapper({ children, ...props }: PageWrapperProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="min-h-screen w-full flex flex-col"
      {...props}
    >
      {children}
    </motion.div>
  );
}
