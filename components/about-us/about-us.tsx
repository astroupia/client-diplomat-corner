"use client";

import type React from "react";
import { motion } from "framer-motion";
import MaxWidthWrapper from "@/components/max-width-wrapper";
import CardAbout from "./card-about";
// import ContactForm from "./contact-form"; // No longer used here
import Image from "next/image";
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const AboutUs: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white to-gray-50 py-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5"></div>
          <div className="absolute top-60 -left-20 h-60 w-60 rounded-full bg-primary/10"></div>
          <div className="absolute bottom-0 right-1/4 h-40 w-40 rounded-full bg-primary/5"></div>
        </div>

        <MaxWidthWrapper>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 flex flex-col items-center justify-center px-4 text-center"
          >
            <h1 className="mb-6 text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">WHO WE ARE</span>
            </h1>
            <div className="mb-8 h-1 w-24 rounded-full bg-primary"></div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-3xl text-lg leading-relaxed text-gray-600 md:text-xl"
            >
              Diplomat Corner has been serving the diplomatic community in
              Ethiopia since 2015, providing a wide range of services, including
              property management, house hunting, disposal of duty-free
              vehicles, car rental services, used household items sales, liaison
              services, online shopping, and more. Our commitment to value
              creation and excellent customer service has grown our subscriber
              base to over 3,200, consisting of embassies, UN agencies, AU
              organs, international organizations, and multinational companies.
            </motion.p>
          </motion.div>
        </MaxWidthWrapper>
      </section>

      <div className="container mx-auto max-w-6xl px-4">
        {/* Mission & Vision Section */}
        <section className="py-16">
          <MaxWidthWrapper>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 gap-8 md:grid-cols-2"
            >
              <div className="rounded-2xl bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md">
                <h2 className="mb-4 text-2xl font-bold text-gray-900">
                  Our Mission
                </h2>
                <div className="mb-4 h-1 w-16 rounded-full bg-primary"></div>
                <p className="text-gray-600">
                  To provide exceptional services that simplify the lives of
                  diplomatic personnel and international organizations in
                  Ethiopia, creating a seamless experience for property
                  management, vehicle transactions, and other essential
                  services.
                </p>
              </div>
              <div className="rounded-2xl bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-md">
                <h2 className="mb-4 text-2xl font-bold text-gray-900">
                  Our Vision
                </h2>
                <div className="mb-4 h-1 w-16 rounded-full bg-primary"></div>
                <p className="text-gray-600">
                  To be the premier service provider for the diplomatic
                  community in Ethiopia, recognized for our integrity,
                  efficiency, and commitment to excellence in every interaction
                  and service we provide.
                </p>
              </div>
            </motion.div>
          </MaxWidthWrapper>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 bg-gray-50">
          <MaxWidthWrapper>
            <CardAbout />
          </MaxWidthWrapper>
        </section>

        {/* Team Section - Commented out */}
        {/* 
        <section className="bg-white py-16">
          <MaxWidthWrapper>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h2 className="mb-4 text-3xl font-bold text-gray-900">
                Our Leadership Team
              </h2>
              <div className="mx-auto mb-12 h-1 w-24 rounded-full bg-primary"></div>

              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {[1, 2, 3, 4].map((item) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 * item }}
                    className="group relative overflow-hidden rounded-xl bg-white shadow-sm transition-all duration-300 hover:shadow-md"
                  >
                    <div className="aspect-square w-full overflow-hidden bg-gray-200">
                      <Image
                        src={`/placeholder.svg?height=300&width=300&text=Team Member ${item}`}
                        alt={`Team Member ${item}`}
                        fill
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Team Member {item}
                      </h3>
                      <p className="text-sm text-primary">Position Title</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </MaxWidthWrapper>
        </section>
        */}

        {/* Reach Out Section */}
       
{/* Reach Out Section */}
<section className="py-20">
  <MaxWidthWrapper>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="relative overflow-hidden rounded-3xl bg-primary p-10 shadow-xl md:p-16"
    >
      {/* Pattern Overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-10">
        <svg
          className="h-full w-full text-white"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.4"
        >
          <defs>
            <pattern
              id="diagonalPattern"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
            >
              <path d="M0 40 L40 0" />
              <path d="M-10 30 L30 -10" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#diagonalPattern)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white">
        <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Let’s Work Together
        </h2>
        <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto">
          Have questions or ready to make your next move? We’d love to hear from you. Let’s build something great together.
        </p>

        <div className="mt-8">
          <Link href="/contact-us">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary shadow-lg transition duration-300 hover:scale-105 hover:shadow-xl">
              Contact Us
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </div>
      </div>
    </motion.div>
  </MaxWidthWrapper>
</section>


      </div>
    </div>
  );
};

export default AboutUs;
