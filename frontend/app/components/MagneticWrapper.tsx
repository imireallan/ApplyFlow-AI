import { useRef } from "react";
import { motion, useSpring } from "motion/react";
import { useMousePosition } from "~/hooks/useMousePosition";

export function MagneticWrapper({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { x, y } = useMousePosition();

  // Smoothing the pull for a premium "heavy" feel
  const springConfig = { damping: 20, stiffness: 150 };
  const magneticX = useSpring(0, springConfig);
  const magneticY = useSpring(0, springConfig);

  const handleMouseMove = () => {
    // We leverage the existing -1 to 1 normalized values from our hook.
    // Multiplying by 20-30px creates a subtle 'magnetic' attraction
    // without the button escaping the user's click intent.
    magneticX.set(x.get() * 25);
    magneticY.set(y.get() * 25);
  };

  const reset = () => {
    magneticX.set(0);
    magneticY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      style={{
        x: magneticX,
        y: magneticY,
      }}
      // Transitioning the cursor to indicate the button is "active"
      className="cursor-pointer"
    >
      {children}
    </motion.div>
  );
}
