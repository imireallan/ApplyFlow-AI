import { motion } from "motion/react";

export function ApplyFlowLogo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex items-center gap-2 sm:gap-3 md:gap-4"
    >
      <svg
        className="h-6 w-auto sm:h-7 md:h-8 lg:h-9 xl:h-10"
        viewBox="0 0 120 80"
      >
        {/* Animated Connections */}
        <motion.path
          d="M20 40L60 10L100 40L60 70Z"
          stroke="#155DFC"
          strokeWidth="3"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />

        {/* Pulsing Nodes */}
        {[
          { x: 20, y: 40 },
          { x: 60, y: 10 },
          { x: 100, y: 40 },
          { x: 60, y: 70 },
        ].map((node, i) => (
          <motion.circle
            key={i}
            cx={node.x}
            cy={node.y}
            r="6"
            fill="#155DFC"
            animate={{ scale: [1, 1.15, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </svg>

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
