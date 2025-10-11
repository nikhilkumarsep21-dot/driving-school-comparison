import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { FeaturedSchools } from '@/components/featured-schools';
import {
  Award,
  ArrowRight,
  GitCompare
} from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden py-20 sm:py-32">

        <Container className="relative">
          <div className="text-center">
            <div className="mb-8 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full bg-gold-100 px-6 py-3 text-sm font-medium text-gold-800 shadow-soft">
                <Award className="h-5 w-5" />
                Dubai's Most Trusted Driving School Platform
              </div>
            </div>

            <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-gold-600 to-gold-500 bg-clip-text text-transparent">
                Driving School
              </span>
            </h1>

            <p className="mb-12 text-xl text-gray-600 sm:text-2xl leading-relaxed">
              Compare top-rated driving schools across Dubai. Make an informed decision
              with transparent pricing, real reviews, and comprehensive comparisons.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
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
            </div>

          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28 bg-white">
        <Container>
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
              Featured Partner Schools
            </h2>
            <p className="text-lg text-gray-600">
              Top-rated driving schools trusted by thousands of students across Dubai
            </p>
          </div>

          <FeaturedSchools />

          <div className="mt-12 text-center">
            <Link href="/schools">
              <Button size="lg" variant="outline" className="h-12 px-8 border-2 border-gold-200 hover:bg-gold-50 hover:border-gold-300">
                View All Schools
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28 bg-white">
        <Container>
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Three simple steps to find your ideal driving school
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gold-600 text-2xl font-bold text-white shadow-lg">
                  1
                </div>
                <h3 className="mb-3 text-2xl font-bold text-gray-900">
                  Browse & Filter
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Explore driving schools across Dubai. Use filters to find schools that match your location, budget, and license type preferences.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gold-600 text-2xl font-bold text-white shadow-lg">
                  2
                </div>
                <h3 className="mb-3 text-2xl font-bold text-gray-900">
                  Compare Options
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Select up to 3 schools to compare side-by-side. Review pricing, ratings, features, and student feedback to make an informed choice.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gold-600 text-2xl font-bold text-white shadow-lg">
                  3
                </div>
                <h3 className="mb-3 text-2xl font-bold text-gray-900">
                  Enroll & Learn
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Contact your chosen school directly to enroll. Start your journey to becoming a confident, licensed driver in Dubai.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="relative overflow-hidden bg-gradient-to-br from-gold-600 to-gold-700 py-20 sm:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:24px_24px] opacity-20" />

        <Container className="relative">
          <div className="mx-auto text-center">
            <h2 className="text-4xl font-bold text-white sm:text-5xl mb-6 leading-tight">
              Ready to Start Your Driving Journey?
            </h2>
            <p className="text-xl text-gold-100 mb-10 leading-relaxed">
              Compare Dubai's best driving schools and find the perfect match for your needs today.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
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
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
