"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Container } from "@/components/layout/container";
import { SchoolCard } from "@/components/school-card";
import { Filters } from "@/components/filters";
import { LoadingCard } from "@/components/ui/loading-card";
import { SchoolWithLocations, FilterOptions } from "@/lib/types";
import { GraduationCap } from "lucide-react";

export default function SchoolsPage() {
  const searchParams = useSearchParams();
  const [schools, setSchools] = useState<SchoolWithLocations[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    licenseTypes: [],
    locations: [],
    experienceLevels: [],
    packageTypes: [],
    minPrice: 0,
    maxPrice: 15000,
    minRating: 0,
    sortBy: "recommended",
  });
  const [preAppliedFilters, setPreAppliedFilters] = useState(false);

  useEffect(() => {
    const licenseType = searchParams.get("licenseType");
    const category = searchParams.get("category");
    const location = searchParams.get("location");
    const experience = searchParams.get("experience");
    const shiftType = searchParams.get("shiftType");

    if (
      (licenseType || category || location || experience || shiftType) &&
      !preAppliedFilters
    ) {
      setFilters((prev) => ({
        ...prev,
        licenseTypes: licenseType
          ? [licenseType]
          : category
          ? [category]
          : prev.licenseTypes,
        locations: location ? [location] : prev.locations,
        experienceLevels: experience ? [experience] : prev.experienceLevels,
        packageTypes: shiftType ? [shiftType] : prev.packageTypes,
      }));
      setPreAppliedFilters(true);
    }
  }, [searchParams, preAppliedFilters]);

  useEffect(() => {
    const fetchSchools = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();

        if (filters.search) params.set("search", filters.search);
        if (filters.licenseTypes?.length)
          params.set("licenseTypes", filters.licenseTypes.join(","));
        if (filters.locations?.length)
          params.set("locations", filters.locations.join(","));
        if (filters.experienceLevels?.length)
          params.set("experienceLevels", filters.experienceLevels.join(","));
        if (filters.packageTypes?.length)
          params.set("packageTypes", filters.packageTypes.join(","));
        if (filters.minPrice)
          params.set("minPrice", filters.minPrice.toString());
        if (filters.maxPrice)
          params.set("maxPrice", filters.maxPrice.toString());
        if (filters.minRating)
          params.set("minRating", filters.minRating.toString());
        if (filters.sortBy) params.set("sortBy", filters.sortBy);

        const response = await fetch(`/api/schools?${params.toString()}`);
        const data = await response.json();
        setSchools(data.schools || []);
      } catch (error) {
        console.error("Failed to fetch schools:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchSchools();
    }, 300);

    return () => clearTimeout(debounce);
  }, [filters]);

  return (
    <div className="pb-20 bg-white">
      <section className="relative overflow-hidden bg-gradient-to-br from-gold-600 to-gold-700 py-12 sm:py-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_white_1px,_transparent_1px)] bg-[length:24px_24px] opacity-20" />
        <Container className="relative">
          <div className="mx-auto max-w-3xl text-center pt-12">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Browse Driving Schools
            </h1>
            <p className="text-lg text-gold-100">
              Compare and find the perfect driving school that matches your
              needs
            </p>
          </div>
        </Container>
      </section>

      <Container>
        <div className="py-8">
          <div className="flex flex-col gap-8 lg:flex-row">
            <aside className="lg:w-80 shrink-0">
              <div className="sticky top-20 rounded-xl border bg-card text-card-foreground">
                <Filters filters={filters} onFiltersChange={setFilters} />
              </div>
            </aside>

            <main className="flex-1 min-w-0">
              {preAppliedFilters &&
                ((filters.licenseTypes?.length ?? 0) > 0 ||
                  (filters.locations?.length ?? 0) > 0 ||
                  (filters.experienceLevels?.length ?? 0) > 0 ||
                  (filters.packageTypes?.length ?? 0) > 0) && (
                  <div className="mb-6 rounded-xl border bg-card text-card-foreground p-4">
                    <p className="text-sm text-gold-800">
                      Showing results based on your selected preferences
                    </p>
                  </div>
                )}
              {loading ? (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <LoadingCard key={i} />
                  ))}
                </div>
              ) : schools.length > 0 ? (
                <>
                  <div className="mb-6 flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      {schools.length}{" "}
                      {schools.length === 1 ? "school" : "schools"} found
                    </p>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {schools.map((school, index) => (
                      <SchoolCard
                        key={school.id}
                        school={school}
                        index={index}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center rounded-xl border bg-card text-card-foreground">
                  <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                    <GraduationCap className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    No schools found
                  </h3>
                  <p className="mb-6 text-gray-600">
                    Try adjusting your filters or search terms
                  </p>
                </div>
              )}
            </main>
          </div>
        </div>
      </Container>
    </div>
  );
}
