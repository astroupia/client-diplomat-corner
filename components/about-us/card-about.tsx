"use client";

import type React from "react";
import { motion } from "framer-motion";
import {
  Rocket,
  Lightbulb,
  ShieldCheck,
  Award,
  Clock,
  Users,
} from "lucide-react";

const WhyDiplomatCorner: React.FC = () => {
  const features = [
    {
      title: "Quick and Easy",
      description:
        "Listing your property or vehicle takes just minutes and goes live almost instantly.",
      icon: <Rocket className="h-8 w-8 text-primary" />,
    },
    {
      title: "Effective",
      description:
        "With thousands of potential buyers in your area, you can sell quickly.",
      icon: <Lightbulb className="h-8 w-8 text-primary" />,
    },
    {
      title: "Privacy Assured",
      description:
        "We take your privacy seriously, ensuring a spam-free experience.",
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    },
    {
      title: "Award Winning",
      description:
        "Recognized for excellence in service to the diplomatic community.",
      icon: <Award className="h-8 w-8 text-primary" />,
    },
    {
      title: "24/7 Support",
      description:
        "Our dedicated team is available around the clock to assist you.",
      icon: <Clock className="h-8 w-8 text-primary" />,
    },
    {
      title: "Community Focus",
      description:
        "Built specifically for the unique needs of the diplomatic community.",
      icon: <Users className="h-8 w-8 text-primary" />,
    },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          WHY <span className="text-primary">Diplomat Corner</span>
        </h2>
        <div className="mx-auto mb-6 h-1 w-24 rounded-full bg-primary"></div>
        <p className="max-w-2xl mx-auto text-gray-600">
          We&apos;re committed to providing exceptional service to the
          diplomatic community in Ethiopia. Here&apos;s what sets us apart:
        </p>
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
            className="group flex flex-col items-center rounded-xl bg-white p-6 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            {/* Icon with animated background */}
            <div className="relative mb-5">
              <div className="absolute inset-0 -z-10 h-full w-full rounded-full bg-primary/10 transition-all duration-300 group-hover:scale-110"></div>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm transition-all duration-300 group-hover:shadow-md">
                {feature.icon}
              </div>
            </div>

            {/* Title */}
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              {feature.title}
            </h3>

            {/* Animated underline */}
            <div className="mb-3 h-1 w-10 rounded-full bg-primary transition-all duration-300 group-hover:w-20"></div>

            {/* Description */}
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default WhyDiplomatCorner;
