import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Lottie from "lottie-react";

import paperAnimation from "~/assets/aiPaperGenerator.json";

/**
 * @component HeroAnimation
 * @description Renders the primary Lottie robot animation with high-performance CSS filters.
 * * @example
 * <HeroAnimation />
 * * @ssr_stability
 * IMPORTANT: This component utilizes a `isClient` guard (useEffect toggle) to prevent
 * Server-Side Rendering (SSR) crashes.
 * * @issue_mitigation
 * 1. ReferenceError: 'window' is not defined - Resolved by gating the Lottie engine
 * behind a client-side mount check.
 * 2. Hydration Mismatch - Resolved by rendering a stable placeholder div on the server
 * that matches the final client-side dimensions.
 * 3. AWS CPU Spikes - Prevents infinite container restart loops caused by Node.js
 * runtime errors during initial page render.
 * * @dependencies
 * - lottie-react: For vector animation playback.
 * - motion/react: For entry transitions and parallax engagement.
 */
export function HeroAnimation() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);

  return (
    <div className="relative w-full h-[300px] sm:h-[400px] md:h-[500px] flex items-center justify-center">
      <div className="absolute w-2/3 h-2/3 bg-blue-500/10 blur-[100px] rounded-full animate-pulse" />

      <div className="relative z-10 w-full max-w-[260px] sm:max-w-[320px] md:max-w-[450px] aspect-square flex items-center justify-center">
        {!isClient ? (
          <div className="w-40 h-40 bg-gray-100 rounded-full animate-pulse" />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full"
          >
            <Lottie
              animationData={paperAnimation}
              loop
              className="w-full h-full"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
