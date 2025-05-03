"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface DetailPageSkeletonProps {
  icon: ReactNode;
  backLink: string;
  backText: string;
  loadingText: string;
  progress: number;
}

export default function DetailPageSkeleton({
  icon,
  backLink,
  backText,
  loadingText,
  progress,
}: DetailPageSkeletonProps) {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Back button */}
        <div className="mb-6">
          <Link
            href={backLink}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{backText}</span>
          </Link>
        </div>

        {/* Loading indicator */}
        <div className="mb-8 flex justify-center">
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-full shadow-sm">
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
            <span className="text-gray-700 font-medium">{loadingText}</span>
            <span className="text-primary font-bold">{progress}%</span>
          </div>
        </div>

        {/* Floating animation */}
        <div className="fixed bottom-10 right-10">
          <motion.div
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 1.5,
              ease: "easeInOut",
            }}
          >
            <div className="relative">
              <div className="absolute -inset-2 bg-primary/20 rounded-full blur-xl"></div>
              <div className="relative bg-white p-4 rounded-full shadow-lg">
                {icon}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
