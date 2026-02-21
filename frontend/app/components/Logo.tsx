import { motion } from "motion/react";
import { Svg } from "./SvgLogo";

export function ApplyFlowLogo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex items-center gap-2 sm:gap-3 md:gap-4"
    >
      <Svg />

      <motion.span
        className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-semibold tracking-tight text-[#155DFC]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        ApplyFlow
      </motion.span>
    </motion.div>
  );
}
