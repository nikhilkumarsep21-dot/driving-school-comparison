"use client";

import { useEffect, useState } from "react";
import { useComparisonStore } from "@/store/comparison-store";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/ui/star-rating";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  X,
  GraduationCap,
  BookOpen,
  Clock,
  Users,
  DollarSign,
  FileText,
  CheckCircle2,
  MessageSquare,
} from "lucide-react";
import {
  SchoolWithCourses,
  LicenseType,
  CourseLevelWithRelations,
} from "@/lib/types";
import { motion } from "framer-motion";
import { EnquiryModal } from "@/components/enquiry-modal";

export default function ComparePage() {
  const {
    schools,
    removeSchool,
    detailedSchools,
    loadSchoolDetails,
    getSchoolDetails,
  } = useComparisonStore();
  const [selectedLicenseType, setSelectedLicenseType] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [enquirySchoolId, setEnquirySchoolId] = useState<string | null>(null);
  const [enquirySchoolName, setEnquirySchoolName] = useState<string | null>(
    null
  );
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  const handleImageError = (schoolId: string) => {
    setImageErrors((prev) => ({ ...prev, [schoolId]: true }));
  };

  const handleEnquireClick = (schoolId: string, schoolName: string) => {
    setEnquirySchoolId(schoolId);
    setEnquirySchoolName(schoolName);
    setIsEnquiryModalOpen(true);
  };

  useEffect(() => {
    const loadAllDetails = async () => {
      setIsLoading(true);
      const loadPromises = schools.map((school) => {
        const existing = getSchoolDetails(school.id);
        if (!existing) {
          return loadSchoolDetails(school.id);
        }
        return Promise.resolve();
      });
      await Promise.all(loadPromises);
      setIsLoading(false);
    };

    if (schools.length > 0) {
      loadAllDetails();
    } else {
      setIsLoading(false);
    }
  }, [schools]);

  const schoolsWithDetails: SchoolWithCourses[] = schools
    .map((school) => getSchoolDetails(school.id))
    .filter((school): school is SchoolWithCourses => school !== undefined);

  if (schools.length === 0) {
    return (
      <Container>
        <div className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-gold-100 to-gold-200"
          >
            <GraduationCap className="h-12 w-12 text-gold-600" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-4 text-3xl font-bold text-gray-900"
          >
            No Schools to Compare
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 max-w-md text-gray-600"
          >
            Start by adding schools from the schools page to see a side-by-side
            comparison.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/schools">
              <Button className="bg-gold-500 hover:bg-gold-600">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Browse Schools
              </Button>
            </Link>
          </motion.div>
        </div>
      </Container>
    );
  }

  const allLicenseTypes: Map<string, LicenseType> = new Map();
  schoolsWithDetails.forEach((school) => {
    school.course_levels?.forEach((course) => {
      if (course.license_type) {
        allLicenseTypes.set(course.license_type.id, course.license_type);
      }
    });
  });

  const licenseTypesArray = Array.from(allLicenseTypes.values());

  // Get filtered courses for the selected license type
  const getFilteredCourses = (school: SchoolWithCourses) => {
    return selectedLicenseType
      ? school.course_levels?.filter(
          (course) => course.license_type_id === selectedLicenseType
        )
      : school.course_levels;
  };

  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-gold-600 to-gold-700 py-12 sm:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:24px_24px] opacity-20" />
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center pt-12">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Compare Schools
            </h1>
            <p className="text-lg text-gold-100">
              Side-by-side comparison of {schoolsWithDetails.length}{" "}
              {schoolsWithDetails.length === 1 ? "school" : "schools"}
            </p>
          </div>
        </Container>
      </section>

      <div className="pb-20">
        <Container>
          <div className="py-8">
            {licenseTypesArray.length > 0 && (
              <div className="mb-8">
                <h3 className="mb-4 text-sm font-semibold text-gray-700">
                  Filter by License Type
                </h3>
                <div className="flex flex-wrap gap-2">
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
                  {licenseTypesArray.map((licenseType) => (
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
              </div>
            )}

            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full border-collapse min-w-[800px] border-l border-t border-gray-200">
                <thead>
                  <tr>
                    <th className="sticky left-0 z-20 bg-white border-b border-r border-gray-200 p-6 text-left">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                        Comparison Criteria
                      </h3>
                    </th>
                    {schoolsWithDetails.map((school, schoolIndex) => (
                      <th
                        key={school.id}
                        className="bg-white border-b border-r border-gray-200 p-6 min-w-[320px]"
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: schoolIndex * 0.1 }}
                          className="relative"
                        >
                          <button
                            onClick={() => removeSchool(school.id)}
                            className="absolute right-0 top-0 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all hover:bg-red-500 hover:text-white hover:scale-110"
                          >
                            <X className="h-4 w-4" />
                          </button>

                          <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4 bg-gradient-to-br from-gold-100 to-sand-100">
                            {!imageErrors[school.id] ? (
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
                                onError={() => handleImageError(school.id)}
                              />
                            ) : (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <GraduationCap className="h-24 w-24 text-gold-300" />
                              </div>
                            )}
                          </div>

                          <div className="space-y-3">
                            <h3 className="text-lg font-bold text-gray-900">
                              {school.name}
                            </h3>
                            <div className="flex items-center justify-between gap-2 w-full px-1">
                              <div className="flex items-center gap-1">
                                <StarRating rating={school.rating} size="sm" />
                                <span className="font-semibold text-gray-900 text-xs">
                                  {school.rating}
                                </span>
                              </div>
                              <span className="text-sm text-gray-600">
                                ({school.review_count})
                              </span>
                            </div>
                            <div className="space-y-2">
                              <Link href={`/school/${school.id}`}>
                                <Button className="w-full bg-gold-500 hover:bg-gold-600">
                                  View Details
                                </Button>
                              </Link>
                              <Button
                                variant="outline"
                                className="w-full border-gold-200 text-gold-700 hover:bg-gold-50"
                                onClick={() =>
                                  handleEnquireClick(school.id, school.name)
                                }
                              >
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Enquire Now
                              </Button>
                            </div>
                          </div>
                        </motion.div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {selectedLicenseType ? (
                    <>
                      {/* Get all unique courses and their packages */}
                      {(() => {
                        // First, collect all courses by name
                        const courseMap = new Map<
                          string,
                          CourseLevelWithRelations
                        >();
                        schoolsWithDetails.forEach((school) => {
                          const filteredCourses = getFilteredCourses(school);
                          filteredCourses?.forEach((course) => {
                            if (!courseMap.has(course.name)) {
                              courseMap.set(course.name, course);
                            }
                          });
                        });

                        // For each course, collect all unique package combinations
                        return Array.from(courseMap.values()).flatMap(
                          (referenceCourse) => {
                            // Collect all packages across all schools for this course
                            const allPackages: Array<{
                              shiftType: string;
                              packageName: string;
                              key: string;
                            }> = [];

                            schoolsWithDetails.forEach((school) => {
                              const schoolCourse = getFilteredCourses(
                                school
                              )?.find((c) => c.name === referenceCourse.name);

                              schoolCourse?.shifts?.forEach((shift) => {
                                shift.packages?.forEach((pkg) => {
                                  const key = `${shift.type}-${pkg.name}`;
                                  if (!allPackages.find((p) => p.key === key)) {
                                    allPackages.push({
                                      shiftType: shift.type,
                                      packageName: pkg.name,
                                      key,
                                    });
                                  }
                                });
                              });
                            });

                            return [
                              // Course Header Row
                              <tr key={`${referenceCourse.id}-header`}>
                                <td className="sticky left-0 z-10 bg-gradient-to-r from-gold-50 to-white border-t border-r border-gray-200 p-6">
                                  <div>
                                    <h3 className="font-bold text-gray-900 text-lg mb-1">
                                      {referenceCourse.name}
                                    </h3>
                                    {referenceCourse.description && (
                                      <p className="text-xs text-gray-600 mt-1">
                                        {referenceCourse.description}
                                      </p>
                                    )}
                                  </div>
                                </td>
                                {schoolsWithDetails.map((school) => {
                                  const schoolCourse = getFilteredCourses(
                                    school
                                  )?.find(
                                    (c) => c.name === referenceCourse.name
                                  );

                                  return (
                                    <td
                                      key={school.id}
                                      className="bg-white border-t border-r border-gray-200 p-6"
                                    >
                                      {schoolCourse ? (
                                        <div className="flex flex-wrap gap-3 text-sm text-gray-600 justify-center">
                                          {schoolCourse.duration_hours && (
                                            <div className="flex items-center gap-1">
                                              <Clock className="h-4 w-4 text-gold-600" />
                                              <span>
                                                {schoolCourse.duration_hours}h
                                              </span>
                                            </div>
                                          )}
                                          {schoolCourse.shifts &&
                                            schoolCourse.shifts.length > 0 && (
                                              <div className="flex items-center gap-1">
                                                <Users className="h-4 w-4 text-gold-600" />
                                                <span>
                                                  {schoolCourse.shifts.length}{" "}
                                                  shifts
                                                </span>
                                              </div>
                                            )}
                                        </div>
                                      ) : (
                                        <p className="text-center text-gray-400 text-sm">
                                          Not available
                                        </p>
                                      )}
                                    </td>
                                  );
                                })}
                              </tr>,

                              // Package Rows - One row per unique package combination
                              ...allPackages.map((packageInfo) => (
                                <tr
                                  key={`${referenceCourse.id}-${packageInfo.key}`}
                                >
                                  <td className="sticky left-0 z-10 bg-white border-t border-r border-gray-200 p-6">
                                    <div>
                                      <div className="flex items-center gap-2 mb-1">
                                        <div className="h-6 w-0.5 bg-gold-500 rounded-full" />
                                        <span className="text-xs font-semibold text-gold-700">
                                          {packageInfo.shiftType} Shift
                                        </span>
                                      </div>
                                      <h4 className="font-bold text-gray-900">
                                        {packageInfo.packageName}
                                      </h4>
                                    </div>
                                  </td>
                                  {schoolsWithDetails.map((school) => {
                                    const schoolCourse = getFilteredCourses(
                                      school
                                    )?.find(
                                      (c) => c.name === referenceCourse.name
                                    );

                                    // Find matching package
                                    let matchingPackage = null;
                                    let matchingShift = null;

                                    if (schoolCourse) {
                                      for (const shift of schoolCourse.shifts ||
                                        []) {
                                        const pkg = shift.packages?.find(
                                          (p) =>
                                            `${shift.type}-${p.name}` ===
                                            packageInfo.key
                                        );
                                        if (pkg) {
                                          matchingPackage = pkg;
                                          matchingShift = shift;
                                          break;
                                        }
                                      }
                                    }

                                    return (
                                      <td
                                        key={school.id}
                                        className="bg-white border-t border-r border-gray-200 p-6"
                                      >
                                        {matchingPackage && matchingShift ? (
                                          <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="group relative bg-white border border-gray-200 rounded-lg hover:border-gold-300 hover:shadow-md transition-all duration-300 overflow-hidden"
                                          >
                                            {/* Price Header */}
                                            <div className="bg-gradient-to-r from-gold-50/50 via-white to-transparent px-4 py-3 border-b border-gray-100">
                                              <div className="text-center">
                                                <div className="text-xs text-gray-500 font-medium">
                                                  Total Fee
                                                </div>
                                                <div className="text-xl font-bold text-gold-600">
                                                  AED{" "}
                                                  {matchingPackage.fee_aed.toLocaleString()}
                                                </div>
                                              </div>
                                            </div>

                                            {/* Package Details */}
                                            {matchingPackage.details && (
                                              <div className="p-4">
                                                <div className="space-y-4">
                                                  {/* Training Schedule */}
                                                  {(matchingPackage.details
                                                    .class_timings ||
                                                    matchingPackage.details
                                                      .training_days ||
                                                    matchingPackage.details
                                                      .hours_per_week) && (
                                                    <div className="space-y-2">
                                                      <div className="flex items-center gap-2 pb-1.5 border-b border-gray-100">
                                                        <div className="p-1.5 bg-purple-50 rounded-md">
                                                          <Clock className="h-3.5 w-3.5 text-purple-600" />
                                                        </div>
                                                        <h6 className="text-xs font-bold text-gray-900">
                                                          Training Schedule
                                                        </h6>
                                                      </div>
                                                      <div className="space-y-1.5">
                                                        {matchingPackage.details
                                                          .class_timings && (
                                                          <div className="flex items-start gap-1.5 text-xs">
                                                            <span className="text-gray-600 min-w-[120px]">
                                                              Class Timings:
                                                            </span>
                                                            <span className="text-gray-900 font-medium">
                                                              {
                                                                matchingPackage
                                                                  .details
                                                                  .class_timings
                                                              }
                                                            </span>
                                                          </div>
                                                        )}
                                                        {matchingPackage.details
                                                          .training_days && (
                                                          <div className="flex items-start gap-1.5 text-xs">
                                                            <span className="text-gray-600 min-w-[120px]">
                                                              Training Days:
                                                            </span>
                                                            <span className="text-gray-900 font-medium">
                                                              {
                                                                matchingPackage
                                                                  .details
                                                                  .training_days
                                                              }
                                                            </span>
                                                          </div>
                                                        )}
                                                        {matchingPackage.details
                                                          .hours_per_week && (
                                                          <div className="flex items-start gap-1.5 text-xs">
                                                            <span className="text-gray-600 min-w-[120px]">
                                                              Hours Per Week:
                                                            </span>
                                                            <span className="text-gray-900 font-medium">
                                                              {
                                                                matchingPackage
                                                                  .details
                                                                  .hours_per_week
                                                              }
                                                            </span>
                                                          </div>
                                                        )}
                                                      </div>
                                                    </div>
                                                  )}

                                                  {/* Fee Details */}
                                                  {matchingPackage.details
                                                    .training_fee_per_hour && (
                                                    <div className="space-y-2">
                                                      <div className="flex items-center gap-2 pb-1.5 border-b border-gray-100">
                                                        <div className="p-1.5 bg-gold-50 rounded-md">
                                                          <DollarSign className="h-3.5 w-3.5 text-gold-600" />
                                                        </div>
                                                        <h6 className="text-xs font-bold text-gray-900">
                                                          Fee Details
                                                        </h6>
                                                      </div>
                                                      <div className="space-y-1.5">
                                                        <div className="flex items-start justify-between gap-2 text-xs">
                                                          <span className="text-gray-600">
                                                            Training Fee Per
                                                            Hour:
                                                          </span>
                                                          <span className="text-gray-900 font-medium">
                                                            AED{" "}
                                                            {
                                                              matchingPackage
                                                                .details
                                                                .training_fee_per_hour
                                                            }
                                                          </span>
                                                        </div>
                                                      </div>
                                                    </div>
                                                  )}

                                                  {/* VAT Info */}
                                                  {matchingPackage.details
                                                    .vat && (
                                                    <div className="space-y-2">
                                                      <div className="flex items-center gap-2 pb-1.5 border-b border-gray-100">
                                                        <div className="p-1.5 bg-blue-50 rounded-md">
                                                          <FileText className="h-3.5 w-3.5 text-blue-600" />
                                                        </div>
                                                        <h6 className="text-xs font-bold text-gray-900">
                                                          VAT Information
                                                        </h6>
                                                      </div>
                                                      <div className="text-xs text-gray-700">
                                                        {
                                                          matchingPackage
                                                            .details.vat
                                                        }
                                                      </div>
                                                    </div>
                                                  )}

                                                  {/* Notes */}
                                                  {matchingPackage.details
                                                    .notes && (
                                                    <div className="space-y-2">
                                                      <div className="flex items-center gap-2 pb-1.5 border-b border-gray-100">
                                                        <div className="p-1.5 bg-green-50 rounded-md">
                                                          <BookOpen className="h-3.5 w-3.5 text-green-600" />
                                                        </div>
                                                        <h6 className="text-xs font-bold text-gray-900">
                                                          Additional Notes
                                                        </h6>
                                                      </div>
                                                      <div className="text-xs text-gray-700">
                                                        {
                                                          matchingPackage
                                                            .details.notes
                                                        }
                                                      </div>
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            )}

                                            {/* Bottom Accent Bar */}
                                            <div className="h-0.5 bg-gradient-to-r from-transparent via-gold-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                          </motion.div>
                                        ) : (
                                          <p className="text-center text-gray-400 text-sm py-4">
                                            Not available
                                          </p>
                                        )}
                                      </td>
                                    );
                                  })}
                                </tr>
                              )),
                            ];
                          }
                        );
                      })()}
                    </>
                  ) : (
                    <tr>
                      <td
                        colSpan={schoolsWithDetails.length + 1}
                        className="border-t border-gray-200"
                      >
                        <div className="py-16 text-center bg-blue-50">
                          <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                          <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Select a License Type
                          </h3>
                          <p className="text-gray-600 max-w-2xl mx-auto">
                            Choose a specific license type above to compare
                            detailed course information, pricing, and packages
                            across schools.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>

                <tfoot>
                  <tr>
                    <td
                      colSpan={schoolsWithDetails.length + 1}
                      className="border-t border-gray-200"
                    ></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </Container>
      </div>

      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => {
          setIsEnquiryModalOpen(false);
          setEnquirySchoolId(null);
          setEnquirySchoolName(null);
        }}
        schoolId={enquirySchoolId || undefined}
        schoolName={enquirySchoolName || undefined}
      />
    </div>
  );
}
