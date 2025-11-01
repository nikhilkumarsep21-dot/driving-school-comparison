"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { FeaturedSchools } from "@/components/featured-schools";
import { CategorySelection } from "@/components/category-selection";
import { QuickMatchSection } from "@/components/quick-match-section";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import {
  Award,
  ArrowRight,
  Users,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";

export default function Home() {
  const categoryRef = useScrollAnimation({ threshold: 0.2 });
  const featuredRef = useScrollAnimation({ threshold: 0.2 });
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-gold-600 to-gold-700 pt-20 py-20 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:24px_24px] opacity-20" />
        <Container className="relative">
          <div className="text-center">
            <motion.div
              className="mb-8 flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-6 py-3 text-sm font-medium text-gold-800 shadow-soft">
                <Award className="h-5 w-5" />
                Dubai's Most Trusted Driving School Platform
              </div>
            </motion.div>

            <motion.h1
              className="mb-6 pb-2 text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            >
              Find Your Perfect
              <span className="block bg-gradient-to-r from-white to-gold-100 bg-clip-text text-transparent pb-4">
                Driving School
              </span>
            </motion.h1>

            <motion.p
              className="mb-12 text-xl text-gold-100 sm:text-2xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
            >
              Compare top-rated driving schools across Dubai. Make an informed
              decision with transparent pricing, real reviews, and comprehensive
              comparisons.
            </motion.p>
          </div>
        </Container>
      </section>

      <section
        ref={categoryRef.ref as any}
        className="relative py-24 sm:py-32 bg-gradient-to-b from-white via-gold-50/30 to-white overflow-hidden"
      >
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gold-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gold-300/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-gold-400 rounded-full animate-pulse" />
        <div
          className="absolute top-1/3 right-1/3 w-2 h-2 bg-gold-500 rounded-full animate-pulse"
          style={{ animationDelay: "150ms" }}
        />
        <div
          className="absolute bottom-1/4 left-1/2 w-4 h-4 bg-gold-300 rounded-full animate-pulse"
          style={{ animationDelay: "300ms" }}
        />

        <Container className="relative">
          <motion.div
            className="mx-auto max-w-3xl text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={
              categoryRef.isInView
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-gold-100 px-4 py-2 text-sm font-medium text-gold-800 mb-6">
              <Award className="h-4 w-4" />
              Choose Your Vehicle
            </div>
            <h2 className="text-4xl font-bold sm:text-5xl mb-4">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Choose Your License Type
              </span>
            </h2>
            <p className="text-lg text-gray-600">
              Select the driving license category that matches your needs and
              start exploring schools
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={
              categoryRef.isInView
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            <CategorySelection />
          </motion.div>
        </Container>
      </section>

      <QuickMatchSection />

      <section
        ref={featuredRef.ref as any}
        className="relative py-24 sm:py-32 bg-gradient-to-b from-white via-gray-50 to-white overflow-hidden"
      >
        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-80 h-80 bg-gold-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-gold-100/30 rounded-full blur-3xl" />

        {/* Floating decorative shapes */}
        <div className="absolute top-1/4 left-10 w-20 h-20 border-2 border-gold-200 rounded-lg rotate-12 opacity-30" />
        <div className="absolute bottom-1/3 right-20 w-16 h-16 border-2 border-gold-300 rounded-full opacity-20" />
        <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-gold-400 rounded-full animate-pulse" />
        <div
          className="absolute top-2/3 left-1/3 w-2 h-2 bg-gold-500 rounded-full animate-pulse"
          style={{ animationDelay: "150ms" }}
        />

        <Container className="relative">
          <motion.div
            className="mx-auto max-w-3xl text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={
              featuredRef.isInView
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 30 }
            }
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-gold-100 px-4 py-2 text-sm font-medium text-gold-800 mb-6">
              <ShieldCheck className="h-4 w-4" />
              Verified Partners
            </div>
            <h2 className="text-4xl font-bold sm:text-5xl mb-4">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Featured Partner Schools
              </span>
            </h2>
            <p className="text-lg text-gray-600">
              Top-rated driving schools trusted by thousands of students across
              Dubai
            </p>
          </motion.div>

          <FeaturedSchools />

          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={
              featuredRef.isInView
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: 20 }
            }
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            <Link href="/schools">
              <Button
                size="lg"
                className="h-14 px-10 bg-gradient-to-r from-gold-600 to-gold-700 hover:from-gold-700 hover:to-gold-800 text-white shadow-lg hover:shadow-xl transition-all"
              >
                View All Schools
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </Container>
      </section>
    </div>
  );
}
