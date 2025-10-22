'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Container } from '@/components/layout/container';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/ui/star-rating';
import { LicenseBadge } from '@/components/ui/license-badge';
import { PriceDisplay } from '@/components/ui/price-display';
import { Skeleton } from '@/components/ui/skeleton';
import { useComparisonStore } from '@/store/comparison-store';
import { BranchWithSchool, Detail, Category } from '@/lib/types';
import { CourseNavigation } from '@/components/course-navigation';
import { SectionNavigation, CourseSection } from '@/components/section-navigation';
import { CourseDetailsSection } from '@/components/course-details-section';
import { DocumentsSection } from '@/components/documents-section';
import { LectureDetailsSection } from '@/components/lecture-details-section';
import { FeesSection } from '@/components/fees-section';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Phone, Mail, Globe, MapPin, Clock, Calendar, CheckCircle2, GitCompare, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface BranchData extends BranchWithSchool {
  details?: Detail[];
  categories?: Category[];
}

export default function SchoolDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [branch, setBranch] = useState<BranchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedSection, setSelectedSection] = useState<CourseSection>('details');
  const { addSchool, removeSchool, isInComparison, canAddMore } = useComparisonStore();

  useEffect(() => {
    const fetchBranch = async () => {
      try {
        const response = await fetch(`/api/schools/${slug}`);
        const data = await response.json();
        setBranch(data.school);

        if (data.school?.categories && data.school.categories.length > 0) {
          setSelectedCategoryId(data.school.categories[0].id);
        }
      } catch (error) {
        console.error('Failed to fetch branch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBranch();
  }, [slug]);

  const handleCompareToggle = () => {
    if (!branch) return;

    const inComparison = isInComparison(branch.id);

    if (inComparison) {
      removeSchool(branch.id);
      toast.info(`${branch.name} removed from comparison`);
    } else {
      const success = addSchool(branch);
      if (!success) {
        if (!canAddMore()) {
          toast.error('You can only compare up to 3 branches');
        }
      } else {
        toast.success(`${branch.name} added to comparison`);
      }
    }
  };

  if (loading) {
    return (
      <Container>
        <div className="py-12">
          <Skeleton className="mb-6 h-8 w-32" />
          <Skeleton className="mb-8 h-[400px] w-full rounded-2xl" />
          <Skeleton className="mb-4 h-12 w-3/4" />
          <Skeleton className="mb-8 h-24 w-full" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-64 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </Container>
    );
  }

  if (!branch) {
    return (
      <Container>
        <div className="flex min-h-[60vh] flex-col items-center justify-center py-16 text-center">
          <h1 className="mb-4 text-3xl font-bold text-gray-900">Branch Not Found</h1>
          <p className="mb-8 text-gray-600">
            The driving school branch you're looking for doesn't exist.
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

  const school = branch.school;
  const inComparison = isInComparison(branch.id);

  const selectedDetail = branch.details?.find(
    (detail) => detail.category_id === selectedCategoryId
  );
  const selectedCategory = branch.categories?.find(
    (cat) => cat.id === selectedCategoryId
  );

  const availableSections = {
    details: !!selectedDetail?.course_details,
    documents: !!selectedDetail?.documents_required,
    lectures: !!selectedDetail?.lecture_details,
    fees: !!selectedDetail?.fees,
  };

  return (
    <div className="pb-20 bg-white">
      <Container>
        <div className="py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative mb-8 overflow-hidden rounded-3xl shadow-soft-lg">
              <div className="relative aspect-[21/9] bg-gradient-to-br from-gold-100 to-sand-100">
                <Image
                  src={school?.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(school?.name || 'School')}&background=f59e0b&color=fff&size=800`}
                  alt={school?.name || 'School'}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h1 className="mb-3 text-4xl font-bold sm:text-5xl">{branch.name}</h1>
                  <p className="mb-2 text-lg opacity-90">{school?.name}</p>
                  {school && (
                    <div className="flex flex-wrap items-center gap-4">
                      <StarRating rating={school.rating} size="lg" className="text-white" />
                      <span className="text-sm opacity-90">
                        {school.review_count} reviews
                      </span>
                      <span className="flex items-center gap-1 text-sm opacity-90">
                        <MapPin className="h-4 w-4" />
                        {branch.city || 'Dubai'}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <div className="mb-8 rounded-2xl bg-white p-6 shadow-soft">
                  <h2 className="mb-4 text-2xl font-bold text-gray-900">About This Branch</h2>
                  <p className="leading-relaxed text-gray-600">
                    {branch.name} is a branch of {school?.name}, one of Dubai's trusted driving schools.
                    Located in {branch.city || 'Dubai'}, this branch offers comprehensive driving instruction
                    with experienced instructors and modern facilities.
                  </p>
                </div>

                {branch.details && branch.details.length > 0 && branch.categories && branch.categories.length > 0 ? (
                  <div className="mb-8">
                    <h2 className="mb-6 text-2xl font-bold text-gray-900">Available Courses</h2>

                    <div className="mb-6 rounded-2xl bg-white shadow-soft overflow-hidden sticky top-20 z-30">
                      <CourseNavigation
                        categories={branch.categories}
                        selectedCategoryId={selectedCategoryId || branch.categories[0].id}
                        onSelectCategory={(id) => {
                          setSelectedCategoryId(id);
                          setSelectedSection('details');
                        }}
                      />
                    </div>

                    {selectedDetail && selectedCategory && (
                      <div className="rounded-2xl bg-white shadow-soft overflow-hidden">
                        <div className="sticky top-36 z-20">
                          <SectionNavigation
                            selectedSection={selectedSection}
                            onSelectSection={setSelectedSection}
                            availableSections={availableSections}
                          />
                        </div>

                        <div className="p-6 min-h-[400px]">
                          <motion.div
                            key={`${selectedCategoryId}-${selectedSection}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            {selectedSection === 'details' && (
                              <CourseDetailsSection
                                detail={selectedDetail}
                                category={selectedCategory}
                              />
                            )}
                            {selectedSection === 'documents' && (
                              <DocumentsSection detail={selectedDetail} />
                            )}
                            {selectedSection === 'lectures' && (
                              <LectureDetailsSection detail={selectedDetail} />
                            )}
                            {selectedSection === 'fees' && (
                              <FeesSection detail={selectedDetail} />
                            )}
                          </motion.div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mb-8 rounded-2xl bg-gray-50 p-8 text-center">
                    <p className="text-gray-600">Course details will be available soon. Please contact the branch directly for pricing and schedule information.</p>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                <div className="sticky top-24 space-y-6">
                  <div className="rounded-2xl bg-white p-6 shadow-soft">
                    <h3 className="mb-4 text-lg font-bold text-gray-900">Contact Information</h3>
                    <div className="space-y-4">
                      {branch.contact && (
                        <a
                          href={`tel:${branch.contact}`}
                          className="flex items-center gap-3 text-gray-600 transition-colors hover:text-gold-600"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-50">
                            <Phone className="h-5 w-5 text-gold-600" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Phone</div>
                            <div className="font-medium text-gray-900">{branch.contact}</div>
                          </div>
                        </a>
                      )}

                      {branch.email && (
                        <a
                          href={`mailto:${branch.email}`}
                          className="flex items-center gap-3 text-gray-600 transition-colors hover:text-gold-600"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-50">
                            <Mail className="h-5 w-5 text-gold-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs text-gray-500">Email</div>
                            <div className="truncate font-medium text-gray-900">{branch.email}</div>
                          </div>
                        </a>
                      )}

                      {school?.website && (
                        <a
                          href={school.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-gray-600 transition-colors hover:text-gold-600"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-50">
                            <Globe className="h-5 w-5 text-gold-600" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">School Website</div>
                            <div className="font-medium text-gray-900">Visit Website</div>
                          </div>
                        </a>
                      )}

                      {branch.directions_url && (
                        <a
                          href={branch.directions_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 text-gray-600 transition-colors hover:text-gold-600"
                        >
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-50">
                            <ExternalLink className="h-5 w-5 text-gold-600" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Directions</div>
                            <div className="font-medium text-gray-900">Get Directions</div>
                          </div>
                        </a>
                      )}

                      <div className="flex items-start gap-3 pt-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-50">
                          <MapPin className="h-5 w-5 text-gold-600" />
                        </div>
                        <div>
                          <div className="text-xs text-gray-500">Address</div>
                          <div className="font-medium text-gray-900">{branch.address}</div>
                        </div>
                      </div>

                      {branch.normal_hours && (
                        <div className="flex items-start gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold-50">
                            <Clock className="h-5 w-5 text-gold-600" />
                          </div>
                          <div>
                            <div className="text-xs text-gray-500">Operating Hours</div>
                            <div className="whitespace-pre-wrap font-medium text-gray-900">{branch.normal_hours}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    onClick={handleCompareToggle}
                    variant={inComparison ? 'outline' : 'default'}
                    className={inComparison ? 'w-full' : 'w-full bg-gold-500 hover:bg-gold-600'}
                  >
                    <GitCompare className="mr-2 h-4 w-4" />
                    {inComparison ? 'Remove from Comparison' : 'Add to Comparison'}
                  </Button>

                  {branch.coordinates && (
                    <div className="overflow-hidden rounded-2xl shadow-soft">
                      <div className="aspect-square w-full bg-gray-200">
                        <iframe
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          style={{ border: 0 }}
                          src={`https://www.google.com/maps?q=${branch.coordinates.lat},${branch.coordinates.lng}&output=embed`}
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}
