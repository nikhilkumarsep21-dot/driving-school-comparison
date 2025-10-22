"use client";

import { useComparisonStore } from "@/store/comparison-store";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StarRating } from "@/components/ui/star-rating";
import { LicenseBadge } from "@/components/ui/license-badge";
import { PriceDisplay } from "@/components/ui/price-display";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Phone,
  Mail,
  Globe,
  MapPin,
  Clock,
  X,
  GraduationCap,
  Check,
  Minus,
} from "lucide-react";
import { LicenseCategory } from "@/lib/types";
import { motion } from "framer-motion";

export default function ComparePage() {
  const { schools, removeSchool } = useComparisonStore();

  const getAllLicenseTypes = () => {
    const types = new Set<string>();
    schools.forEach((school) => {
      school.license_categories?.forEach((cat) => types.add(cat.type));
    });
    return Array.from(types);
  };

  const licenseTypes = getAllLicenseTypes();

  if (schools.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Container>
          <div className="flex flex-col items-center justify-center py-16 text-center">
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
              Start by adding schools from the homepage to see a side-by-side
              comparison.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Link href="/">
                <Button className="bg-gold-500 hover:bg-gold-600">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Browse Schools
                </Button>
              </Link>
            </motion.div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-gold-600 to-gold-700 pt-2 py-12 sm:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:24px_24px] opacity-20" />
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center pt-12">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Compare Driving Schools
            </h1>
            <p className="text-lg text-gold-100">
              Side-by-side comparison of {schools.length}{" "}
              {schools.length === 1 ? "school" : "schools"}
            </p>
          </div>
        </Container>
      </section>

      <div className="pb-20">
        <Container>
          <div className="py-8">
            <div className="overflow-x-auto -mx-4 px-4">
              <table className="w-full border-collapse min-w-[800px] border-l border-gray-200">
                <thead>
                  <tr>
                    <th className="sticky left-0 z-20 bg-white border-b border-r border-gray-200 p-6 text-left">
                      <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                        Comparison Criteria
                      </h3>
                    </th>
                    {schools.map((school, schoolIndex) => (
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

                          <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4">
                            <Image
                              src={school.image_url}
                              alt={school.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="space-y-3">
                            <h3 className="text-lg font-bold text-gray-900">
                              {school.name}
                            </h3>
                            <div className="flex items-center justify-center gap-2">
                              <StarRating rating={school.rating} size="sm" />
                              <span className="text-sm text-gray-600">
                                {school.rating} ({school.review_count})
                              </span>
                            </div>
                            <Link href={`/school/${school.slug}`}>
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
                    label="Location"
                    schools={schools}
                    renderCell={(school) => (
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">
                          {school.location_area}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {school.address}
                        </p>
                      </div>
                    )}
                  />

                  <ComparisonRowData
                    label="Operating Hours"
                    schools={schools}
                    renderCell={(school) => (
                      <p className="text-center font-medium text-gray-900">
                        {school.operating_hours}
                      </p>
                    )}
                  />

                  <ComparisonRowData
                    label="License Types"
                    schools={schools}
                    renderCell={(school) => (
                      <div className="flex flex-wrap justify-center gap-2">
                        {school.license_categories?.map(
                          (cat: LicenseCategory) => (
                            <LicenseBadge key={cat.id} type={cat.type} />
                          )
                        )}
                      </div>
                    )}
                  />

                  {licenseTypes.map((type) => (
                    <tr key={type}>
                      <td className="sticky left-0 z-10 bg-white border-t border-r border-gray-200 p-6">
                        <div>
                          <LicenseBadge type={type as any} />
                          <p className="mt-2 text-xs text-gray-500">
                            Pricing & Details
                          </p>
                        </div>
                      </td>
                      {schools.map((school) => {
                        const category = school.license_categories?.find(
                          (cat) => cat.type === type
                        );
                        return (
                          <td
                            key={school.id}
                            className="bg-white border-t border-r border-gray-200 p-6"
                          >
                            {category ? (
                              <div className="space-y-3">
                                <div className="text-center">
                                  <PriceDisplay
                                    price={category.price}
                                    label=""
                                    className="justify-center text-2xl font-bold text-gray-900"
                                  />
                                  <p className="mt-2 text-sm font-medium text-gray-600">
                                    {category.duration}
                                  </p>
                                </div>
                                {category.features &&
                                  category.features.length > 0 && (
                                    <div className="space-y-2 pt-3">
                                      {category.features
                                        .slice(0, 4)
                                        .map((feature, i) => (
                                          <div
                                            key={i}
                                            className="flex items-start gap-2"
                                          >
                                            <Check className="h-4 w-4 text-gold-600 flex-shrink-0 mt-0.5" />
                                            <span className="text-xs text-gray-700">
                                              {feature}
                                            </span>
                                          </div>
                                        ))}
                                    </div>
                                  )}
                              </div>
                            ) : (
                              <div className="flex flex-col items-center justify-center py-4 text-gray-400">
                                <Minus className="h-6 w-6 mb-1" />
                                <span className="text-sm">Not offered</span>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}

                  <ComparisonRowData
                    label="Contact Info"
                    schools={schools}
                    renderCell={(school) => (
                      <div className="space-y-2">
                        <a
                          href={`tel:${school.phone}`}
                          className="flex items-center justify-center gap-2 text-gray-900 hover:text-gold-600 transition-colors"
                        >
                          <Phone className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {school.phone}
                          </span>
                        </a>
                        <a
                          href={`mailto:${school.email}`}
                          className="flex items-center justify-center gap-2 text-gray-900 hover:text-gold-600 transition-colors"
                        >
                          <Mail className="h-4 w-4" />
                          <span className="text-sm font-medium truncate">
                            {school.email}
                          </span>
                        </a>
                        {school.website && (
                          <a
                            href={school.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 text-gray-900 hover:text-gold-600 transition-colors"
                          >
                            <Globe className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              Visit Website
                            </span>
                          </a>
                        )}
                      </div>
                    )}
                  />
                </tbody>
                <tfoot>
                  <tr>
                    <td
                      colSpan={schools.length + 1}
                      className="border-t border-gray-200"
                    ></td>
                  </tr>
                </tfoot>
              </table>
            </div>
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
