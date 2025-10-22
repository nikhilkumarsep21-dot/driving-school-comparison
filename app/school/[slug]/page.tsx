"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import { LicenseBadge } from "@/components/ui/license-badge";
import { PriceDisplay } from "@/components/ui/price-display";
import { Skeleton } from "@/components/ui/skeleton";
import { useComparisonStore } from "@/store/comparison-store";
import { School } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Phone,
  Mail,
  Globe,
  MapPin,
  Clock,
  Calendar,
  CheckCircle2,
  GitCompare,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function SchoolDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const { addSchool, removeSchool, isInComparison, canAddMore } =
    useComparisonStore();

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        const response = await fetch(`/api/schools/${slug}`);
        const data = await response.json();
        setSchool(data.school);
      } catch (error) {
        console.error("Failed to fetch school:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchool();
  }, [slug]);

  const handleCompareToggle = () => {
    if (!school) return;

    const inComparison = isInComparison(school.id);

    if (inComparison) {
      removeSchool(school.id);
      toast.info(`${school.name} removed from comparison`);
    } else {
      const success = addSchool(school);
      if (!success) {
        if (!canAddMore()) {
          toast.error("You can only compare up to 3 schools");
        }
      } else {
        toast.success(`${school.name} added to comparison`);
      }
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="py-12">
          <Skeleton className="mb-6 h-8 w-32" />
          <Skeleton className="mb-8 h-[400px] w-full rounded-2xl" />
          <Skeleton className="mb-4 h-12 w-3/4" />
          <Skeleton className="mb-8 h-24 w-full" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </Container>
    );
  }

  if (!school) {
    return (
      <Container>
        <div className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            School Not Found
          </h1>
          <p className="mb-8 text-gray-600">
            The driving school you're looking for doesn't exist.
          </p>
          <Link href="/">
            <Button className="bg-gold-500 hover:bg-gold-600">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Browse Schools
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  const inComparison = isInComparison(school.id);

  return (
    <div className="pb-20 bg-white">
      <Container>
        <div className="py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative mb-8 overflow-hidden rounded-xl border bg-card text-card-foreground transition-all duration-300">
              <div className="relative aspect-[21/9]">
                <Image
                  src={school.image_url}
                  alt={school.name}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h1 className="mb-3 text-4xl font-bold sm:text-5xl">
                    {school.name}
                  </h1>
                  <div className="flex flex-wrap items-center gap-4">
                    <StarRating
                      rating={school.rating}
                      size="lg"
                      className="text-white"
                    />
                    <span className="text-sm opacity-90">
                      {school.review_count} reviews
                    </span>
                    <span className="flex items-center gap-1 text-sm opacity-90">
                      <MapPin className="h-4 w-4" />
                      {school.location_area}
                    </span>
                    {school.established_year && (
                      <span className="flex items-center gap-1 text-sm opacity-90">
                        <Calendar className="h-4 w-4" />
                        Est. {school.established_year}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="mb-8 rounded-xl border bg-card text-card-foreground p-6 transition-all duration-300">
                  <h2 className="mb-4 text-2xl font-bold text-gray-900">
                    About This School
                  </h2>
                  <p className="leading-relaxed text-gray-600">
                    {school.description}
                  </p>
                </div>

                <div className="mb-8">
                  <h2 className="mb-6 text-2xl font-bold text-gray-900">
                    Available Courses
                  </h2>
                  <div className="space-y-4">
                    {school.license_categories?.map((category, index) => (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="overflow-hidden rounded-xl border bg-card text-card-foreground transition-all duration-300"
                      >
                        <div className="p-6">
                          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
                            <div>
                              <LicenseBadge
                                type={category.type}
                                className="mb-2"
                              />
                              <h3 className="text-xl font-bold text-gray-900">
                                {category.name}
                              </h3>
                            </div>
                            <div className="text-right">
                              <PriceDisplay price={category.price} size="lg" />
                              <div className="mt-1 flex items-center gap-1 text-sm text-gray-600">
                                <Clock className="h-3 w-3" />
                                {category.duration}
                              </div>
                            </div>
                          </div>

                          <p className="mb-4 text-gray-600">
                            {category.description}
                          </p>

                          {category.features &&
                            category.features.length > 0 && (
                              <div className="space-y-2">
                                <h4 className="text-sm font-semibold text-gray-900">
                                  What's Included:
                                </h4>
                                <div className="grid gap-2 sm:grid-cols-2">
                                  {category.features.map((feature, i) => (
                                    <div
                                      key={i}
                                      className="flex items-start gap-2"
                                    >
                                      <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-gold-500" />
                                      <span className="text-sm text-gray-600">
                                        {feature}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="sticky top-24 space-y-6">
                  <div className="rounded-xl border bg-card text-card-foreground p-6 transition-all duration-300">
                    <h3 className="mb-4 text-lg font-bold text-gray-900">
                      Contact Information
                    </h3>
                    <div className="space-y-4">
                      <a
                        href={`tel:${school.phone}`}
                        className="flex items-center gap-3 text-gray-600 transition-colors hover:text-gold-600"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-50">
                          <Phone className="h-5 w-5 text-gold-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Phone</div>
                          <div className="font-medium text-gray-900">
                            {school.phone}
                          </div>
                        </div>
                      </a>

                      <a
                        href={`mailto:${school.email}`}
                        className="flex items-center gap-3 text-gray-600 transition-colors hover:text-gold-600"
                      >
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-50">
                          <Mail className="h-5 w-5 text-gold-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-gray-500">Email</div>
                          <div className="truncate font-medium text-gray-900">
                            {school.email}
                          </div>
                        </div>
                      </a>

                      {school.website && (
                        <a
                          href={school.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-gray-600 transition-colors hover:text-gold-600"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-50">
                            <Globe className="h-5 w-5 text-gold-600" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Website</div>
                            <div className="font-medium text-gray-900">
                              Visit Website
                            </div>
                          </div>
                        </a>
                      )}

                      <div className="flex items-start gap-3 pt-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-50">
                          <MapPin className="h-5 w-5 text-gold-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Address</div>
                          <div className="font-medium text-gray-900">
                            {school.address}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-50">
                          <Clock className="h-5 w-5 text-gold-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">
                            Operating Hours
                          </div>
                          <div className="font-medium text-gray-900">
                            {school.operating_hours}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleCompareToggle}
                    variant={inComparison ? "outline" : "default"}
                    className={
                      inComparison
                        ? "w-full"
                        : "w-full bg-gold-500 hover:bg-gold-600"
                    }
                  >
                    <GitCompare className="mr-2 h-4 w-4" />
                    {inComparison
                      ? "Remove from Comparison"
                      : "Add to Comparison"}
                  </Button>

                  {school.coordinates && (
                    <div className="overflow-hidden rounded-xl border bg-card text-card-foreground transition-all duration-300">
                      <div className="aspect-square w-full bg-gray-200">
                        <iframe
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          style={{ border: 0 }}
                          src={`https://www.google.com/maps?q=${school.coordinates.lat},${school.coordinates.lng}&output=embed`}
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}
