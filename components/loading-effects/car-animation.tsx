"use client"

import { motion } from "framer-motion"
import { Car } from "lucide-react"

interface CarAnimationProps {
  size?: number
  color?: string
  className?: string
}

export default function CarAnimation({ size = 48, color = "#4F46E5", className = "" }: CarAnimationProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Road */}
      <div className="w-full h-4 bg-gray-800 rounded-full overflow-hidden">
        <div className="flex">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.div
              key={i}
              className="h-1 bg-white mt-1.5"
              style={{
                width: "20px",
                marginRight: "20px",
              }}
              animate={{
                x: [0, -40],
              }}
              transition={{
                repeat: Number.POSITIVE_INFINITY,
                duration: 1,
                ease: "linear",
              }}
            ></motion.div>
          ))}
        </div>
      </div>

      {/* Car */}
      <motion.div
        className="absolute -top-8 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, -2, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 0.5,
          ease: "easeInOut",
        }}
      >
        <Car style={{ width: size, height: size, color }} />
      </motion.div>

      {/* Shadow */}
      <motion.div
        className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-black/20 rounded-full"
        style={{ width: size * 0.8, height: size * 0.2 }}
        animate={{
          width: [size * 0.7, size * 0.8, size * 0.7],
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 0.5,
          ease: "easeInOut",
        }}
      ></motion.div>
    </div>
  )
}
