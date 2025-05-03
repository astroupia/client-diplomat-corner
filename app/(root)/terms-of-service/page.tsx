"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, FileText, Info, Shield } from "lucide-react";
import Link from "next/link";

export default function TermsOfService() {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  const sections = [
    {
      id: "introduction",
      title: "Introduction",
      content: `
        <p>Welcome to Diplomat Corner. These Terms of Service ("Terms") govern your access to and use of our website, services, and applications (collectively, the "Services").</p>
        <p>By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Services.</p>
        <p>We may modify these Terms at any time. If we do so, we will notify you by publishing the modified Terms on our website. Your continued use of the Services after we publish the modified Terms constitutes your acceptance of the modified Terms.</p>
      `,
    },
    {
      id: "account",
      title: "Account Registration and Security",
      content: `
        <p>To access certain features of our Services, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.</p>
        <p>You are responsible for safeguarding your account credentials and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account or any other breach of security.</p>
        <p>We reserve the right to disable any user account at any time in our sole discretion for any or no reason, including if we believe that you have violated these Terms.</p>
      `,
    },
    {
      id: "listings",
      title: "Listings and Transactions",
      content: `
        <p>Our Services allow users to list cars, houses, and other items for sale or rent. When you create a listing, you agree to provide accurate, complete, and up-to-date information about the item being listed.</p>
        <p>You are solely responsible for the content of your listings and for any transactions that result from your listings. We do not guarantee that any transactions will be completed, and we are not responsible for the quality, safety, legality, or availability of items listed on our Services.</p>
        <p>We reserve the right to remove any listing at any time in our sole discretion for any or no reason, including if we believe that the listing violates these Terms or our policies.</p>
      `,
    },
    {
      id: "conduct",
      title: "User Conduct",
      content: `
        <p>You agree not to use our Services to:</p>
        <ul>
          <li>Violate any applicable law or regulation</li>
          <li>Infringe the rights of any third party, including intellectual property rights</li>
          <li>Post or transmit any content that is unlawful, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable</li>
          <li>Impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with a person or entity</li>
          <li>Interfere with or disrupt the Services or servers or networks connected to the Services</li>
          <li>Collect or store personal data about other users without their consent</li>
          <li>Engage in any activity that could disable, overburden, damage, or impair the Services</li>
        </ul>
      `,
    },
    {
      id: "intellectual",
      title: "Intellectual Property",
      content: `
        <p>The Services and all content and materials included on the Services, including text, graphics, logos, images, and software, are the property of Diplomat Corner or its licensors and are protected by copyright, trademark, and other intellectual property laws.</p>
        <p>We grant you a limited, non-exclusive, non-transferable, and revocable license to access and use the Services for your personal, non-commercial use. You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Services without our prior written consent.</p>
      `,
    },
    {
      id: "disclaimer",
      title: "Disclaimer of Warranties",
      content: `
        <p>THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.</p>
        <p>WE DO NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR THAT THE SERVICES OR THE SERVERS THAT MAKE THEM AVAILABLE ARE FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.</p>
      `,
    },
    {
      id: "limitation",
      title: "Limitation of Liability",
      content: `
        <p>IN NO EVENT WILL DIPLOMAT CORNER, ITS AFFILIATES, OR THEIR LICENSORS, SERVICE PROVIDERS, EMPLOYEES, AGENTS, OFFICERS, OR DIRECTORS BE LIABLE FOR DAMAGES OF ANY KIND, UNDER ANY LEGAL THEORY, ARISING OUT OF OR IN CONNECTION WITH YOUR USE, OR INABILITY TO USE, THE SERVICES, INCLUDING ANY DIRECT, INDIRECT, SPECIAL, INCIDENTAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES.</p>
      `,
    },
    {
      id: "indemnification",
      title: "Indemnification",
      content: `
        <p>You agree to defend, indemnify, and hold harmless Diplomat Corner, its affiliates, and their respective officers, directors, employees, and agents from and against any claims, liabilities, damages, judgments, awards, losses, costs, expenses, or fees (including reasonable attorneys' fees) arising out of or relating to your violation of these Terms or your use of the Services.</p>
      `,
    },
    {
      id: "termination",
      title: "Termination",
      content: `
        <p>We may terminate or suspend your access to all or part of the Services, without notice, for any conduct that we, in our sole discretion, believe is in violation of these Terms or is harmful to other users of the Services, to us, or to third parties, or for any other reason.</p>
        <p>Upon termination, your right to use the Services will immediately cease, and you must cease all use of the Services and delete any content or materials you have obtained from the Services.</p>
      `,
    },
    {
      id: "governing",
      title: "Governing Law and Jurisdiction",
      content: `
        <p>These Terms and any dispute or claim arising out of or in connection with them or their subject matter or formation shall be governed by and construed in accordance with the laws of Ethiopia, without giving effect to any choice or conflict of law provision or rule.</p>
        <p>Any legal suit, action, or proceeding arising out of or related to these Terms or the Services shall be instituted exclusively in the courts of Ethiopia, and you irrevocably submit to the personal jurisdiction of such courts.</p>
      `,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-10 pb-16">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-full mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Terms of Service
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Please read these terms carefully before using our platform. By
              accessing or using Diplomat Corner, you agree to be bound by these
              terms.
            </p>
            <div className="mt-6 flex items-center justify-center gap-4">
              <p className="text-sm text-gray-500">
                Last Updated: March 10, 2025
              </p>
              <Link
                href="/privacy-policy"
                className="text-sm text-primary hover:text-primary/80 flex items-center gap-1"
              >
                <Shield className="h-4 w-4" />
                Privacy Policy
              </Link>
            </div>
          </div>

          {/* Table of Contents */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-8 bg-white rounded-xl shadow-sm p-6 border border-gray-100"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Table of Contents
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-primary hover:text-primary/80 flex items-center gap-1"
                    onClick={(e) => {
                      e.preventDefault();
                      document
                        .getElementById(section.id)
                        ?.scrollIntoView({ behavior: "smooth" });
                      setActiveSection(section.id);
                    }}
                  >
                    <Info className="h-4 w-4" />
                    <span>{section.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Terms Sections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
          >
            {sections.map((section, index) => (
              <div
                key={section.id}
                id={section.id}
                className={`border-b border-gray-100 last:border-b-0 ${
                  activeSection === section.id ? "bg-gray-50" : ""
                }`}
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <h3 className="text-lg font-medium text-gray-800">
                    <span className="text-primary mr-2">{index + 1}.</span>{" "}
                    {section.title}
                  </h3>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 transition-transform ${
                      activeSection === section.id ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className={`px-6 pb-6 transition-all duration-300 overflow-hidden ${
                    activeSection === section.id
                      ? "max-h-[1000px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div
                    className="prose prose-gray max-w-none text-gray-600"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                </div>
              </div>
            ))}
          </motion.div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-12 bg-white rounded-xl shadow-sm p-6 border border-gray-100 text-center"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Have Questions?
            </h2>
            <p className="text-gray-600 mb-6">
              If you have any questions about these Terms of Service, please
              contact us.
            </p>
            <Link
              href="/contact-us"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm hover:shadow-md"
            >
              Contact Us
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
