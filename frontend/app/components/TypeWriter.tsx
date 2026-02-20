import { useState, useEffect } from "react";
import { motion, AnimatePresence, type Variants } from "motion/react";

interface TypewriterProps {
  phrases: string[];
  variants?: Variants;
}

export function Typewriter({ phrases, variants }: TypewriterProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [phrases.length]);

return (
  <motion.span
    variants={variants}
    className="
      inline-flex
      items-center
      text-blue-600
      /* Set a min-width to prevent the 'Precision AI' part from moving */
      min-w-[240px] md:min-w-[350px] lg:min-w-[420px]
    "
  >
    {/* Phrase container: */}
    <span className="grid grid-cols-1 grid-rows-1">
      <AnimatePresence mode="wait">
        <motion.span
          key={phrases[index]}
          className="col-start-1 row-start-1 whitespace-nowrap"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {phrases[index]}
        </motion.span>
      </AnimatePresence>
    </span>

    {/* Blinking Cursor: */}
    <motion.span
      animate={{ opacity: [1, 0] }}
      transition={{ repeat: Infinity, duration: 0.8 }}
      className="ml-2 w-[4px] h-[0.8em] bg-blue-600 self-center"
    />
  </motion.span>
);
}
