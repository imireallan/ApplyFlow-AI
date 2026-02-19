import { useEffect } from "react";
import { useMotionValue } from "motion/react";

/**
 * @hook useMousePosition
 * @description Tracks global mouse coordinates and transforms them into a normalized motion-ready format.
 * * @returns {Object} An object containing:
 * - x: MotionValue<number> (Range: -1 to 1)
 * - y: MotionValue<number> (Range: -1 to 1)
 * * @normalization_logic
 * Instead of raw pixel values, this hook calculates the cursor's position relative to the viewport center:
 * - Left/Top: -1
 * - Center: 0
 * - Right/Bottom: 1
 * * @performance_optimization
 * Uses `useMotionValue` to bypass the React render cycle. Updates occur directly in the 
 * Framer Motion engine, ensuring 120fps performance for parallax effects without 
 * triggering component re-renders.
 * * @example
 * const { x, y } = useMousePosition();
 * const opacity = useTransform(x, [-1, 1], [0, 1]);
 */
export function useMousePosition() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalizing to -1 to 1 range
      const nextX = (e.clientX / window.innerWidth) * 2 - 1;
      const nextY = (e.clientY / window.innerHeight) * 2 - 1;
      
      x.set(nextX);
      y.set(nextY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [x, y]);

  return { x, y };
}