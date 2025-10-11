"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/layout/container";
import { SchoolCard } from "@/components/school-card";
import { Filters } from "@/components/filters";
import { LoadingCard } from "@/components/ui/loading-card";
import { School, FilterOptions } from "@/lib/types";
import { GraduationCap } from "lucide-react";

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterOptions>({
    search: "",
    categories: [],
    locations: [],
    minPrice: 0,
    maxPrice: 15000,
    minRating: 0,
    sortBy: "recommended",
  });

  useEffect(() => {
    const fetchSchools = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();

        if (filters.search) params.set("search", filters.search);
        if (filters.categories?.length)
          params.set("categories", filters.categories.join(","));
        if (filters.locations?.length)
          params.set("locations", filters.locations.join(","));
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
      <section className="py-12 sm:py-16 bg-sand-50">
        <Container>
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Browse Driving Schools
            </h1>
            <p className="text-lg text-gray-600">
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
              <div className="sticky top-20">
                <Filters filters={filters} onFiltersChange={setFilters} />
              </div>
            </aside>

            <main className="flex-1 min-w-0">
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
                <div className="flex flex-col items-center justify-center py-16 text-center">
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
