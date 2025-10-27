"use client";

import { useComparisonStore } from "@/store/comparison-store";
import { Button } from "./ui/button";
import { X, GitCompare, Trash2, GraduationCap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useState } from "react";

export function ComparisonBar() {
  const { schools, removeSchool, clearAll } = useComparisonStore();
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const handleImageError = (schoolId: string) => {
    setImageErrors((prev) => ({ ...prev, [schoolId]: true }));
  };

  if (schools.length === 0) return null;

  const handleRemove = (schoolId: string, schoolName: string) => {
    removeSchool(schoolId);
    toast.info(`${schoolName} removed from comparison`);
  };

  const handleClearAll = () => {
    clearAll();
    toast.info("Comparison cleared");
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 shadow-soft-xl backdrop-blur-lg"
      >
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="hidden items-center gap-2 sm:flex">
                <GitCompare className="h-5 w-5 text-gold-600" />
                <span className="font-semibold text-gray-900">
                  Compare Schools ({schools.length}/3)
                </span>
              </div>

              <div className="flex gap-3 overflow-x-auto pb-2 sm:pb-0">
                {schools.map((school) => (
                  <motion.div
                    key={school.id}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="flex items-center gap-2 rounded-xl bg-sand-50 p-2 pr-3"
                  >
                    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-gold-100 to-sand-100">
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
                          <GraduationCap className="h-6 w-6 text-gold-300" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {school.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {school.branch_locations?.[0]?.city || "Dubai"}
                      </p>
                    </div>
                    <button
                      onClick={() => handleRemove(school.id, school.name)}
                      className="flex-shrink-0 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                className="hidden sm:flex"
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </Button>
              <Link href="/compare">
                <Button
                  size="sm"
                  className="bg-gold-500 text-white transition-colors hover:bg-gold-600"
                >
                  <GitCompare className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Compare Now</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
