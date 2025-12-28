"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import { Skeleton } from "@/components/ui/skeleton";
import { useComparisonStore } from "@/store/comparison-store";
import {
  SchoolWithCourses,
  CourseLevelWithRelations,
  BranchLocation,
} from "@/lib/types";
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
  DollarSign,
  FileText,
  BookOpen,
  Users,
  ChevronDown,
  ChevronUp,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { EnquiryModal } from "@/components/enquiry-modal";

export default function SchoolDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [school, setSchool] = useState<SchoolWithCourses | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedLicenseType, setSelectedLicenseType] = useState<string | null>(
    null
  );
  const [expandedCourses, setExpandedCourses] = useState<Set<string>>(
    new Set()
  );
  const [imageError, setImageError] = useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const { addSchool, removeSchool, isInComparison, canAddMore } =
    useComparisonStore();

  const toggleCourseExpansion = (courseId: string) => {
    setExpandedCourses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const fetchSchool = async () => {
      try {
        const response = await fetch(`/api/schools/${slug}`);
        const data = await response.json();
        setSchool(data.school);

        if (
          data.school?.course_levels &&
          data.school.course_levels.length > 0
        ) {
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
          <h1 className="font-heading mb-4 text-3xl font-bold text-gray-900">
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
    if (
      course.license_type &&
      !acc.find((lt) => lt.id === course.license_type!.id)
    ) {
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
                {!imageError ? (
                  <Image
                    src={
                      school.logo_url ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        school.name
                      )}&background=f59e0b&color=fff&size=400`
                    }
                    alt={school.name}
                    fill
                    className="object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gold-100 to-sand-100">
                    <GraduationCap className="h-16 w-16 text-gold-300" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h1 className="font-heading text-4xl font-bold text-white mb-3">
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
              <div className="flex gap-3">
                <Button
                  onClick={() => setIsEnquiryModalOpen(true)}
                  className="bg-white text-gold-700 hover:bg-white/90"
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Enquire Now
                </Button>
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
            </div>
          </motion.div>
        </Container>
      </div>

      <Container>
        <div className="py-12 space-y-12">
          {school.course_levels && school.course_levels.length > 0 && (
            <section>
              <h2 className="font-heading text-2xl font-bold text-gray-900 mb-6">
                Course Offerings
              </h2>
              {uniqueLicenseTypes && uniqueLicenseTypes.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                  <Button
                    variant={
                      selectedLicenseType === null ? "default" : "outline"
                    }
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
                        selectedLicenseType === licenseType.id
                          ? "default"
                          : "outline"
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
              <div className="space-y-6">
                {filteredCourses?.map((course: CourseLevelWithRelations) => {
                  const isExpanded = expandedCourses.has(course.id);
                  const hasPackages = course.shifts?.some(
                    (shift) => shift.packages && shift.packages.length > 0
                  );

                  // Calculate price range across all packages
                  const allPrices =
                    course.shifts
                      ?.flatMap(
                        (shift) =>
                          shift.packages?.map((pkg) => pkg.fee_aed) || []
                      )
                      .filter((price) => price != null) || [];
                  const minPrice =
                    allPrices.length > 0 ? Math.min(...allPrices) : null;
                  const maxPrice =
                    allPrices.length > 0 ? Math.max(...allPrices) : null;

                  return (
                    <motion.div
                      key={course.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      {/* Course Header */}
                      <div className="p-6 bg-gradient-to-r from-gold-50 to-white">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-heading text-xl font-bold text-gray-900">
                                {course.name}
                              </h3>
                              <span className="text-xs px-3 py-1 bg-gold-100 text-gold-700 rounded-full font-semibold">
                                {course.license_type?.name}
                              </span>
                            </div>
                            {course.description && (
                              <p className="text-sm text-gray-600 mb-3">
                                {course.description}
                              </p>
                            )}
                            <div className="flex items-center gap-6 text-sm text-gray-600">
                              {course.duration_hours && (
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-gold-600" />
                                  <span>{course.duration_hours} hours</span>
                                </div>
                              )}
                              {course.shifts && course.shifts.length > 0 && (
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-gold-600" />
                                  <span>
                                    {course.shifts.length} shift
                                    {course.shifts.length > 1 ? "s" : ""}{" "}
                                    available
                                  </span>
                                </div>
                              )}
                              {minPrice !== null && maxPrice !== null && (
                                <div className="flex items-center gap-2 font-semibold text-gold-700">
                                  <DollarSign className="h-4 w-4" />
                                  <span>
                                    AED {minPrice.toLocaleString()}
                                    {minPrice !== maxPrice &&
                                      ` - ${maxPrice.toLocaleString()}`}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          {hasPackages && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleCourseExpansion(course.id)}
                              className="ml-4"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="h-4 w-4 mr-2" />
                                  Hide Details
                                </>
                              ) : (
                                <>
                                  <ChevronDown className="h-4 w-4 mr-2" />
                                  View Packages
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Shifts and Packages - Expanded Content */}
                      {isExpanded &&
                        course.shifts &&
                        course.shifts.length > 0 && (
                          <div className="p-6 border-t bg-white">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {course.shifts.flatMap(
                                (shift) =>
                                  shift.packages?.map((pkg) => (
                                    <motion.div
                                      key={pkg.id}
                                      initial={{ opacity: 0, y: 20 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.3 }}
                                      className="group relative bg-white border border-gray-200 rounded-lg hover:border-gold-300 hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col"
                                    >
                                      {/* Header Section with Price */}
                                      <div className="bg-gradient-to-r from-gold-50/50 via-white to-transparent px-4 py-3 border-b border-gray-100">
                                        <div className="flex items-center justify-between gap-4">
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                              <div className="h-6 w-0.5 bg-gold-500 rounded-full" />
                                              <span className="text-xs font-semibold text-gold-700">
                                                {shift.type} Shift
                                              </span>
                                            </div>
                                            <h5 className="font-heading text-lg font-bold text-gray-900">
                                              {pkg.name}
                                            </h5>
                                            {shift.description && (
                                              <p className="text-xs text-gray-600 mt-1">
                                                {shift.description}
                                              </p>
                                            )}
                                          </div>
                                          <div className="text-right">
                                            <div className="text-xs text-gray-500 font-medium">
                                              Total Fee
                                            </div>
                                            <div className="text-xl font-bold text-gold-600">
                                              AED {pkg.fee_aed.toLocaleString()}
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Package Details */}
                                      {pkg.details && (
                                        <div className="p-4">
                                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            {/* Documents Required */}
                                            {pkg.details.documents_required &&
                                              Array.isArray(
                                                pkg.details.documents_required
                                              ) &&
                                              pkg.details.documents_required
                                                .length > 0 && (
                                                <div className="space-y-2">
                                                  <div className="flex items-center gap-2 pb-1.5 border-b border-gray-100">
                                                    <div className="p-1.5 bg-blue-50 rounded-md">
                                                      <FileText className="h-3.5 w-3.5 text-blue-600" />
                                                    </div>
                                                    <h6 className="font-heading text-xs font-bold text-gray-900">
                                                      Documents Required
                                                    </h6>
                                                  </div>
                                                  <div className="space-y-1.5">
                                                    {pkg.details.documents_required.map(
                                                      (
                                                        doc: string,
                                                        idx: number
                                                      ) => (
                                                        <div
                                                          key={idx}
                                                          className="flex items-start gap-1.5 text-xs text-gray-700"
                                                        >
                                                          <CheckCircle2 className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                                          <span className="leading-relaxed">
                                                            {doc}
                                                          </span>
                                                        </div>
                                                      )
                                                    )}
                                                  </div>
                                                </div>
                                              )}

                                            {/* Course Details */}
                                            {pkg.details.course_details &&
                                              typeof pkg.details
                                                .course_details === "object" &&
                                              Object.keys(
                                                pkg.details.course_details
                                              ).length > 0 && (
                                                <div className="space-y-2">
                                                  <div className="flex items-center gap-2 pb-1.5 border-b border-gray-100">
                                                    <div className="p-1.5 bg-purple-50 rounded-md">
                                                      <BookOpen className="h-3.5 w-3.5 text-purple-600" />
                                                    </div>
                                                    <h6 className="font-heading text-xs font-bold text-gray-900">
                                                      Course Details
                                                    </h6>
                                                  </div>
                                                  <div className="space-y-1.5">
                                                    {Object.entries(
                                                      pkg.details.course_details
                                                    ).map(([key, value]) => {
                                                      const displayValue =
                                                        typeof value ===
                                                        "object"
                                                          ? JSON.stringify(
                                                              value,
                                                              null,
                                                              2
                                                            )
                                                          : String(value);
                                                      return (
                                                        <div
                                                          key={key}
                                                          className="text-xs"
                                                        >
                                                          <span className="font-semibold text-gray-700 capitalize">
                                                            {key.replace(
                                                              /_/g,
                                                              " "
                                                            )}
                                                            :
                                                          </span>{" "}
                                                          <span className="text-gray-600 whitespace-pre-wrap">
                                                            {displayValue}
                                                          </span>
                                                        </div>
                                                      );
                                                    })}
                                                  </div>
                                                </div>
                                              )}

                                            {/* Lecture Details */}
                                            {pkg.details.lecture_details &&
                                              typeof pkg.details
                                                .lecture_details === "object" &&
                                              Object.keys(
                                                pkg.details.lecture_details
                                              ).length > 0 && (
                                                <div className="space-y-2">
                                                  <div className="flex items-center gap-2 pb-1.5 border-b border-gray-100">
                                                    <div className="p-1.5 bg-green-50 rounded-md">
                                                      <GraduationCap className="h-3.5 w-3.5 text-green-600" />
                                                    </div>
                                                    <h6 className="font-heading text-xs font-bold text-gray-900">
                                                      Lecture Details
                                                    </h6>
                                                  </div>
                                                  <div className="space-y-1.5">
                                                    {Object.entries(
                                                      pkg.details
                                                        .lecture_details
                                                    ).map(([key, value]) => {
                                                      const displayValue =
                                                        typeof value ===
                                                        "object"
                                                          ? JSON.stringify(
                                                              value,
                                                              null,
                                                              2
                                                            )
                                                          : String(value);
                                                      return (
                                                        <div
                                                          key={key}
                                                          className="text-xs"
                                                        >
                                                          <span className="font-semibold text-gray-700 capitalize">
                                                            {key.replace(
                                                              /_/g,
                                                              " "
                                                            )}
                                                            :
                                                          </span>{" "}
                                                          <span className="text-gray-600 whitespace-pre-wrap">
                                                            {displayValue}
                                                          </span>
                                                        </div>
                                                      );
                                                    })}
                                                  </div>
                                                </div>
                                              )}

                                            {/* Fee Breakdown */}
                                            {pkg.details.fee_breakdown &&
                                              typeof pkg.details
                                                .fee_breakdown === "object" &&
                                              Object.keys(
                                                pkg.details.fee_breakdown
                                              ).length > 0 && (
                                                <div className="space-y-2">
                                                  <div className="flex items-center gap-2 pb-1.5 border-b border-gray-100">
                                                    <div className="p-1.5 bg-gold-50 rounded-md">
                                                      <DollarSign className="h-3.5 w-3.5 text-gold-600" />
                                                    </div>
                                                    <h6 className="font-heading text-xs font-bold text-gray-900">
                                                      Fee Breakdown
                                                    </h6>
                                                  </div>
                                                  <div className="space-y-1.5">
                                                    {Object.entries(
                                                      pkg.details.fee_breakdown
                                                    ).map(([key, value]) => (
                                                      <div
                                                        key={key}
                                                        className="flex justify-between items-center text-xs"
                                                      >
                                                        <span className="text-gray-600 capitalize">
                                                          {key.replace(
                                                            /_/g,
                                                            " "
                                                          )}
                                                        </span>
                                                        <span className="font-bold text-gray-900">
                                                          AED {String(value)}
                                                        </span>
                                                      </div>
                                                    ))}
                                                  </div>
                                                </div>
                                              )}
                                          </div>

                                          {/* Notes Section - Full Width Below */}
                                          {pkg.details.notes && (
                                            <div className="mt-4 pt-4 border-t border-gray-100">
                                              <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-md p-3">
                                                <div className="flex items-start gap-2">
                                                  <FileText className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                                                  <div>
                                                    <p className="text-xs font-semibold text-amber-900 mb-0.5">
                                                      Important Note
                                                    </p>
                                                    <p className="text-xs text-amber-800 leading-relaxed">
                                                      {pkg.details.notes}
                                                    </p>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          )}

                                          {/* Any Other Custom Fields */}
                                          {(() => {
                                            const knownKeys = [
                                              "documents_required",
                                              "course_details",
                                              "lecture_details",
                                              "fee_breakdown",
                                              "notes",
                                            ];
                                            const otherKeys = Object.keys(
                                              pkg.details || {}
                                            ).filter(
                                              (key) => !knownKeys.includes(key)
                                            );

                                            if (
                                              otherKeys.length > 0 &&
                                              pkg.details
                                            ) {
                                              return (
                                                <div className="mt-4 pt-4 border-t border-gray-100">
                                                  <div className="space-y-2">
                                                    <div className="flex items-center gap-2 pb-1.5 border-b border-gray-100">
                                                      <div className="p-1.5 bg-gray-50 rounded-md">
                                                        <FileText className="h-3.5 w-3.5 text-gray-600" />
                                                      </div>
                                                      <h6 className="font-heading text-xs font-bold text-gray-900">
                                                        Additional Information
                                                      </h6>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                                      {otherKeys.map((key) => {
                                                        const value =
                                                          pkg.details![key];
                                                        const displayValue =
                                                          typeof value ===
                                                          "object"
                                                            ? JSON.stringify(
                                                                value,
                                                                null,
                                                                2
                                                              )
                                                            : String(value);
                                                        return (
                                                          <div
                                                            key={key}
                                                            className="text-xs"
                                                          >
                                                            <span className="font-semibold text-gray-700 capitalize">
                                                              {key.replace(
                                                                /_/g,
                                                                " "
                                                              )}
                                                              :
                                                            </span>{" "}
                                                            <span className="text-gray-600 whitespace-pre-wrap">
                                                              {displayValue}
                                                            </span>
                                                          </div>
                                                        );
                                                      })}
                                                    </div>
                                                  </div>
                                                </div>
                                              );
                                            }
                                            return null;
                                          })()}
                                        </div>
                                      )}

                                      {/* Bottom Accent Bar */}
                                      <div className="h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    </motion.div>
                                  )) || []
                              )}
                            </div>
                          </div>
                        )}

                      {/* Summary view when collapsed */}
                      {!isExpanded &&
                        course.shifts &&
                        course.shifts.length > 0 && (
                          <div className="px-6 pb-6">
                            <div className="flex flex-wrap gap-2">
                              {course.shifts.map((shift) => (
                                <div
                                  key={shift.id}
                                  className="flex items-center gap-2 text-sm bg-white border rounded-full px-3 py-1"
                                >
                                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                                  <span className="text-gray-700">
                                    {shift.type}
                                  </span>
                                  {shift.packages &&
                                    shift.packages.length > 0 && (
                                      <span className="text-gray-500 text-xs">
                                        ({shift.packages.length} package
                                        {shift.packages.length > 1 ? "s" : ""})
                                      </span>
                                    )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                    </motion.div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </Container>

      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        schoolId={school.id}
        schoolName={school.name}
      />
    </div>
  );
}
