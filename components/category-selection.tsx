"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { CATEGORY_TYPES } from "@/lib/constants";
import { CategoryFormModal } from "@/components/category-form-modal";
import { GraduationCap } from "lucide-react";

const CATEGORY_CONFIG = [
  {
    id: 1,
    icon: "/icons/motorcycle_icon_128px.png",
    description: "Get your motorcycle license",
  },
  {
    id: 2,
    icon: "/icons/hatchback_car_icon_128px.png",
    description: "Manual and automatic car training",
  },
  {
    id: 3,
    icon: "/icons/semi_truck_icon_128px.png",
    description: "Professional truck driving license",
  },
  {
    id: 4,
    icon: "/icons/minibus_icon_128px.png",
    description: "Light bus license training",
  },
  {
    id: 5,
    icon: "/icons/green_bus_icon_128px.png",
    description: "Heavy bus license training",
  },
  {
    id: 6,
    icon: "/icons/forklift_icon_128px.png",
    description: "Light forklift operator license",
  },
  {
    id: 7,
    icon: "/icons/forklift_heavy_icon_128px.png",
    description: "Heavy forklift operator license",
  },
];

export function CategorySelection() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({});

  const handleImageError = (categoryId: number) => {
    setImageErrors((prev) => ({ ...prev, [categoryId]: true }));
  };

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategory(categoryId);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
  };

  return (
    <>
      <div className="grid gap-4 grid-cols-7 overflow-x-auto">
        {CATEGORY_CONFIG.map((category, index) => {
          const licenseInfo = CATEGORY_TYPES[category.id];

          return (
            <motion.button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={[
                "group relative overflow-hidden",
                "rounded-xl border bg-card text-card-foreground px-8 py-2 flex flex-col items-center text-center",
                "transition-all duration-300 ease-in-out",
                "hover:shadow-lg hover:-translate-y-2",
                // Remove old shadow/border classes
              ].join(" ")}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative z-10">
                <div className="mb-4 flex items-center justify-center">
                  <div className="relative w-28 h-28 rounded-full bg-[#e5edef] p-6 transition-transform duration-300 ease-out group-hover:scale-110 shadow-sm">
                    {!imageErrors[category.id] ? (
                      <Image
                        src={category.icon}
                        alt={licenseInfo.label}
                        fill
                        className="object-contain p-2"
                        onError={() => handleImageError(category.id)}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <GraduationCap className="h-14 w-14 text-gold-400" />
                      </div>
                    )}
                  </div>
                </div>
                <h3 className="text-base font-medium text-center text-gray-900 group-hover:text-gold-600 transition-colors">
                  {licenseInfo.label}
                </h3>
              </div>

              <div className="absolute inset-0 bg-gradient-to-br from-gold-50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.button>
          );
        })}
      </div>

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
