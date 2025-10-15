"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { LicenseType } from "@/lib/types";
import { LICENSE_TYPES } from "@/lib/constants";
import { CategoryFormModal } from "@/components/category-form-modal";

const CATEGORY_CONFIG = [
  {
    type: "motorcycle" as LicenseType,
    icon: "/icons/motorcycle_icon_128px.png",
    description: "Get your motorcycle license",
  },
  {
    type: "light_motor_vehicle" as LicenseType,
    icon: "/icons/hatchback_car_icon_128px.png",
    description: "Manual and automatic car training",
  },
  {
    type: "heavy_truck" as LicenseType,
    icon: "/icons/semi_truck_icon_128px.png",
    description: "Professional truck driving license",
  },
  {
    type: "light_bus" as LicenseType,
    icon: "/icons/minibus_icon_128px.png",
    description: (
      <>
        Light bus
        <br />
        license training
      </>
    ),
  },
  {
    type: "heavy_bus" as LicenseType,
    icon: "/icons/green_bus_icon_128px.png",
    description: (
      <>
        Heavy bus
        <br />
        license training
      </>
    ),
  },
  {
    type: "light_forklift" as LicenseType,
    icon: "/icons/forklift_icon_128px.png",
    description: "Light forklift operator license",
  },
  {
    type: "heavy_forklift" as LicenseType,
    icon: "/icons/forklift_heavy_icon_128px.png",
    description: "Heavy forklift operator license",
  },
];

export function CategorySelection() {
  const [selectedCategory, setSelectedCategory] = useState<LicenseType | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const visibleCategories = showAll
    ? CATEGORY_CONFIG
    : CATEGORY_CONFIG.slice(0, 5);

  const handleCategoryClick = (category: LicenseType) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  return (
    <>
      <div className="grid gap-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        {visibleCategories.map((category, index) => {
          const licenseInfo = LICENSE_TYPES[category.type];

          return (
            <motion.button
              key={category.type}
              onClick={() => handleCategoryClick(category.type)}
              className="group relative overflow-hidden rounded-2xl bg-white p-6 text-left shadow-md transition-all hover:shadow-xl border border-gray-100 hover:border-gold-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative z-10">
                <div className="mb-4 flex items-center justify-center">
                  <div className="relative w-28 h-28 rounded-full bg-[#e5edef] p-6 transition-transform duration-300 ease-out group-hover:scale-110 shadow-sm">
                    <Image
                      src={category.icon}
                      alt={licenseInfo.label}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                </div>
                <h3 className="text-base font-medium text-center text-gray-900 group-hover:text-gold-600 transition-colors mb-1">
                  {licenseInfo.label}
                </h3>
                <p className="text-sm text-center text-gray-500">
                  {category.description}
                </p>
              </div>

              <div className="absolute inset-0 bg-gradient-to-br from-gold-50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.button>
          );
        })}
      </div>

      {CATEGORY_CONFIG.length > 5 && !showAll && (
        <div className="mt-10 text-center">
          <motion.button
            onClick={() => setShowAll(true)}
            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-full bg-[#e5edef] text-gray-700 hover:bg-gray-200 transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.05 }}
          >
            View More Categories
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </motion.button>
        </div>
      )}

      {selectedCategory && (
        <CategoryFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          selectedCategory={selectedCategory}
        />
      )}
    </>
  );
}
