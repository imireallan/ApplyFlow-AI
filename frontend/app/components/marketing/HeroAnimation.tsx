import { useState, useEffect } from "react";
import { motion } from "motion/react";
import Lottie from "lottie-react";

import robotAnimation from "~/assets/chatbot.json";

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

  useEffect(() => {
    // This ensures the heavy Lottie engine only loads in the browser
    setIsClient(true);
  }, []);

  return (
    <div className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center">
      <div className="absolute w-2/3 h-2/3 bg-blue-500/10 blur-[120px] rounded-full animate-pulse" />

      <div className="relative z-10 w-full h-full max-w-[320px] md:max-w-[500px] aspect-square flex items-center justify-center mt-[-5%] mb-[-10%] md:my-0">
        {!isClient ? (
          /* Shimmer Placeholder: Maintains layout height during SSR/Hydration */
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-64 h-64 bg-gray-100/50 rounded-full animate-pulse flex items-center justify-center">
              <div className="w-32 h-32 bg-gray-200/50 rounded-full animate-ping" />
            </div>
          </div>
        ) : (
          /* Actual Lottie Animation: Only injected on the client */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full h-full"
          >
            <Lottie
              animationData={robotAnimation}
              loop={true}
              className="w-full h-full"
              style={{
                width: "100%",
                height: "100%",
                filter: "hue-rotate(433deg) saturate(30)",
              }}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
