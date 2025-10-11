'use client';

import { useComparisonStore } from '@/store/comparison-store';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StarRating } from '@/components/ui/star-rating';
import { LicenseBadge } from '@/components/ui/license-badge';
import { PriceDisplay } from '@/components/ui/price-display';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Phone, Mail, Globe, MapPin, Clock, X, GraduationCap, Check, Minus } from 'lucide-react';
import { LicenseCategory } from '@/lib/types';
import { motion } from 'framer-motion';

export default function ComparePage() {
  const { schools, removeSchool } = useComparisonStore();

  const getAllLicenseTypes = () => {
    const types = new Set<string>();
    schools.forEach(school => {
      school.license_categories?.forEach(cat => types.add(cat.type));
    });
    return Array.from(types);
  };

  const licenseTypes = getAllLicenseTypes();

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
            No Schools to Compare
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8 max-w-md text-gray-600"
          >
            Start by adding schools from the homepage to see a side-by-side comparison.
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
    <div className="min-h-screen bg-gradient-to-b from-sand-50 to-white">
      <section className="py-12 bg-white border-b border-gray-200">
        <Container>
          <Link href="/" className="mb-6 inline-flex items-center text-sm font-medium text-gray-600 transition-all hover:text-gray-900 hover:gap-3 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Schools
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                Compare Driving Schools
              </h1>
              <p className="mt-2 text-gray-600">
                Side-by-side comparison of {schools.length} {schools.length === 1 ? 'school' : 'schools'}
              </p>
            </div>
          </div>
        </Container>
      </section>

      <div className="pb-20">
        <Container>
          <div className="py-8">
            <div className="overflow-x-auto">
              <div className="inline-flex min-w-full gap-6 pb-4">
                <div className="sticky left-0 z-20 w-64 flex-shrink-0 space-y-4">
                  <Card className="bg-gradient-to-br from-white to-sand-50 p-6 shadow-lg border-2 border-gold-200">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                      Comparison Criteria
                    </h3>
                  </Card>

                  <ComparisonRow icon={<MapPin className="h-5 w-5" />} label="Location" />
                  <ComparisonRow icon={<Clock className="h-5 w-5" />} label="Operating Hours" />
                  <ComparisonRow icon={<GraduationCap className="h-5 w-5" />} label="License Types" />

                  {licenseTypes.map((type) => (
                    <Card key={type} className="bg-white p-4 shadow-md border border-gray-200">
                      <LicenseBadge type={type as any} />
                      <p className="mt-2 text-xs text-gray-500">Pricing & Details</p>
                    </Card>
                  ))}

                  <ComparisonRow icon={<Phone className="h-5 w-5" />} label="Contact Info" />
                </div>

                {schools.map((school, schoolIndex) => (
                  <motion.div
                    key={school.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: schoolIndex * 0.1 }}
                    className="w-80 flex-shrink-0 space-y-4"
                  >
                    <Card className="relative overflow-hidden bg-white shadow-xl border-2 border-gold-300 hover:shadow-2xl transition-shadow duration-300">
                      <button
                        onClick={() => removeSchool(school.id)}
                        className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-gray-600 shadow-lg transition-all hover:bg-red-500 hover:text-white hover:scale-110"
                      >
                        <X className="h-4 w-4" />
                      </button>

                      <div className="relative aspect-[4/3] overflow-hidden">
                        <Image
                          src={school.image_url}
                          alt={school.name}
                          fill
                          className="object-cover transition-transform duration-300 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </div>

                      <div className="p-6 space-y-4">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{school.name}</h3>
                          <div className="flex items-center justify-center gap-2 py-2 px-3 bg-gold-50 rounded-lg">
                            <StarRating rating={school.rating} size="sm" />
                            <span className="text-sm font-medium text-gray-700">
                              {school.rating} ({school.review_count})
                            </span>
                          </div>
                        </div>

                        <Link href={`/school/${school.slug}`}>
                          <Button className="w-full bg-gold-500 hover:bg-gold-600 shadow-md hover:shadow-lg transition-all">
                            View Full Details
                          </Button>
                        </Link>
                      </div>
                    </Card>

                    <DataCell>
                      <div className="text-center">
                        <p className="font-semibold text-gray-900">{school.location_area}</p>
                        <p className="mt-1 text-sm text-gray-500">{school.address}</p>
                      </div>
                    </DataCell>

                    <DataCell>
                      <p className="text-center font-medium text-gray-900">{school.operating_hours}</p>
                    </DataCell>

                    <DataCell>
                      <div className="flex flex-wrap justify-center gap-2">
                        {school.license_categories?.map((cat) => (
                          <LicenseBadge key={cat.id} type={cat.type} />
                        ))}
                      </div>
                    </DataCell>

                    {licenseTypes.map((type) => {
                      const category = school.license_categories?.find(cat => cat.type === type);
                      return (
                        <Card key={type} className={`p-4 shadow-md transition-all duration-300 ${
                          category
                            ? 'bg-gradient-to-br from-white to-gold-50 border-2 border-gold-200 hover:border-gold-300'
                            : 'bg-gray-50 border border-gray-200'
                        }`}>
                          {category ? (
                            <div className="space-y-3">
                              <div className="text-center">
                                <PriceDisplay
                                  price={category.price}
                                  label=""
                                  className="justify-center text-2xl font-bold text-gray-900"
                                />
                                <p className="mt-1 text-sm font-medium text-gray-600 bg-white px-3 py-1 rounded-full inline-block">
                                  {category.duration}
                                </p>
                              </div>
                              {category.features && category.features.length > 0 && (
                                <div className="space-y-2 pt-3 border-t border-gold-200">
                                  {category.features.slice(0, 4).map((feature, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                      <Check className="h-4 w-4 text-gold-600 flex-shrink-0 mt-0.5" />
                                      <span className="text-xs text-gray-700">{feature}</span>
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
                        </Card>
                      );
                    })}

                    <DataCell>
                      <div className="space-y-2">
                        <a
                          href={`tel:${school.phone}`}
                          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-50 text-gray-900 hover:bg-gold-50 hover:text-gold-700 transition-colors"
                        >
                          <Phone className="h-4 w-4" />
                          <span className="text-sm font-medium">{school.phone}</span>
                        </a>
                        <a
                          href={`mailto:${school.email}`}
                          className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-50 text-gray-900 hover:bg-gold-50 hover:text-gold-700 transition-colors"
                        >
                          <Mail className="h-4 w-4" />
                          <span className="text-sm font-medium truncate">{school.email}</span>
                        </a>
                        {school.website && (
                          <a
                            href={school.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-gray-50 text-gray-900 hover:bg-gold-50 hover:text-gold-700 transition-colors"
                          >
                            <Globe className="h-4 w-4" />
                            <span className="text-sm font-medium">Visit Website</span>
                          </a>
                        )}
                      </div>
                    </DataCell>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}

function ComparisonRow({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <Card className="bg-white p-4 shadow-md border border-gray-200">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-100 text-gold-600">
          {icon}
        </div>
        <h3 className="font-semibold text-gray-900">{label}</h3>
      </div>
    </Card>
  );
}

function DataCell({ children }: { children: React.ReactNode }) {
  return (
    <Card className="bg-white p-4 shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      {children}
    </Card>
  );
}
