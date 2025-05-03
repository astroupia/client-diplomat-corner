"use client";

import type React from "react";

import { motion } from "framer-motion";
import { ShieldAlert, Home, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface PermissionDeniedScreenProps {
  message?: string;
  onRetry?: () => void;
  showHomeButton?: boolean;
  showBackButton?: boolean;
  title?: string;
}

const PermissionDeniedScreen: React.FC<PermissionDeniedScreenProps> = ({
  message = "You don't have permission to access this resource.",
  onRetry,
  showHomeButton = true,
  showBackButton = true,
  title = "Access Denied",
}) => {
  const router = useRouter();

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8,
      },
    },
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="relative w-full max-w-md mx-auto px-6">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl"
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
            className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl"
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
        <motion.div
          className="relative z-10 bg-background/80 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-lg"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Error icon with animation */}
          <motion.div
            className="flex justify-center mb-6"
            variants={iconVariants}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-xl"></div>
              <div className="relative bg-amber-100 rounded-full p-4">
                <ShieldAlert className="h-16 w-16 text-amber-600" />
              </div>
            </div>
          </motion.div>

          {/* Title and message */}
          <motion.div className="text-center" variants={itemVariants}>
            <h1 className="text-2xl font-bold text-amber-600 mb-2">{title}</h1>
            <p className="text-muted-foreground mb-8">{message}</p>
          </motion.div>

          {/* Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            variants={itemVariants}
          >
            {showBackButton && (
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="group flex items-center gap-2 transition-all duration-300"
              >
                <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                <span>Go Back</span>
              </Button>
            )}

            {showHomeButton && (
              <Button
                variant="outline"
                onClick={() => router.push("/")}
                className="group flex items-center gap-2 transition-all duration-300"
              >
                <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
                <span>Home</span>
              </Button>
            )}

            {onRetry && (
              <Button
                onClick={onRetry}
                className="bg-amber-600 hover:bg-amber-700 text-white group flex items-center gap-2 transition-all duration-300"
              >
                <RefreshCw className="h-4 w-4 group-hover:animate-spin" />
                <span>Try Again</span>
              </Button>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default PermissionDeniedScreen;
