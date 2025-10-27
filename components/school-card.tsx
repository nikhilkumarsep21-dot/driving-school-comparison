"use client";

import React from "react";
import { SchoolWithLocations } from "@/lib/types";
import { StarRating } from "./ui/star-rating";
import { MapPin, Users, GitCompare, Check, GraduationCap, MessageSquare } from "lucide-react";
import { Button } from "./ui/button";
import { useComparisonStore } from "@/store/comparison-store";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { EnquiryModal } from "./enquiry-modal";

interface SchoolCardProps {
  school: SchoolWithLocations;
  index?: number;
}

export function SchoolCard({ school, index = 0 }: SchoolCardProps) {
  const { addSchool, removeSchool, isInComparison, canAddMore } =
    useComparisonStore();
  const inComparison = isInComparison(school.id);
  const [imageError, setImageError] = React.useState(false);
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = React.useState(false);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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

  const handleEnquireClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEnquiryModalOpen(true);
  };

  const imageUrl =
    school.logo_url ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      school.name
    )}&background=f59e0b&color=fff&size=400`;

  const locationCount = school.branch_locations?.length || 0;
  const primaryLocation = school.branch_locations?.[0];

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
        <Link href={`/school/${school.id}`}>
          <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-gold-100 to-sand-100 w-full">
            {!imageError ? (
              <Image
                src={imageUrl}
                alt={school.name}
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

      <div className="flex flex-col space-y-4 p-5 w-full flex-1">
        <div className="space-y-2 flex-1">
          <Link href={`/school/${school.id}`}>
            <h3 className="text-lg font-bold text-gray-900 transition-colors hover:text-gold-600 line-clamp-2 min-h-[3.5rem]">
              {school.name}
            </h3>
          </Link>

          <div className="flex items-center justify-between gap-4 w-full px-1">
            <div className="flex items-center gap-1">
              <StarRating rating={school.rating} size="sm" />
              <span className="font-semibold text-gray-900 text-xs">
                {school.rating}
              </span>
            </div>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <Users className="h-3 w-3" />
              {school.review_count} reviews
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-gray-600 min-h-[1.5rem]">
            {primaryLocation && (
              <>
                <MapPin className="h-4 w-4 text-gold-500 flex-shrink-0" />
                {locationCount > 1 ? (
                  <span>{locationCount} locations in Dubai</span>
                ) : (
                  <span>{primaryLocation.city}</span>
                )}
              </>
            )}
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4 mt-auto space-y-2">
          <Link href={`/school/${school.id}`}>
            <Button
              variant="outline"
              size="sm"
              className="w-full border-gold-200 text-gold-700 transition-all hover:bg-gold-50 hover:border-gold-300"
            >
              View Details
            </Button>
          </Link>
          <Button
            variant="default"
            size="sm"
            onClick={handleEnquireClick}
            className="w-full bg-gold-600 hover:bg-gold-700 text-white"
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Enquire Now
          </Button>
        </div>
      </div>

      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => setIsEnquiryModalOpen(false)}
        schoolId={school.id}
        schoolName={school.name}
      />
    </motion.div>
  );
}
