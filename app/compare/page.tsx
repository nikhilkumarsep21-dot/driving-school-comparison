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
import { Category, Detail } from "@/lib/types";
import { motion } from "framer-motion";

export default function ComparePage() {
  const { schools, removeSchool } = useComparisonStore();

  const branches = schools;

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
            No Branches to Compare
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 max-w-md text-gray-600"
          >
            Start by adding branches from the homepage to see a side-by-side
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
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="py-12 sm:py-16 bg-sand-50">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Compare Branch Locations
            </h1>
            <p className="text-lg text-gray-600">
              Side-by-side comparison of {branches.length}{" "}
              {branches.length === 1 ? "branch" : "branches"}
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
                    {branches.map((branch, branchIndex) => (
                      <th
                        key={branch.id}
                        className="bg-white border-b border-r border-gray-200 p-6 min-w-[320px]"
                      >
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: branchIndex * 0.1 }}
                          className="relative"
                        >
                          <button
                            onClick={() => removeSchool(branch.id)}
                            className="absolute right-0 top-0 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all hover:bg-red-500 hover:text-white hover:scale-110"
                          >
                            <X className="h-4 w-4" />
                          </button>

                          <div className="relative aspect-[4/3] overflow-hidden rounded-lg mb-4 bg-gradient-to-br from-gold-100 to-sand-100">
                            <Image
                              src={
                                branch.school?.logo_url ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  branch.school?.name || "School"
                                )}&background=f59e0b&color=fff&size=400`
                              }
                              alt={branch.name}
                              fill
                              className="object-cover"
                            />
                          </div>

                          <div className="space-y-3">
                            <h3 className="text-lg font-bold text-gray-900">
                              {branch.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {branch.school?.name}
                            </p>
                            {branch.school && (
                              <div className="flex items-center justify-center gap-2">
                                <StarRating
                                  rating={branch.school.rating}
                                  size="sm"
                                />
                                <span className="text-sm text-gray-600">
                                  {branch.school.rating} (
                                  {branch.school.review_count})
                                </span>
                              </div>
                            )}
                            <Link href={`/school/${branch.id}`}>
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
                    schools={branches}
                    renderCell={(branch) => (
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">
                          {branch.city || "Dubai"}
                        </p>
                        <p className="mt-1 text-sm text-gray-500">
                          {branch.address}
                        </p>
                      </div>
                    )}
                  />

                  <ComparisonRowData
                    label="Operating Hours"
                    schools={branches}
                    renderCell={(branch) => (
                      <p className="text-center whitespace-pre-wrap font-medium text-gray-900 text-sm">
                        {branch.normal_hours || "Contact for hours"}
                      </p>
                    )}
                  />

                  <ComparisonRowData
                    label="Contact"
                    schools={branches}
                    renderCell={(branch) => (
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">
                          {branch.contact || "N/A"}
                        </p>
                        {branch.email && (
                          <p className="mt-1 text-sm text-gray-500">
                            {branch.email}
                          </p>
                        )}
                      </div>
                    )}
                  />

                  <ComparisonRowData
                    label="Directions"
                    schools={branches}
                    renderCell={(branch) => (
                      <div className="space-y-2">
                        {branch.contact && (
                          <a
                            href={`tel:${branch.contact}`}
                            className="flex items-center justify-center gap-2 text-gray-900 hover:text-gold-600 transition-colors"
                          >
                            <Phone className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              {branch.contact}
                            </span>
                          </a>
                        )}
                        {branch.email && (
                          <a
                            href={`mailto:${branch.email}`}
                            className="flex items-center justify-center gap-2 text-gray-900 hover:text-gold-600 transition-colors"
                          >
                            <Mail className="h-4 w-4" />
                            <span className="text-sm font-medium truncate">
                              {branch.email}
                            </span>
                          </a>
                        )}
                        {branch.directions_url && (
                          <a
                            href={branch.directions_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 text-gray-900 hover:text-gold-600 transition-colors"
                          >
                            <MapPin className="h-4 w-4" />
                            <span className="text-sm font-medium">
                              Get Directions
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
