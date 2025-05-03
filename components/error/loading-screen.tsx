"use client";

import type React from "react";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

interface LoadingScreenProps {
  message?: string;
  showProgressBar?: boolean;
  customIcon?: React.ReactNode;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading, please wait...",
  showProgressBar = true,
  customIcon,
}) => {
  const [progress, setProgress] = useState(0);

  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Random increment between 1-5%
        return Math.min(prev + Math.random() * 4 + 1, 100);
      });
    }, 200);

    return () => clearInterval(interval);
  }, []);

  // Pulse animation variants
  const pulseVariants = {
    initial: { scale: 0.95, opacity: 0.5 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse",
        ease: "easeInOut",
      },
    },
  };

  // Floating dots animation variants
  const dotsVariants = {
    initial: { opacity: 0, y: 0 },
    animate: (i: number) => ({
      opacity: [0, 1, 0],
      y: [0, -10, 0],
      transition: {
        duration: 1.5,
        repeat: Number.POSITIVE_INFINITY,
        delay: i * 0.2,
      },
    }),
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="relative flex flex-col items-center justify-center p-8 max-w-md w-full">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"
            animate={{
              x: [0, 10, 0],
              y: [0, -10, 0],
            }}
            transition={{
              duration: 8,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
            animate={{
              x: [0, -10, 0],
              y: [0, 10, 0],
            }}
            transition={{
              duration: 10,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
            }}
          />
        </div>

        {/* Main content */}
        <div className="flex flex-col items-center justify-center z-10">
          {/* Loading icon with pulse effect */}
          <motion.div
            initial={false}
            animate="animate"
            className="relative mb-8"
          >
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
            <div className="relative bg-background border border-border rounded-full p-6">
              {customIcon || (
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              )}
            </div>
          </motion.div>

          {/* Message with animated dots */}
          <div className="flex items-center justify-center mb-6">
            <p className="text-lg font-medium text-foreground">{message}</p>
            <div className="flex ml-2">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={dotsVariants}
                  initial="initial"
                  animate="animate"
                  className="w-1.5 h-1.5 mx-0.5 rounded-full bg-primary"
                />
              ))}
            </div>
          </div>

          {/* Progress bar */}
          {showProgressBar && (
            <div className="w-full max-w-xs bg-muted rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeInOut" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
