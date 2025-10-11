'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { FeaturedSchools } from '@/components/featured-schools';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import {
  Award,
  ArrowRight,
  GitCompare
} from 'lucide-react';

export default function Home() {
  const featuredRef = useScrollAnimation({ threshold: 0.2 });
  const howItWorksRef = useScrollAnimation({ threshold: 0.2 });
  const ctaRef = useScrollAnimation({ threshold: 0.3 });
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden py-20 sm:py-32">
        <Container className="relative">
          <div className="text-center">
            <motion.div
              className="mb-8 flex justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 rounded-full bg-gold-100 px-6 py-3 text-sm font-medium text-gold-800 shadow-soft">
                <Award className="h-5 w-5" />
                Dubai's Most Trusted Driving School Platform
              </div>
            </motion.div>

            <motion.h1
              className="mb-6 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            >
              Find Your Perfect
              <span className="block bg-gradient-to-r from-gold-600 to-gold-500 bg-clip-text text-transparent">
                Driving School
              </span>
            </motion.h1>

            <motion.p
              className="mb-12 text-xl text-gray-600 sm:text-2xl leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
            >
              Compare top-rated driving schools across Dubai. Make an informed decision
              with transparent pricing, real reviews, and comprehensive comparisons.
            </motion.p>

            <motion.div
              className="flex flex-col gap-4 sm:flex-row sm:justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
            >
              <Link href="/schools">
                <Button size="lg" className="h-14 w-full px-8 text-base font-semibold shadow-lg hover:shadow-xl transition-all sm:w-auto bg-gold-600 hover:bg-gold-700">
                  Browse All Schools
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/compare">
                <Button size="lg" variant="outline" className="h-14 w-full px-8 text-base font-semibold border-2 sm:w-auto">
                  <GitCompare className="mr-2 h-5 w-5" />
                  Compare Schools
                </Button>
              </Link>
            </motion.div>
          </div>
        </Container>
      </section>

      <section ref={howItWorksRef.ref as any} className="py-20 sm:py-28 bg-white">
        <Container>
          <motion.div
            className="mx-auto max-w-3xl text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={howItWorksRef.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Three simple steps to find your ideal driving school
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 40 }}
              animate={howItWorksRef.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            >
              <div className="flex flex-col items-center text-center">
                <motion.div
                  className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gold-600 text-2xl font-bold text-white shadow-lg"
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={howItWorksRef.isInView ? { scale: 1, rotate: 0 } : { scale: 0.8, rotate: -10 }}
                  transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                >
                  1
                </motion.div>
                <h3 className="mb-3 text-2xl font-bold text-gray-900">
                  Browse & Filter
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Explore driving schools across Dubai. Use filters to find schools that match your location, budget, and license type preferences.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 40 }}
              animate={howItWorksRef.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
            >
              <div className="flex flex-col items-center text-center">
                <motion.div
                  className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gold-600 text-2xl font-bold text-white shadow-lg"
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={howItWorksRef.isInView ? { scale: 1, rotate: 0 } : { scale: 0.8, rotate: -10 }}
                  transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                >
                  2
                </motion.div>
                <h3 className="mb-3 text-2xl font-bold text-gray-900">
                  Compare Options
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Select up to 3 schools to compare side-by-side. Review pricing, ratings, features, and student feedback to make an informed choice.
                </p>
              </div>
            </motion.div>

            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 40 }}
              animate={howItWorksRef.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.7, delay: 0.6, ease: "easeOut" }}
            >
              <div className="flex flex-col items-center text-center">
                <motion.div
                  className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gold-600 text-2xl font-bold text-white shadow-lg"
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={howItWorksRef.isInView ? { scale: 1, rotate: 0 } : { scale: 0.8, rotate: -10 }}
                  transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
                >
                  3
                </motion.div>
                <h3 className="mb-3 text-2xl font-bold text-gray-900">
                  Enroll & Learn
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Contact your chosen school directly to enroll. Start your journey to becoming a confident, licensed driver in Dubai.
                </p>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

      <section ref={featuredRef.ref as any} className="py-20 sm:py-28 bg-white">
        <Container>
          <motion.div
            className="mx-auto max-w-3xl text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={featuredRef.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
              Featured Partner Schools
            </h2>
            <p className="text-lg text-gray-600">
              Top-rated driving schools trusted by thousands of students across Dubai
            </p>
          </motion.div>

          <FeaturedSchools />

          <motion.div
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={featuredRef.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            <Link href="/schools">
              <Button size="lg" variant="outline" className="h-12 px-8 border-2 border-gold-200 hover:bg-gold-50 hover:border-gold-300">
                View All Schools
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </Container>
      </section>

      <section ref={ctaRef.ref as any} className="relative overflow-hidden bg-gradient-to-br from-gold-600 to-gold-700 py-20 sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:24px_24px] opacity-20" />

        <Container className="relative">
          <div className="mx-auto text-center">
            <motion.h2
              className="text-4xl font-bold text-white sm:text-5xl mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={ctaRef.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            >
              Ready to Start Your Driving Journey?
            </motion.h2>
            <motion.p
              className="text-xl text-gold-100 mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={ctaRef.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            >
              Compare Dubai's best driving schools and find the perfect match for your needs today.
            </motion.p>
            <motion.div
              className="flex flex-col gap-4 sm:flex-row sm:justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={ctaRef.isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
            >
              <Link href="/schools">
                <Button size="lg" variant="secondary" className="h-14 w-full px-10 text-base font-semibold shadow-xl hover:shadow-2xl transition-all bg-white text-gold-700 hover:bg-sand-50 sm:w-auto">
                  Explore All Schools
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/compare">
                <Button size="lg" variant="secondary" className="h-14 w-full px-10 text-base font-semibold shadow-xl hover:shadow-2xl transition-all bg-white/10 text-white border-2 border-white/30 hover:bg-white/20 sm:w-auto">
                  <GitCompare className="mr-2 h-5 w-5" />
                  Compare Schools
                </Button>
              </Link>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  );
}
