"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { QuickMatchInlineForm } from "@/components/quick-match-inline-form";
import { ArrowRight, Sparkles, CheckCircle } from "lucide-react";

const benefits = [
  "Personalized school recommendations",
  "Compare pricing instantly",
  "No commitment required",
  "Get results in minutes",
];

export function QuickMatchSection() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCategory] = useState<number>(2); // Default to car (category 2)

  const handleOpenForm = () => {
    setIsFormOpen(!isFormOpen);
  };

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-gold-50 via-white to-gold-50 py-20 sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_rgba(234,179,8,0.1)_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_rgba(234,179,8,0.08)_0%,_transparent_50%)]" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left Column - Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-gold-100 px-4 py-2 text-sm font-medium text-gold-800 shadow-sm mb-6">
                <Sparkles className="h-4 w-4" />
                Quick Match Tool
              </div>

              <h2 className="font-heading text-4xl font-bold text-gray-900 sm:text-5xl mb-6">
                Find Your Perfect Match in{" "}
                <span className="bg-gradient-to-r from-gold-600 to-gold-500 bg-clip-text text-transparent">
                  Minutes
                </span>
              </h2>

              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Answer a few quick questions and get your best options instantly
                —
                <span className="font-semibold text-gray-900">
                  {" "}
                  free & no commitment
                </span>
                .
              </p>

              <div className="space-y-4 mb-10">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    className="flex items-start gap-3"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <CheckCircle className="h-6 w-6 text-gold-600" />
                    </div>
                    <p className="text-lg text-gray-700">{benefit}</p>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                <Button
                  size="lg"
                  onClick={handleOpenForm}
                  className="h-14 px-10 text-lg bg-gold-600 hover:bg-gold-700 shadow-lg hover:shadow-xl transition-all"
                >
                  {isFormOpen ? "Close Form" : "Get Started Now"}
                  <ArrowRight
                    className={`ml-2 h-5 w-5 transition-transform ${
                      isFormOpen ? "rotate-90" : ""
                    }`}
                  />
                </Button>
                <p className="text-sm text-gray-500 mt-4">
                  ✨ Takes less than 2 minutes
                </p>
              </motion.div>
            </motion.div>

            {/* Right Column - Visual */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative rounded-2xl bg-white p-8 shadow-2xl border border-gold-200">
                {/* Mock Form Preview */}
                <div className="space-y-6">
                  <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-600 text-white font-semibold">
                      1
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-gray-900">
                        License Type
                      </h4>
                      <p className="text-sm text-gray-500">
                        Choose your category
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600 font-semibold">
                      2
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-gray-900">
                        Location
                      </h4>
                      <p className="text-sm text-gray-500">
                        Where are you based?
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600 font-semibold">
                      3
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-gray-900">
                        Experience
                      </h4>
                      <p className="text-sm text-gray-500">
                        Your driving background
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pb-4 border-b border-gray-200">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600 font-semibold">
                      4
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-gray-900">
                        Package Type
                      </h4>
                      <p className="text-sm text-gray-500">
                        Select your preference
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-600 font-semibold">
                      5
                    </div>
                    <div>
                      <h4 className="font-heading font-semibold text-gray-900">
                        Your Results
                      </h4>
                      <p className="text-sm text-gray-500">
                        Get matched instantly
                      </p>
                    </div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 h-24 w-24 bg-gold-400 rounded-full opacity-20 blur-2xl"></div>
                <div className="absolute -bottom-4 -left-4 h-32 w-32 bg-gold-300 rounded-full opacity-20 blur-3xl"></div>
              </div>

              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl border border-gold-200 p-4"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <div className="h-12 w-12 rounded-full bg-gold-100 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-gold-600" />
                    </div>
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">5,000+</p>
                    <p className="text-sm text-gray-600">Students Matched</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Inline Form */}
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 overflow-hidden"
            >
              <QuickMatchInlineForm selectedCategory={selectedCategory} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </>
  );
}
