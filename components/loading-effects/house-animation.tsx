"use client"

import { motion } from "framer-motion"
import { Home } from "lucide-react"

interface HouseAnimationProps {
  size?: number
  color?: string
  className?: string
}

export default function HouseAnimation({ size = 48, color = "#4F46E5", className = "" }: HouseAnimationProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Ground */}
      <div className="w-full h-4 bg-gradient-to-b from-gray-700 to-gray-900 rounded-full overflow-hidden">
        {/* Buildings silhouette */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between overflow-hidden">
          {Array.from({ length: 7 }).map((_, i) => {
            const width = 8 + Math.floor(Math.random() * 10)
            const height = 10 + Math.floor(Math.random() * 15)

            return (
              <div
                key={i}
                className="relative bg-gray-900 rounded-t-sm"
                style={{
                  width: `${width}px`,
                  height: `${height}px`,
                  marginRight: i === 6 ? "0" : "2px",
                }}
              >
                {/* Building windows */}
                <div
                  className="absolute bg-yellow-100/30"
                  style={{
                    width: "1px",
                    height: "1px",
                    left: `${Math.floor(width / 2)}px`,
                    bottom: `${Math.floor(height / 2)}px`,
                    opacity: Math.random() > 0.5 ? 0.8 : 0,
                  }}
                />
              </div>
            )
          })}
        </div>
      </div>

      {/* House */}
      <motion.div
        className="absolute -top-12 left-1/2 transform -translate-x-1/2"
        animate={{
          y: [0, -2, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 0.5,
          ease: "easeInOut",
        }}
      >
        <Home style={{ width: size, height: size, color }} />
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
