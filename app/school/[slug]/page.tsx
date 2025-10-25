"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import { Skeleton } from "@/components/ui/skeleton";
import { useComparisonStore } from "@/store/comparison-store";
import { SchoolWithCourses, CourseLevelWithRelations, BranchLocation } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Phone,
  Mail,
  Globe,
  MapPin,
  Clock,
  GitCompare,
  ExternalLink,
  GraduationCap,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function SchoolDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [school, setSchool] = useState<SchoolWithCourses | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLicenseType, setSelectedLicenseType] = useState<string | null>(null);
  const { addSchool, removeSchool, isInComparison, canAddMore } =
    useComparisonStore();

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        const response = await fetch(`/api/schools/${slug}`);
        const data = await response.json();
        setSchool(data.school);

        if (data.school?.course_levels && data.school.course_levels.length > 0) {
          const firstCourse = data.school.course_levels[0];
          setSelectedLicenseType(firstCourse.license_type_id);
        }
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
        <div className="py-8 space-y-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </Container>
    );
  }

  if (!school) {
    return (
      <Container>
        <div className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
          <GraduationCap className="h-24 w-24 text-gray-300 mb-4" />
          <h1 className="mb-4 text-3xl font-bold text-gray-900">
            School Not Found
          </h1>
          <p className="mb-8 max-w-md text-gray-600">
            The school you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/schools">
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
  const filteredCourses = selectedLicenseType
    ? school.course_levels?.filter(
        (course) => course.license_type_id === selectedLicenseType
      )
    : school.course_levels;

  const uniqueLicenseTypes = school.course_levels?.reduce((acc, course) => {
    if (course.license_type && !acc.find((lt) => lt.id === course.license_type!.id)) {
      acc.push(course.license_type);
    }
    return acc;
  }, [] as Array<{ id: string; name: string }>);

  return (
    <div className="min-h-screen bg-white">
      <div className="relative h-80 bg-gradient-to-br from-gold-600 to-gold-700 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:24px_24px] opacity-20" />
        <Container className="relative h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full"
          >
            <Link
              href="/schools"
              className="inline-flex items-center text-white/90 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Schools
            </Link>
            <div className="flex items-start gap-6">
              <div className="relative w-32 h-32 rounded-xl overflow-hidden bg-white shadow-lg">
                <Image
                  src={
                    school.logo_url ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      school.name
                    )}&background=f59e0b&color=fff&size=256`
                  }
                  alt={school.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-3">
                  {school.name}
                </h1>
                <div className="flex items-center gap-4 text-white/90">
                  <div className="flex items-center gap-2">
                    <StarRating rating={school.rating} size="md" />
                    <span className="font-semibold">{school.rating}</span>
                    <span className="text-white/70">
                      ({school.review_count} reviews)
                    </span>
                  </div>
                </div>
              </div>
              <Button
                onClick={handleCompareToggle}
                className={
                  inComparison
                    ? "bg-white text-gold-700 hover:bg-white/90"
                    : "bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm"
                }
              >
                <GitCompare className="mr-2 h-4 w-4" />
                {inComparison ? "Remove from Compare" : "Add to Compare"}
              </Button>
            </div>
          </motion.div>
        </Container>
      </div>

      <Container>
        <div className="py-12 space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {school.phone && (
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-100">
                    <Phone className="h-5 w-5 text-gold-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <a
                      href={`tel:${school.phone}`}
                      className="text-gray-900 font-medium hover:text-gold-600 transition-colors"
                    >
                      {school.phone}
                    </a>
                  </div>
                </div>
              )}
              {school.email && (
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-100">
                    <Mail className="h-5 w-5 text-gold-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <a
                      href={`mailto:${school.email}`}
                      className="text-gray-900 font-medium hover:text-gold-600 transition-colors"
                    >
                      {school.email}
                    </a>
                  </div>
                </div>
              )}
              {school.website && (
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-100">
                    <Globe className="h-5 w-5 text-gold-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Website</p>
                    <a
                      href={school.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-900 font-medium hover:text-gold-600 transition-colors inline-flex items-center gap-1"
                    >
                      Visit Website
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </section>

          {school.branch_locations && school.branch_locations.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Branch Locations ({school.branch_locations.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {school.branch_locations.map((location: BranchLocation) => (
                  <div
                    key={location.id}
                    className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-bold text-gray-900 mb-3">
                      {location.name}
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gold-600 mt-0.5" />
                        <span className="text-gray-600">{location.address}</span>
                      </div>
                      {location.contact && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gold-600" />
                          <span className="text-gray-600">{location.contact}</span>
                        </div>
                      )}
                      {location.normal_hours && (
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gold-600" />
                          <span className="text-gray-600">{location.normal_hours}</span>
                        </div>
                      )}
                      {location.directions_url && (
                        <a
                          href={location.directions_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-gold-600 hover:text-gold-700 font-medium mt-2"
                        >
                          Get Directions
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {school.course_levels && school.course_levels.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Course Offerings
              </h2>
              {uniqueLicenseTypes && uniqueLicenseTypes.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                  <Button
                    variant={selectedLicenseType === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedLicenseType(null)}
                    className={
                      selectedLicenseType === null
                        ? "bg-gold-500 hover:bg-gold-600"
                        : ""
                    }
                  >
                    All Types
                  </Button>
                  {uniqueLicenseTypes.map((licenseType) => (
                    <Button
                      key={licenseType.id}
                      variant={
                        selectedLicenseType === licenseType.id ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedLicenseType(licenseType.id)}
                      className={
                        selectedLicenseType === licenseType.id
                          ? "bg-gold-500 hover:bg-gold-600"
                          : ""
                      }
                    >
                      {licenseType.name}
                    </Button>
                  ))}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses?.map((course: CourseLevelWithRelations) => (
                  <div
                    key={course.id}
                    className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="font-bold text-gray-900">{course.name}</h3>
                      <span className="text-xs px-2 py-1 bg-gold-100 text-gold-700 rounded">
                        {course.license_type?.name}
                      </span>
                    </div>
                    {course.duration_hours && (
                      <p className="text-sm text-gray-600 mb-3">
                        Duration: {course.duration_hours} hours
                      </p>
                    )}
                    {course.description && (
                      <p className="text-sm text-gray-600 mb-4">
                        {course.description}
                      </p>
                    )}
                    {course.shifts && course.shifts.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-700">
                          Available Shifts:
                        </p>
                        {course.shifts.map((shift) => (
                          <div
                            key={shift.id}
                            className="flex items-center gap-2 text-sm"
                          >
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                            <span className="text-gray-600">{shift.type}</span>
                            {shift.packages && shift.packages.length > 0 && (
                              <span className="text-gray-500">
                                ({shift.packages.length} packages)
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </Container>
    </div>
  );
}
