import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { AnimatePresence, motion, type HTMLMotionProps } from "motion/react";
import { cn } from "~/lib/utils";



const buttonVariants = cva(
  "w-full flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:pointer-events-none overflow-hidden relative",
  {
    variants: {
      variant: {
        primary:
          "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200",
        dark: "bg-[#1a1d23] text-white hover:bg-black",
        outline: "border-2 border-gray-200 bg-transparent hover:bg-gray-50",
      },
      size: {
        default:
          "py-4 px-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em]",
        compact:
          "py-3 px-4 rounded-xl font-bold text-xs uppercase tracking-tighter",
        rounded: "py-4 px-8 rounded-full font-bold",
      },
    },
    defaultVariants: {
      variant: "dark",
      size: "default",
    },
  },
);

interface ButtonProps
  extends HTMLMotionProps<"button">, VariantProps<typeof buttonVariants> {
  isLoading?: boolean;
  loadingText?: string;
  icon?: ReactNode;
  children?: React.ReactNode | any;
  stiffness?: number;
  damping?: number;
}

export function Button({
  className,
  variant,
  size,
  isLoading,
  loadingText,
  icon,
  children,
  stiffness,
  damping,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98, y: 0 }}
      transition={{ 
        type: "spring", 
        stiffness, 
        damping,
        ...props.transition
      }}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isLoading || props.disabled}
      {...props}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <span
            key="loader"
            className="flex items-center gap-2"
          >
            <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            {loadingText || "Loading..."}
          </span>
        ) : (
          <span
            key="content"
            className="flex items-center gap-2"
          >
            {icon && <span className="text-lg">{icon}</span>}
            {children}
          </span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
