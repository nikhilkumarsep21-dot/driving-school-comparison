'use client';

import { useComparisonStore } from '@/store/comparison-store';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/star-rating';
import { LicenseBadge } from '@/components/ui/license-badge';
import { PriceDisplay } from '@/components/ui/price-display';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Phone, Mail, Globe, MapPin, Clock, X, GraduationCap } from 'lucide-react';
import { LicenseCategory } from '@/lib/types';

export default function ComparePage() {
  const { schools, removeSchool } = useComparisonStore();

  if (schools.length === 0) {
    return (
      <Container>
        <div className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
            <GraduationCap className="h-12 w-12 text-gray-400" />
          </div>
          <h1 className="mb-4 text-3xl font-bold text-gray-900">No Schools to Compare</h1>
          <p className="mb-8 max-w-md text-gray-600">
            Start by adding schools from the homepage to see a side-by-side comparison.
          </p>
          <Link href="/">
            <Button className="bg-gold-500 hover:bg-gold-600">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Browse Schools
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  const getAllLicenseTypes = () => {
    const types = new Set<string>();
    schools.forEach(school => {
      school.license_categories?.forEach(cat => types.add(cat.type));
    });
    return Array.from(types);
  };

  const licenseTypes = getAllLicenseTypes();

  return (
    <div>
      <section className="py-12 bg-sand-50">
        <Container>
          <Link href="/" className="mb-6 inline-flex items-center text-sm font-medium text-gray-600 transition-colors hover:text-gray-900">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Schools
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Compare Driving Schools
          </h1>
          <p className="mt-2 text-gray-600">
            Side-by-side comparison of {schools.length} {schools.length === 1 ? 'school' : 'schools'}
          </p>
        </Container>
      </section>

      <div className="bg-white pb-20">
        <Container>
          <div className="py-12">
            <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="sticky left-0 z-10 w-48 bg-sand-50 p-4 text-left">
                    <div className="text-sm font-semibold text-gray-500">SCHOOL</div>
                  </th>
                  {schools.map((school) => (
                    <th key={school.id} className="min-w-[300px] bg-white p-4">
                      <div className="space-y-4">
                        <button
                          onClick={() => removeSchool(school.id)}
                          className="ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-red-100 hover:text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                          <Image
                            src={school.image_url}
                            alt={school.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-gray-900">{school.name}</h3>
                          <div className="mt-2 flex items-center justify-center gap-2">
                            <StarRating rating={school.rating} size="sm" />
                            <span className="text-xs text-gray-500">
                              ({school.review_count})
                            </span>
                          </div>
                        </div>
                        <Link href={`/school/${school.slug}`}>
                          <Button className="w-full bg-gold-500 hover:bg-gold-600">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                <tr className="border-t border-gray-200">
                  <td className="sticky left-0 z-10 bg-sand-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <MapPin className="h-4 w-4 text-gold-500" />
                      Location
                    </div>
                  </td>
                  {schools.map((school) => (
                    <td key={school.id} className="bg-white p-4 text-center">
                      <div className="text-sm text-gray-900">{school.location_area}</div>
                      <div className="mt-1 text-xs text-gray-500">{school.address}</div>
                    </td>
                  ))}
                </tr>

                <tr className="border-t border-gray-200 bg-sand-50/50">
                  <td className="sticky left-0 z-10 bg-sand-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Clock className="h-4 w-4 text-gold-500" />
                      Operating Hours
                    </div>
                  </td>
                  {schools.map((school) => (
                    <td key={school.id} className="bg-sand-50/50 p-4 text-center">
                      <div className="text-sm text-gray-900">{school.operating_hours}</div>
                    </td>
                  ))}
                </tr>

                <tr className="border-t border-gray-200">
                  <td className="sticky left-0 z-10 bg-sand-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <GraduationCap className="h-4 w-4 text-gold-500" />
                      License Types
                    </div>
                  </td>
                  {schools.map((school) => (
                    <td key={school.id} className="bg-white p-4">
                      <div className="flex flex-wrap justify-center gap-1.5">
                        {school.license_categories?.map((cat) => (
                          <LicenseBadge key={cat.id} type={cat.type} />
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>

                {licenseTypes.map((type, index) => {
                  const getCategoryForType = (schoolCategories: LicenseCategory[] | undefined) => {
                    return schoolCategories?.find(cat => cat.type === type);
                  };

                  return (
                    <tr key={type} className={index % 2 === 0 ? 'border-t border-gray-200 bg-sand-50/50' : 'border-t border-gray-200'}>
                      <td className="sticky left-0 z-10 bg-sand-50 p-4">
                        <LicenseBadge type={type as any} />
                        <div className="mt-1 text-xs text-gray-500">Price & Duration</div>
                      </td>
                      {schools.map((school) => {
                        const category = getCategoryForType(school.license_categories);
                        return (
                          <td key={school.id} className={index % 2 === 0 ? 'bg-sand-50/50 p-4' : 'bg-white p-4'}>
                            {category ? (
                              <div className="space-y-2 text-center">
                                <PriceDisplay price={category.price} label="" className="justify-center" />
                                <div className="text-sm text-gray-600">{category.duration}</div>
                                {category.features && category.features.length > 0 && (
                                  <div className="mt-3 space-y-1 text-left text-xs text-gray-500">
                                    {category.features.slice(0, 3).map((feature, i) => (
                                      <div key={i} className="flex items-start gap-1">
                                        <span className="text-gold-500">•</span>
                                        <span>{feature}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-center text-sm text-gray-400">Not offered</div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}

                <tr className="border-t border-gray-200 bg-sand-50/50">
                  <td className="sticky left-0 z-10 bg-sand-50 p-4">
                    <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                      <Phone className="h-4 w-4 text-gold-500" />
                      Contact
                    </div>
                  </td>
                  {schools.map((school) => (
                    <td key={school.id} className="bg-sand-50/50 p-4">
                      <div className="space-y-2 text-sm">
                        <a
                          href={`tel:${school.phone}`}
                          className="flex items-center justify-center gap-2 text-gray-900 hover:text-gold-600"
                        >
                          <Phone className="h-3 w-3" />
                          {school.phone}
                        </a>
                        <a
                          href={`mailto:${school.email}`}
                          className="flex items-center justify-center gap-2 text-gray-900 hover:text-gold-600"
                        >
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{school.email}</span>
                        </a>
                        {school.website && (
                          <a
                            href={school.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 text-gray-900 hover:text-gold-600"
                          >
                            <Globe className="h-3 w-3" />
                            Website
                          </a>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
