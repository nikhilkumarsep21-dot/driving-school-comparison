'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bike, Car, Truck, Bus, ShipWheel } from 'lucide-react';
import { LicenseType } from '@/lib/types';
import { LICENSE_TYPES } from '@/lib/constants';
import { CategoryFormModal } from '@/components/category-form-modal';

const CATEGORY_CONFIG = [
  {
    type: 'motorcycle' as LicenseType,
    icon: Bike,
    description: 'Get your motorcycle license',
  },
  {
    type: 'light_motor_vehicle' as LicenseType,
    icon: Car,
    description: 'Manual and automatic car training',
  },
  {
    type: 'heavy_truck' as LicenseType,
    icon: Truck,
    description: 'Professional truck driving license',
  },
  {
    type: 'light_bus' as LicenseType,
    icon: Bus,
    description: 'Light bus license training',
  },
  {
    type: 'heavy_bus' as LicenseType,
    icon: Bus,
    description: 'Heavy bus license training',
  },
  {
    type: 'light_forklift' as LicenseType,
    icon: ShipWheel,
    description: 'Light forklift operator license',
  },
  {
    type: 'heavy_forklift' as LicenseType,
    icon: ShipWheel,
    description: 'Heavy forklift operator license',
  },
];

export function CategorySelection() {
  const [selectedCategory, setSelectedCategory] = useState<LicenseType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      <div className="mx-auto max-w-3xl text-center mb-12">
        <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-4">
          Choose Your License Type
        </h2>
        <p className="text-lg text-gray-600">
          Select the license category you're interested in to get started
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {CATEGORY_CONFIG.map((category, index) => {
          const Icon = category.icon;
          const licenseInfo = LICENSE_TYPES[category.type];

          return (
            <motion.button
              key={category.type}
              onClick={() => handleCategoryClick(category.type)}
              className="group relative overflow-hidden rounded-2xl bg-white p-8 text-left shadow-md transition-all hover:shadow-xl border-2 border-transparent hover:border-gold-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative z-10">
                <div className="mb-4 flex items-center justify-between">
                  <div className={`inline-flex rounded-xl ${licenseInfo.color} p-3`}>
                    <Icon className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900 group-hover:text-gold-600 transition-colors">
                  {licenseInfo.label}
                </h3>
                <p className="text-sm text-gray-600">
                  {category.description}
                </p>
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
