"use client";

import type React from "react";

import { motion } from "framer-motion";
import { Ghost, Search, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface NotFoundScreenProps {
  message?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  title?: string;
  searchTerm?: string;
}

const NotFoundScreen: React.FC<NotFoundScreenProps> = ({
  message = "The page you're looking for doesn't exist.",
  showBackButton = true,
  showHomeButton = true,
  title = "Page Not Found",
  searchTerm,
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

  const ghostVariants = {
    hidden: { scale: 0.8, opacity: 0, y: 20 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8,
      },
    },
    float: {
      y: [0, -15, 0],
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      },
    },
  };

  // 404 text animation
  const numberVariants = {
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
        <motion.div
          className="relative z-10 bg-background/80 backdrop-blur-sm border border-border rounded-2xl p-8 shadow-lg"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* 404 text */}
          <motion.div
            className="flex items-center justify-center mb-8"
            variants={numberVariants}
          >
            <div className="relative">
              <div className="text-[10rem] font-bold text-gray-100 leading-none select-none">
                404
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-[5rem] font-bold bg-gradient-to-r from-primary to-primary/70 text-transparent bg-clip-text leading-none">
                  404
                </div>
              </div>
            </div>
          </motion.div>

          {/* Ghost icon with floating animation */}
          <motion.div
            className="flex justify-center mb-6"
            variants={ghostVariants}
            initial="hidden"
            animate={["visible", "float"]}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
              <div className="relative bg-primary/10 rounded-full p-4">
                <Ghost className="h-16 w-16 text-primary" />
              </div>
            </div>
          </motion.div>

          {/* Search animation */}
          <motion.div
            className="absolute top-6 right-6"
            animate={{
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              ease: "easeInOut",
              repeatDelay: 3,
            }}
          >
            <Search className="h-6 w-6 text-primary/50" />
          </motion.div>

          {/* Title and message */}
          <motion.h1
            className="text-2xl font-bold text-center text-foreground mb-3"
            variants={itemVariants}
          >
            {title}
          </motion.h1>

          <motion.p
            className="text-muted-foreground text-center mb-8"
            variants={itemVariants}
          >
            {searchTerm
              ? `We couldn't find any results for "${searchTerm}".`
              : message}
          </motion.p>

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
              <Link href="/" passHref>
                <Button className="group flex items-center gap-2 transition-all duration-300">
                  <Home className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Back to Home</span>
                </Button>
              </Link>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundScreen;
