'use client';

import { useComparisonStore } from '@/store/comparison-store';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/star-rating';
import { LicenseBadge } from '@/components/ui/license-badge';
import { PriceDisplay } from '@/components/ui/price-display';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Phone, Mail, Globe, MapPin, Clock, X, GraduationCap, TrendingUp, Award, DollarSign } from 'lucide-react';
import { LicenseCategory } from '@/lib/types';
import { useMemo } from 'react';

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

  const comparisonStats = useMemo(() => {
    if (schools.length === 0) return null;

    const avgRating = schools.reduce((sum, s) => sum + s.rating, 0) / schools.length;
    const prices = schools.flatMap(s =>
      s.license_categories?.map(c => c.price) || []
    );
    const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
    const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;
    const bestRatedSchool = schools.reduce((best, s) =>
      s.rating > best.rating ? s : best
    );

    return { avgRating, minPrice, maxPrice, bestRatedSchool };
  }, [schools]);

  if (schools.length === 0) {
    return (
      <Container>
        <div className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
          <div className="mb-8 flex h-32 w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-gold-100 to-amber-100 shadow-soft-lg">
            <GraduationCap className="h-16 w-16 text-gold-600" />
          </div>
          <h1 className="mb-4 text-4xl font-bold text-gray-900">No Schools to Compare</h1>
          <p className="mb-8 max-w-lg text-lg text-gray-600 leading-relaxed">
            Start by adding schools from the homepage to see a detailed side-by-side comparison of features, pricing, and ratings.
          </p>
          <Link href="/">
            <Button size="lg" className="bg-gold-600 hover:bg-gold-700 shadow-lg hover:shadow-xl transition-all h-12 px-8">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Browse Schools
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <div>
      <section className="py-12 bg-gradient-to-br from-sand-50 via-amber-50/30 to-sand-50">
        <Container>
          <Link href="/" className="mb-6 inline-flex items-center text-sm font-medium text-gray-600 transition-colors hover:text-gold-700">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Schools
          </Link>
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl mb-3">
              Compare Driving Schools
            </h1>
            <p className="text-lg text-gray-600">
              Side-by-side comparison of {schools.length} {schools.length === 1 ? 'school' : 'schools'}
            </p>
          </div>

          {comparisonStats && (
            <div className="grid gap-4 sm:grid-cols-3 mb-6">
              <Card className="bg-white border-gold-200 shadow-soft-md hover:shadow-soft-lg transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold-100">
                      <Award className="h-6 w-6 text-gold-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Average Rating</p>
                      <p className="text-2xl font-bold text-gray-900">{comparisonStats.avgRating.toFixed(1)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-emerald-200 shadow-soft-md hover:shadow-soft-lg transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100">
                      <DollarSign className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Price Range</p>
                      <p className="text-xl font-bold text-gray-900">
                        AED {comparisonStats.minPrice.toLocaleString()} - {comparisonStats.maxPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-amber-200 shadow-soft-md hover:shadow-soft-lg transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                      <TrendingUp className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Top Rated</p>
                      <p className="text-lg font-bold text-gray-900 truncate">{comparisonStats.bestRatedSchool.name}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </Container>
      </section>

      <div className="bg-gradient-to-b from-white to-sand-50 pb-20">
        <Container>
          <div className="py-12">
            <div className="overflow-x-auto">
            <table className="w-full border-collapse shadow-soft-lg rounded-2xl overflow-hidden">
              <thead>
                <tr className="bg-gradient-to-r from-sand-100 to-amber-50">
                  <th className="sticky left-0 z-10 w-48 bg-gradient-to-r from-sand-100 to-amber-50 p-6 text-left">
                    <div className="text-xs font-bold text-gray-700 tracking-wider">SCHOOL</div>
                  </th>
                  {schools.map((school, index) => (
                    <th key={school.id} className="min-w-[320px] bg-white p-6 border-l border-sand-200">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          {school.rating >= 4.5 && (
                            <Badge className="bg-gold-100 text-gold-800 border-gold-300 font-semibold">
                              <Award className="h-3 w-3 mr-1" />
                              Top Rated
                            </Badge>
                          )}
                          <button
                          onClick={() => removeSchool(school.id)}
                          className="ml-auto flex h-9 w-9 items-center justify-center rounded-full bg-sand-100 text-gray-500 transition-all hover:bg-red-100 hover:text-red-600 hover:scale-110"
                          aria-label="Remove school"
                        >
                          <X className="h-4 w-4" />
                        </button>
                        </div>
                        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-soft-md ring-1 ring-sand-200">
                          <Image
                            src={school.image_url}
                            alt={school.name}
                            fill
                            className="object-cover transition-transform hover:scale-105"
                          />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{school.name}</h3>
                          <div className="flex items-center justify-center gap-2">
                            <StarRating rating={school.rating} size="sm" />
                            <span className="text-sm font-medium text-gray-700">
                              {school.rating}
                            </span>
                            <span className="text-xs text-gray-500">
                              ({school.review_count} reviews)
                            </span>
                          </div>
                        </div>
                        <Link href={`/school/${school.slug}`}>
                          <Button className="w-full bg-gold-600 hover:bg-gold-700 shadow-md hover:shadow-lg transition-all font-semibold">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                <tr className="border-t-2 border-sand-200 hover:bg-amber-50/30 transition-colors">
                  <td className="sticky left-0 z-10 bg-gradient-to-r from-sand-100 to-amber-50 p-6">
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-800">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                        <MapPin className="h-5 w-5 text-gold-600" />
                      </div>
                      <span>Location</span>
                    </div>
                  </td>
                  {schools.map((school) => (
                    <td key={school.id} className="bg-white p-6 text-center border-l border-sand-200">
                      <div className="text-base font-semibold text-gray-900">{school.location_area}</div>
                      <div className="mt-2 text-sm text-gray-600">{school.address}</div>
                    </td>
                  ))}
                </tr>

                <tr className="border-t border-sand-200 bg-sand-50/50 hover:bg-amber-50/40 transition-colors">
                  <td className="sticky left-0 z-10 bg-gradient-to-r from-sand-100 to-amber-50 p-6">
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-800">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                        <Clock className="h-5 w-5 text-amber-600" />
                      </div>
                      <span>Operating Hours</span>
                    </div>
                  </td>
                  {schools.map((school) => (
                    <td key={school.id} className="bg-sand-50/50 p-6 text-center border-l border-sand-200">
                      <div className="text-base font-medium text-gray-900">{school.operating_hours}</div>
                    </td>
                  ))}
                </tr>

                <tr className="border-t border-sand-200 hover:bg-amber-50/30 transition-colors">
                  <td className="sticky left-0 z-10 bg-gradient-to-r from-sand-100 to-amber-50 p-6">
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-800">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                        <GraduationCap className="h-5 w-5 text-emerald-600" />
                      </div>
                      <span>License Types</span>
                    </div>
                  </td>
                  {schools.map((school) => (
                    <td key={school.id} className="bg-white p-6 border-l border-sand-200">
                      <div className="flex flex-wrap justify-center gap-2">
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

                  const prices = schools
                    .map(s => getCategoryForType(s.license_categories)?.price)
                    .filter((p): p is number => p !== undefined);
                  const minPrice = prices.length > 0 ? Math.min(...prices) : null;

                  return (
                    <tr key={type} className={index % 2 === 0 ? 'border-t border-sand-200 bg-sand-50/50 hover:bg-amber-50/40 transition-colors' : 'border-t border-sand-200 hover:bg-amber-50/30 transition-colors'}>
                      <td className="sticky left-0 z-10 bg-gradient-to-r from-sand-100 to-amber-50 p-6">
                        <div className="space-y-2">
                          <LicenseBadge type={type as any} />
                          <div className="text-xs font-medium text-gray-600">Price & Duration</div>
                        </div>
                      </td>
                      {schools.map((school) => {
                        const category = getCategoryForType(school.license_categories);
                        const isBestPrice = category && minPrice && category.price === minPrice;
                        return (
                          <td key={school.id} className={index % 2 === 0 ? 'bg-sand-50/50 p-6 border-l border-sand-200' : 'bg-white p-6 border-l border-sand-200'}>
                            {category ? (
                              <div className="space-y-3 text-center">
                                <div className="flex flex-col items-center gap-2">
                                  <PriceDisplay price={category.price} label="" className="justify-center text-lg" />
                                  {isBestPrice && (
                                    <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs font-semibold">
                                      Best Price
                                    </Badge>
                                  )}
                                </div>
                                <div className="text-sm font-medium text-gray-700 bg-sand-100 rounded-lg py-2 px-3">{category.duration}</div>
                                {category.features && category.features.length > 0 && (
                                  <div className="mt-4 space-y-2 text-left text-sm text-gray-600 bg-white rounded-lg p-3 border border-sand-200">
                                    {category.features.slice(0, 3).map((feature, i) => (
                                      <div key={i} className="flex items-start gap-2">
                                        <span className="text-gold-600 font-bold text-base leading-none mt-0.5">✓</span>
                                        <span className="leading-relaxed">{feature}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <div className="text-center py-8">
                                <div className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 bg-sand-100 rounded-lg px-4 py-2">
                                  <X className="h-4 w-4" />
                                  Not offered
                                </div>
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}

                <tr className="border-t-2 border-sand-200 bg-gradient-to-r from-sand-50 to-amber-50/50 hover:from-amber-50/50 hover:to-sand-50 transition-colors">
                  <td className="sticky left-0 z-10 bg-gradient-to-r from-sand-100 to-amber-50 p-6">
                    <div className="flex items-center gap-3 text-sm font-bold text-gray-800">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm">
                        <Phone className="h-5 w-5 text-blue-600" />
                      </div>
                      <span>Contact</span>
                    </div>
                  </td>
                  {schools.map((school) => (
                    <td key={school.id} className="bg-gradient-to-r from-sand-50 to-amber-50/50 p-6 border-l border-sand-200">
                      <div className="space-y-3">
                        <a
                          href={`tel:${school.phone}`}
                          className="flex items-center justify-center gap-2 text-base font-medium text-gray-900 hover:text-gold-700 transition-colors bg-white rounded-lg py-2.5 px-4 shadow-sm hover:shadow-md"
                        >
                          <Phone className="h-4 w-4" />
                          {school.phone}
                        </a>
                        <a
                          href={`mailto:${school.email}`}
                          className="flex items-center justify-center gap-2 text-base font-medium text-gray-900 hover:text-gold-700 transition-colors bg-white rounded-lg py-2.5 px-4 shadow-sm hover:shadow-md"
                        >
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{school.email}</span>
                        </a>
                        {school.website && (
                          <a
                            href={school.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 text-base font-medium text-gray-900 hover:text-gold-700 transition-colors bg-white rounded-lg py-2.5 px-4 shadow-sm hover:shadow-md"
                          >
                            <Globe className="h-4 w-4" />
                            Visit Website
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
