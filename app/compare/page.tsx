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
  Phone,
  Mail,
  MapPin,
  X,
  GraduationCap,
  BookOpen,
} from "lucide-react";
import { SchoolWithCourses, LicenseType } from "@/lib/types";
import { motion } from "framer-motion";

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
                  {licenseTypesArray.map((licenseType) => (
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
                            />
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
                            <Link href={`/school/${school.id}`}>
                              <Button className="w-full bg-gold-500 hover:bg-gold-600">
                                View Details
                              </Button>
                            </Link>
                          </div>
                        </motion.div>
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  <ComparisonRowData
                    label="Locations"
                    schools={schoolsWithDetails}
                    renderCell={(school) => (
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">
                          {school.branch_locations?.length || 0} locations
                        </p>
                        <div className="mt-2 space-y-1">
                          {school.branch_locations?.slice(0, 3).map((location: any) => (
                            <p key={location.id} className="text-sm text-gray-500">
                              {location.city}
                            </p>
                          ))}
                          {(school.branch_locations?.length || 0) > 3 && (
                            <p className="text-sm text-gray-500">
                              +{(school.branch_locations?.length || 0) - 3} more
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  />

                  <ComparisonRowData
                    label="Contact"
                    schools={schoolsWithDetails}
                    renderCell={(school) => (
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">
                          {school.phone || "N/A"}
                        </p>
                        {school.email && (
                          <p className="mt-1 text-sm text-gray-500">{school.email}</p>
                        )}
                      </div>
                    )}
                  />

                  <ComparisonRowData
                    label="Course Offerings"
                    schools={schoolsWithDetails}
                    renderCell={(school) => (
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">
                          {school.course_levels?.length || 0} courses
                        </p>
                        <div className="mt-2 space-y-1">
                          {school.course_levels?.slice(0, 3).map((course: any) => (
                            <p key={course.id} className="text-sm text-gray-500">
                              {course.license_type?.name} - {course.name}
                            </p>
                          ))}
                          {(school.course_levels?.length || 0) > 3 && (
                            <p className="text-sm text-gray-500">
                              +{(school.course_levels?.length || 0) - 3} more
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  />
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

            {selectedLicenseType === null && licenseTypesArray.length > 0 && (
              <div className="mt-8 text-center bg-blue-50 rounded-xl p-8 border border-blue-200">
                <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Select a License Type
                </h3>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  Choose a specific license type above to compare detailed
                  course information, pricing, and packages across schools.
                </p>
              </div>
            )}
          </div>
        </Container>
      </div>
    </div>
  );
}

interface ComparisonRowDataProps {
  label: string;
  schools: any[];
  renderCell: (school: any) => React.ReactNode;
}

function ComparisonRowData({
  label,
  schools,
  renderCell,
}: ComparisonRowDataProps) {
  return (
    <tr>
      <td className="sticky left-0 z-10 bg-white border-t border-r border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900">{label}</h3>
      </td>
      {schools.map((school) => (
        <td
          key={school.id}
          className="bg-white border-t border-r border-gray-200 p-6"
        >
          {renderCell(school)}
        </td>
      ))}
    </tr>
  );
}
