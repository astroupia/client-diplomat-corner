"use client";

import type React from "react";
import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, MessageSquare, Phone, Send } from "lucide-react";
import Link from "next/link";
import {
  GoogleMap,
  LoadScript,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import ContactForm from "@/components/about-us/contact-form";

// Add this near the top of your file
const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 9.0092, // Replace with your actual latitude
  lng: 38.7584, // Replace with your actual longitude
};

export default function Page() {
  // Add these new states
  const [mapLoaded, setMapLoaded] = useState(false);
  const [showInfoWindow, setShowInfoWindow] = useState(false);
  const mapRef = useRef(null);

  const onMapLoad = useCallback((map: google.maps.Map | null) => {
    if (map) {
      (mapRef.current as google.maps.Map | null) = map;
      setMapLoaded(true);
    }
  }, []);

  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Success
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormState({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

    // Reset success message after 5 seconds
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-5 pb-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Have questions or feedback? We&apos;d love to hear from you. Fill
              out the form below and our team will get back to you as soon as
              possible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="md:col-span-2"
            >
              <ContactForm />
            </motion.div>
          </div>

          {/* Map Section - Updated with interactive map */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12"
          >
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Our Location
              </h2>
              <div className="aspect-video w-full rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.6855771046493!2d38.75526097596509!3d8.980599889188402!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x164b85cef5ab402d%3A0x8467b6b037a24d49!2sBole%2C%20Addis%20Ababa!5e0!3m2!1sen!2set!4v1687456789012!5m2!1sen!2set"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-[400px]"
                  title="Diplomat Corner Location"
                ></iframe>
                <div className="mt-4 text-center">
                  <a
                    href="https://maps.app.goo.gl/tU4L6AgP9An5b2mA8"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <MapPin className="h-4 w-4" />
                    <span>Open in Google Maps</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
