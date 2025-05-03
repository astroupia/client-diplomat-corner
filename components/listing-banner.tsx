"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Car, Home } from "lucide-react";

interface PageBannerProps {
  type: "car" | "house" | string;
  title?: string;
  subtitle?: string;
}

export default function ListingBanner({
  type = "car",
  title,
  subtitle,
}: PageBannerProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const getContent = () => {
    const defaultContent = {
      car: {
        title: "Explore Our Cars",
        subtitle: "Find your perfect ride",
        icon: Car,
        bgImage: "/assets/images/car_preview.jpg",
        bgColor: "from-primary/80 to-green-800/80",
      },
      house: {
        title: "Discover Properties",
        subtitle: "Find your dream home",
        icon: Home,
        bgImage: "/assets/images/house_preview.jpg",
        bgColor: "from-primary/80 to-green-800/80",
      },
    };

    // Default to car if type is not recognized
    const contentType = type === "house" ? "house" : "car";
    const content = defaultContent[contentType as keyof typeof defaultContent];

    return {
      title: title || content.title,
      subtitle: subtitle || content.subtitle,
      icon: content.icon,
      bgImage: content.bgImage,
      bgColor: content.bgColor,
    };
  };

  const content = getContent();
  const Icon = content.icon;

  return (
    <div className="rounded-lg relative w-full h-48 sm:h-56 md:h-64 overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${content.bgImage})` }}
      />

      {/* Overlay gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${content.bgColor}`} />

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isLoaded ? 1 : 0, y: isLoaded ? 0 : 10 }}
          transition={{ duration: 0.5 }}
          className="text-center text-white"
        >
          <div className="flex items-center justify-center mb-3">
            <Icon size={28} className="mr-2" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              {content.title}
            </h1>
          </div>
          <p className="text-base sm:text-lg md:text-xl max-w-md mx-auto">
            {content.subtitle}
          </p>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: isLoaded ? "100%" : 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="absolute bottom-0 left-0 h-1 bg-white/30"
      />
    </div>
  );
}
