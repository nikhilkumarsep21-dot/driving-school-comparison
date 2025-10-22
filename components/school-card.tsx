"use client";

import React from "react";
import { BranchWithSchool } from "@/lib/types";
import { StarRating } from "./ui/star-rating";
import { LicenseBadge } from "./ui/license-badge";
import { PriceDisplay } from "./ui/price-display";
import { MapPin, Users, GitCompare, Check, GraduationCap } from "lucide-react";
import { Button } from "./ui/button";
import { useComparisonStore } from "@/store/comparison-store";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface SchoolCardProps {
  school: BranchWithSchool;
  index?: number;
}

export function SchoolCard({ school: branch, index = 0 }: SchoolCardProps) {
  const { addSchool, removeSchool, isInComparison, canAddMore } =
    useComparisonStore();
  const inComparison = isInComparison(branch.id);
  const [imageError, setImageError] = React.useState(false);

  const school = branch.school;

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (inComparison) {
      removeSchool(branch.id);
      toast.info(`${branch.name} removed from comparison`);
    } else {
      const success = addSchool(branch);
      if (!success) {
        if (!canAddMore()) {
          toast.error("You can only compare up to 3 branches");
        }
      } else {
        toast.success(`${branch.name} added to comparison`);
      }
    }
  };

  const imageUrl = school?.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(school?.name || 'School')}&background=f59e0b&color=fff&size=400`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={[
        "bg-card text-card-foreground rounded-xl border flex flex-col items-center text-center",
        "transition-all duration-300 ease-in-out",
        "hover:shadow-lg hover:-translate-y-2",
        "group relative overflow-hidden",
      ].join(" ")}
    >
      <div className="w-full">
        <Link href={`/school/${branch.id}`}>
          <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gold-100 to-sand-100 w-full">
            {!imageError ? (
              <Image
                src={imageUrl}
                alt={`${branch.name} - ${school?.name || ''}`}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                onError={() => setImageError(true)}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <GraduationCap className="h-24 w-24 text-gold-300" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>
        </Link>
      </div>

      <div className="absolute right-3 top-3 z-10">
        <Button
          size="sm"
          onClick={handleCompareClick}
          className={
            inComparison
              ? "bg-gold-600 text-white hover:bg-gold-700 shadow-lg"
              : "bg-white/90 text-gray-700 hover:bg-white shadow-soft backdrop-blur-sm"
          }
        >
          {inComparison ? (
            <>
              <Check className="mr-1.5 h-4 w-4" />
              Added
            </>
          ) : (
            <>
              <GitCompare className="mr-1.5 h-4 w-4" />
              Compare
            </>
          )}
        </Button>
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <Link href={`/school/${branch.id}`}>
            <h3 className="text-lg font-bold text-gray-900 transition-colors hover:text-gold-600">
              {branch.name}
            </h3>
            {school && (
              <p className="text-sm text-gray-600">{school.name}</p>
            )}
          </Link>

          {school && (
            <div className="flex items-center gap-4">
              <StarRating rating={school.rating} size="sm" />
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Users className="h-3 w-3" />
                {school.review_count} reviews
              </span>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-gold-500" />
            {branch.city || 'Dubai'}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-gray-900">Contact:</span>
            <br />
            {branch.contact || school?.contact || 'N/A'}
          </div>
          <Link href={`/school/${branch.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="border-gold-200 text-gold-700 transition-all hover:bg-gold-50 hover:border-gold-300"
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
