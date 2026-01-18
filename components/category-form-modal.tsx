"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  GitCompare,
  MessageSquare,
  GraduationCap,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperTitle,
  StepperSeparator,
} from "@/components/ui/stepper";
import { CATEGORY_TYPES, DUBAI_CITIES } from "@/lib/constants";
import {
  getUserDetailsFromCookie,
  saveUserDetailsToCookie,
} from "@/lib/cookies";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { Package, ShiftWithPackages } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { useComparisonStore } from "@/store/comparison-store";
import { EnquiryModal } from "./enquiry-modal";

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory?: number;
}

const STEPS = [
  {
    step: 1,
    title: "License Type",
    description: "Choose your license category",
  },
  { step: 2, title: "Location", description: "Choose your preferred area" },
  {
    step: 3,
    title: "Experience",
    description: "Tell us about your driving experience",
  },
  {
    step: 4,
    title: "Package Type",
    description: "Select your preferred package type",
  },
  {
    step: 5,
    title: "Packages",
    description: "View available packages",
  },
];

export function CategoryFormModal({
  isOpen,
  onClose,
  selectedCategory: initialCategory,
}: CategoryFormModalProps) {
  const router = useRouter();
  const { addSchool, removeSchool, isInComparison, canAddMore } =
    useComparisonStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(
    initialCategory || null
  );
  const [location, setLocation] = useState("");
  const [hasLicense, setHasLicense] = useState<string>("");
  const [licenseAge, setLicenseAge] = useState<string>("");
  const [experienceLevel, setExperienceLevel] = useState<string>("");
  const [selectedShiftType, setSelectedShiftType] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cities, setCities] = useState<string[]>([]);
  const [shiftTypes, setShiftTypes] = useState<string[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [groupedPackages, setGroupedPackages] = useState<Record<string, any>>(
    {}
  );
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingShiftTypes, setLoadingShiftTypes] = useState(false);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [enquirySchoolId, setEnquirySchoolId] = useState<string | null>(null);
  const [enquirySchoolName, setEnquirySchoolName] = useState<string | null>(
    null
  );
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      console.log("🚪 Modal opened");
      // If category is already selected, skip to step 2 and fetch cities
      if (selectedCategory) {
        setCurrentStep(2);
        fetchCities();
      }
    }
  }, [isOpen]);

  useEffect(() => {
    console.log("🔄 Dependencies changed:", {
      currentStep,
      location,
      experienceLevel,
      selectedShiftType,
      selectedCategory,
      shouldFetchPackages:
        currentStep === 5 &&
        location &&
        experienceLevel &&
        selectedShiftType &&
        selectedCategory,
    });

    if (
      currentStep === 5 &&
      location &&
      experienceLevel &&
      selectedShiftType &&
      selectedCategory
    ) {
      console.log("✅ Conditions met for packages, calling fetchPackages...");
      fetchPackages();
    } else {
      console.log("❌ Not fetching because:", {
        isStep5: currentStep === 5,
        hasLocation: !!location,
        hasExperienceLevel: !!experienceLevel,
        hasShiftType: !!selectedShiftType,
        hasCategory: !!selectedCategory,
      });
    }
  }, [
    currentStep,
    location,
    experienceLevel,
    selectedShiftType,
    selectedCategory,
  ]);

  const fetchCities = async () => {
    setLoadingCities(true);
    try {
      const { data, error } = await supabase
        .from("branch_locations")
        .select("city")
        .order("city");

      if (error) throw error;

      const uniqueCities = Array.from(
        new Set(data?.map((item) => item.city) || [])
      ).sort();
      // Add "Others" option at the end
      setCities([...uniqueCities, "Others"]);
    } catch (error) {
      console.error("Error fetching cities:", error);
      toast.error("Failed to load cities");
    } finally {
      setLoadingCities(false);
    }
  };

  const fetchPackages = async () => {
    console.log("🎬 fetchPackages STARTED");

    if (!selectedCategory) {
      console.error("❌ No category selected");
      return;
    }

    setLoadingPackages(true);
    try {
      const licenseTypeName = CATEGORY_TYPES[selectedCategory]?.label;
      console.log("🔍 Fetching packages with:", {
        selectedCategory,
        licenseTypeName,
        location,
        experienceLevel,
        selectedShiftType,
      });

      if (!licenseTypeName) {
        console.error(
          "❌ No license type name found for category:",
          selectedCategory
        );
        toast.error("Invalid category selected");
        return;
      }

      // Step 1: Get license type ID
      console.log("📞 Step 1: Fetching license type for:", licenseTypeName);
      const { data: licenseType, error: licenseError } = await supabase
        .from("license_types")
        .select("id, name")
        .eq("name", licenseTypeName)
        .single();

      if (licenseError) {
        console.error("❌ License error:", licenseError);
        throw licenseError;
      }
      console.log("✅ License type found:", licenseType);

      // Step 2: Get schools that have branches in the selected location
      console.log("📞 Step 2: Fetching schools in location:", location);
      const { data: schoolsInLocation, error: schoolError } = await supabase
        .from("branch_locations")
        .select("school_id, city")
        .eq("city", location);

      if (schoolError) {
        console.error("❌ School error:", schoolError);
        throw schoolError;
      }
      console.log("✅ Schools in location:", schoolsInLocation);

      const schoolIds =
        schoolsInLocation?.map((branch) => branch.school_id) || [];
      console.log("📍 School IDs to filter:", schoolIds);

      if (schoolIds.length === 0) {
        console.warn("⚠️ No schools found in location:", location);
        setPackages([]);
        setGroupedPackages({});
        return;
      }

      // Step 3: Get school details
      console.log("📞 Step 3: Fetching school details");
      const { data: schools, error: schoolsError } = await supabase
        .from("schools")
        .select("id, name, logo_url, rating")
        .in("id", schoolIds);

      if (schoolsError) {
        console.error("❌ Schools error:", schoolsError);
        throw schoolsError;
      }
      console.log("✅ Schools found:", schools);

      // Step 4: Get course levels for those schools with matching license type and experience level
      console.log("📞 Step 4: Fetching course levels with filters:", {
        license_type_id: licenseType.id,
        experience_level: experienceLevel,
        school_ids: schoolIds,
      });

      const { data: courseLevels, error: courseError } = await supabase
        .from("course_levels")
        .select(
          `
          id,
          name,
          school_id,
          experience_level,
          shifts (
            id,
            type,
            packages (
              id,
              name,
              fee_aed,
              details
            )
          )
        `
        )
        .eq("license_type_id", licenseType.id)
        .ilike("experience_level", experienceLevel) // Case-insensitive match
        .in("school_id", schoolIds);

      if (courseError) {
        console.error("❌ Course error:", courseError);
        throw courseError;
      }
      console.log("✅ Course levels found:", courseLevels);
      console.log("📊 Number of course levels:", courseLevels?.length || 0);

      // Step 5: Group packages by school (filter by selected shift type)
      const packagesBySchool: Record<string, any> = {};
      const allPackages: any[] = [];

      // Initialize school groups
      schools?.forEach((school) => {
        packagesBySchool[school.id] = {
          schoolId: school.id,
          schoolName: school.name,
          logoUrl: school.logo_url,
          rating: school.rating,
          packages: [],
        };
      });

      // Flatten and organize packages (filter by shift type)
      courseLevels?.forEach((level: any) => {
        console.log(
          "  📖 Processing course level:",
          level.name,
          "(",
          level.experience_level,
          ")"
        );
        level.shifts?.forEach((shift: any) => {
          console.log("    🔄 Processing shift:", shift.id, shift.type);

          // Filter by selected shift type
          if (shift.type !== selectedShiftType) {
            console.log(
              "    ⏭️ Skipping shift, doesn't match selected type:",
              selectedShiftType
            );
            return;
          }

          if (shift.packages) {
            console.log("      📦 Found packages:", shift.packages.length);
            shift.packages.forEach((pkg: any) => {
              const packageWithMeta = {
                ...pkg,
                courseLevelName: level.name,
                shiftType: shift.type,
                schoolId: level.school_id,
              };
              allPackages.push(packageWithMeta);

              // Add to school group
              if (packagesBySchool[level.school_id]) {
                packagesBySchool[level.school_id].packages.push(
                  packageWithMeta
                );
              }
            });
          } else {
            console.log("      ⚠️ No packages in this shift");
          }
        });
      });

      // Filter out schools with no packages
      const filteredPackagesBySchool = Object.fromEntries(
        Object.entries(packagesBySchool).filter(
          ([_, value]: [string, any]) => value.packages.length > 0
        )
      );

      console.log("🎉 Total packages found:", allPackages.length);
      console.log(
        "🏫 Schools with packages:",
        Object.keys(filteredPackagesBySchool).length
      );
      console.log("📦 Grouped packages:", filteredPackagesBySchool);

      setPackages(allPackages);
      setGroupedPackages(filteredPackagesBySchool);
    } catch (error) {
      console.error("❌ Error fetching packages:", error);
      toast.error("Failed to load packages");
    } finally {
      console.log("🏁 fetchPackages COMPLETED, setting loading to false");
      setLoadingPackages(false);
    }
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!selectedCategory)
        newErrors.category = "Please select a license type";
    }

    if (step === 2) {
      if (!location) newErrors.location = "Please select a location";
    }

    if (step === 3) {
      if (!hasLicense) newErrors.hasLicense = "Please select an option";
      if (hasLicense === "yes" && !licenseAge) {
        newErrors.licenseAge = "Please select your license age";
      }
    }

    if (step === 4) {
      if (!selectedShiftType)
        newErrors.shiftType = "Please select a shift type";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    console.log("➡️ handleNext called, currentStep:", currentStep);

    if (!validateStep(currentStep)) {
      console.log("❌ Validation failed");
      return;
    }

    if (currentStep === 1) {
      // After selecting license type, fetch cities
      setCurrentStep(2);
      if (cities.length === 0) {
        fetchCities();
      }
      return;
    }

    if (currentStep === 3) {
      // Set experience level based on license answer and age
      let newExperienceLevel = "beginner";
      if (hasLicense === "yes") {
        // If they have a license, they're at least intermediate
        // Could potentially differentiate between 2yrs and 5yrs in the future
        newExperienceLevel = "expert";
      }
      console.log(
        "🎯 Setting experience level:",
        newExperienceLevel,
        "from hasLicense:",
        hasLicense,
        "licenseAge:",
        licenseAge
      );
      setExperienceLevel(newExperienceLevel);

      // Move to step 4 and fetch shift types
      setCurrentStep(4);
      // Fetch shift types for the next step
      setTimeout(() => {
        fetchShiftTypesForStep3(newExperienceLevel);
      }, 0);
      return;
    }

    if (currentStep < 5) {
      console.log("📈 Moving to step:", currentStep + 1);
      setCurrentStep(currentStep + 1);
    }
  };

  const fetchShiftTypesForStep3 = async (expLevel: string) => {
    console.log("🎬 fetchShiftTypesForStep3 STARTED");

    if (!selectedCategory) {
      console.error("❌ No category selected");
      return;
    }

    setLoadingShiftTypes(true);
    try {
      const licenseTypeName = CATEGORY_TYPES[selectedCategory]?.label;
      console.log("🔍 Fetching shift types with:", {
        selectedCategory,
        licenseTypeName,
        location,
        experienceLevel: expLevel,
      });

      if (!licenseTypeName) {
        console.error(
          "❌ No license type name found for category:",
          selectedCategory
        );
        toast.error("Invalid category selected");
        return;
      }

      // Get license type ID
      const { data: licenseType, error: licenseError } = await supabase
        .from("license_types")
        .select("id, name")
        .eq("name", licenseTypeName)
        .single();

      if (licenseError) {
        console.error("❌ License error:", licenseError);
        throw licenseError;
      }

      // Get schools in location
      const { data: schoolsInLocation, error: schoolError } = await supabase
        .from("branch_locations")
        .select("school_id")
        .eq("city", location);

      if (schoolError) throw schoolError;

      const schoolIds =
        schoolsInLocation?.map((branch) => branch.school_id) || [];

      if (schoolIds.length === 0) {
        setShiftTypes([]);
        return;
      }

      // Get course levels and their shifts
      const { data: courseLevels, error: courseError } = await supabase
        .from("course_levels")
        .select(
          `
          id,
          shifts (
            type
          )
        `
        )
        .eq("license_type_id", licenseType.id)
        .ilike("experience_level", expLevel)
        .in("school_id", schoolIds);

      if (courseError) {
        console.error("❌ Course error:", courseError);
        throw courseError;
      }

      // Extract unique shift types
      const types = new Set<string>();
      courseLevels?.forEach((level: any) => {
        level.shifts?.forEach((shift: any) => {
          if (shift.type) types.add(shift.type);
        });
      });

      const uniqueShiftTypes = Array.from(types).sort();
      console.log("✅ Shift types found:", uniqueShiftTypes);
      setShiftTypes(uniqueShiftTypes);
    } catch (error) {
      console.error("❌ Error fetching shift types:", error);
      toast.error("Failed to load shift types");
    } finally {
      setLoadingShiftTypes(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCompareClick = (schoolId: string, schoolName: string) => {
    const inComparison = isInComparison(schoolId);

    if (inComparison) {
      removeSchool(schoolId);
      toast.info(`${schoolName} removed from comparison`);
    } else {
      const schoolData = {
        id: schoolId,
        name: schoolName,
        rating: groupedPackages[schoolId]?.rating || 0,
        review_count: 0,
        logo_url: groupedPackages[schoolId]?.logoUrl || undefined,
        phone: undefined,
        email: undefined,
        website: undefined,
        description: undefined,
        established_year: undefined,
        branch_locations: [],
      };

      const success = addSchool(schoolData);
      if (!success) {
        if (!canAddMore()) {
          toast.error("You can only compare up to 3 schools");
        }
      } else {
        toast.success(`${schoolName} added to comparison`);
      }
    }
  };

  const handleEnquireClick = (schoolId: string, schoolName: string) => {
    setEnquirySchoolId(schoolId);
    setEnquirySchoolName(schoolName);
    setIsEnquiryModalOpen(true);
  };

  const handleSubmit = () => {
    if (!selectedCategory) {
      toast.error("Please select a license type");
      return;
    }

    toast.success("Finding schools for you...");

    const params = new URLSearchParams({
      category: selectedCategory.toString(),
      location: location,
      experience: experienceLevel,
      shiftType: selectedShiftType,
      ...(licenseAge && { licenseAge: licenseAge }),
    });

    router.push(`/schools?${params.toString()}`);
    onClose();
  };

  const handleModalClose = () => {
    setCurrentStep(1);
    setSelectedCategory(initialCategory || null);
    setLocation("");
    setHasLicense("");
    setLicenseAge("");
    setExperienceLevel("");
    setSelectedShiftType("");
    setErrors({});
    setPackages([]);
    setGroupedPackages({});
    setShiftTypes([]);
    setEnquirySchoolId(null);
    setEnquirySchoolName(null);
    setIsEnquiryModalOpen(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent
        className={`${
          currentStep === 5 ? "max-w-7xl" : "max-w-2xl"
        } max-h-[90vh] overflow-y-auto transition-all duration-300`}
      >
        <div className="relative">
          <div className="mb-8">
            <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">
              {selectedCategory
                ? CATEGORY_TYPES[selectedCategory]?.label
                : "Find Your Perfect Driving School"}
            </h2>
            <p className="text-gray-600">
              Complete the steps below to get started
            </p>
          </div>

          <Stepper value={currentStep} className="mb-8">
            {STEPS.map(({ step, title }) => (
              <StepperItem
                key={step}
                step={step}
                completed={step < currentStep}
                className="max-md:items-start [&:not(:last-child)]:flex-1"
              >
                <StepperTrigger asChild className="max-md:flex-col">
                  <div className="flex items-center gap-3">
                    <span>
                      <StepperIndicator />
                    </span>
                    <div className="text-left hidden md:block">
                      <StepperTitle>{title}</StepperTitle>
                    </div>
                  </div>
                </StepperTrigger>
                {step < STEPS.length && (
                  <StepperSeparator className="max-md:mt-3.5 md:mx-4" />
                )}
              </StepperItem>
            ))}
          </Stepper>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[300px]"
            >
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-semibold mb-4 block">
                      Choose Your License Type
                    </Label>
                    <p className="text-sm text-gray-600 mb-6">
                      Select the driving license category you want to pursue
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2">
                      {Object.entries(CATEGORY_TYPES).map(([id, category]) => {
                        const isSelected = selectedCategory === Number(id);
                        return (
                          <button
                            key={id}
                            onClick={() => setSelectedCategory(Number(id))}
                            className={`
                              relative p-6 rounded-xl border-2 transition-all text-center
                              ${
                                isSelected
                                  ? "border-gold-600 bg-gold-50 shadow-md"
                                  : "border-gray-200 hover:border-gold-300 hover:shadow-sm"
                              }
                            `}
                          >
                            <div className="flex flex-col items-center gap-3">
                              <div
                                className={`
                                w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center
                                ${isSelected ? "bg-gold-100" : ""}
                              `}
                              >
                                <GraduationCap
                                  className={`h-8 w-8 ${
                                    isSelected
                                      ? "text-gold-600"
                                      : "text-gray-600"
                                  }`}
                                />
                              </div>
                              <span
                                className={`font-medium text-sm ${
                                  isSelected ? "text-gold-700" : "text-gray-900"
                                }`}
                              >
                                {category.label}
                              </span>
                            </div>
                            {isSelected && (
                              <div className="absolute top-2 right-2">
                                <Check className="h-5 w-5 text-gold-600" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {errors.category && (
                      <p className="text-sm text-red-600 mt-2">
                        {errors.category}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <Label
                      htmlFor="location"
                      className="text-base font-semibold mb-2 block"
                    >
                      Select Location
                    </Label>
                    {loadingCities ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600"></div>
                      </div>
                    ) : (
                      <Select
                        value={location}
                        onValueChange={setLocation}
                        disabled={loadingCities}
                      >
                        <SelectTrigger id="location" className="h-12">
                          <SelectValue placeholder="Choose your area" />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((city) => (
                            <SelectItem key={city} value={city}>
                              {city}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    {errors.location && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.location}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-semibold mb-4 block">
                      Do you have a driving license from your home country?
                    </Label>
                    <RadioGroup
                      value={hasLicense}
                      onValueChange={setHasLicense}
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <label
                          htmlFor="license-yes"
                          className={`
                            flex items-center justify-center gap-3 p-6 rounded-lg border-2 cursor-pointer transition-all
                            ${
                              hasLicense === "yes"
                                ? "border-gold-600 bg-gold-50"
                                : "border-gray-200 hover:border-gold-300"
                            }
                          `}
                        >
                          <RadioGroupItem value="yes" id="license-yes" />
                          <div className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-green-600" />
                            <span className="font-medium">Yes</span>
                          </div>
                        </label>
                        <label
                          htmlFor="license-no"
                          className={`
                            flex items-center justify-center gap-3 p-6 rounded-lg border-2 cursor-pointer transition-all
                            ${
                              hasLicense === "no"
                                ? "border-gold-600 bg-gold-50"
                                : "border-gray-200 hover:border-gold-300"
                            }
                          `}
                        >
                          <RadioGroupItem value="no" id="license-no" />
                          <div className="flex items-center gap-2">
                            <X className="h-5 w-5 text-red-600" />
                            <span className="font-medium">No</span>
                          </div>
                        </label>
                      </div>
                    </RadioGroup>
                    {errors.hasLicense && (
                      <p className="text-sm text-red-600 mt-2">
                        {errors.hasLicense}
                      </p>
                    )}

                    {/* Nested question for license age */}
                    <AnimatePresence>
                      {hasLicense === "yes" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-6 overflow-hidden"
                        >
                          <div className="bg-gold-50/50 rounded-lg p-6 border-2 border-gold-200">
                            <Label className="text-base font-semibold mb-4 block">
                              How old is your home country license?
                            </Label>
                            <RadioGroup
                              value={licenseAge}
                              onValueChange={(value) => {
                                setLicenseAge(value);
                                setErrors((prev) => ({
                                  ...prev,
                                  licenseAge: "",
                                }));
                              }}
                            >
                              <div className="grid grid-cols-2 gap-4">
                                <label
                                  htmlFor="license-2yrs"
                                  className={`
                                    flex items-center justify-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all bg-white
                                    ${
                                      licenseAge === "2yrs"
                                        ? "border-gold-600 bg-gold-100 shadow-md"
                                        : "border-gray-200 hover:border-gold-300"
                                    }
                                  `}
                                >
                                  <RadioGroupItem
                                    value="2yrs"
                                    id="license-2yrs"
                                  />
                                  <span className="font-medium">2+ Years</span>
                                </label>
                                <label
                                  htmlFor="license-5yrs"
                                  className={`
                                    flex items-center justify-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all bg-white
                                    ${
                                      licenseAge === "5yrs"
                                        ? "border-gold-600 bg-gold-100 shadow-md"
                                        : "border-gray-200 hover:border-gold-300"
                                    }
                                  `}
                                >
                                  <RadioGroupItem
                                    value="5yrs"
                                    id="license-5yrs"
                                  />
                                  <span className="font-medium">5+ Years</span>
                                </label>
                              </div>
                            </RadioGroup>
                            {errors.licenseAge && (
                              <p className="text-sm text-red-600 mt-2">
                                {errors.licenseAge}
                              </p>
                            )}
                            <p className="text-xs text-gray-600 mt-3">
                              This helps us match you with the right course
                              level
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {hasLicense === "no" && (
                      <p className="text-sm text-gray-600 mt-4">
                        No problem! You'll start with beginner-friendly courses.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-semibold mb-2 block">
                      Select Your Preferred Package Type
                    </Label>
                    <p className="text-sm text-gray-600 mb-4">
                      Choose the package type that best fits your schedule and
                      preferences
                    </p>

                    {loadingShiftTypes ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600"></div>
                      </div>
                    ) : shiftTypes.length > 0 ? (
                      <RadioGroup
                        value={selectedShiftType}
                        onValueChange={setSelectedShiftType}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {shiftTypes.map((shiftType) => (
                            <label
                              key={shiftType}
                              htmlFor={`shift-${shiftType}`}
                              className={`
                                flex items-center gap-3 p-6 rounded-lg border-2 cursor-pointer transition-all
                                ${
                                  selectedShiftType === shiftType
                                    ? "border-gold-600 bg-gold-50"
                                    : "border-gray-200 hover:border-gold-300"
                                }
                              `}
                            >
                              <RadioGroupItem
                                value={shiftType}
                                id={`shift-${shiftType}`}
                              />
                              <span className="font-medium capitalize">
                                {shiftType}
                              </span>
                            </label>
                          ))}
                        </div>
                      </RadioGroup>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-gray-600">
                          No package types available for your selection.
                        </p>
                      </div>
                    )}

                    {errors.shiftType && (
                      <p className="text-sm text-red-600 mt-2">
                        {errors.shiftType}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="font-heading text-xl font-semibold mb-2">
                      Available Schools in {location}
                    </h3>
                    <p className="text-sm text-gray-600">
                      For{" "}
                      {experienceLevel === "beginner"
                        ? "beginners"
                        : "experienced drivers"}
                    </p>
                  </div>

                  {loadingPackages ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold-600"></div>
                    </div>
                  ) : Object.keys(groupedPackages).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-h-[600px] overflow-y-auto pr-2">
                      {Object.values(groupedPackages).map((school: any) => (
                        <Card
                          key={school.schoolId}
                          className="flex flex-col hover:shadow-lg transition-shadow border-2 hover:border-gold-400 h-full"
                        >
                          <CardHeader className="pb-3 border-b bg-gradient-to-br from-gold-50 to-white">
                            <div className="space-y-3">
                              <CardTitle className="text-base font-bold text-gray-900 line-clamp-2">
                                {school.schoolName}
                              </CardTitle>
                              <div className="flex items-center justify-between">
                                {school.rating && (
                                  <div className="flex items-center gap-1 text-sm text-gray-600">
                                    <span className="text-yellow-500">⭐</span>
                                    <span className="font-medium">
                                      {school.rating.toFixed(1)}
                                    </span>
                                  </div>
                                )}
                                <Badge variant="secondary" className="text-xs">
                                  {school.packages.length} package
                                  {school.packages.length !== 1 ? "s" : ""}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>

                          <CardContent className="pt-4 flex-1 flex flex-col">
                            <div className="space-y-3 flex-1">
                              {school.packages.map(
                                (pkg: any, index: number) => (
                                  <div
                                    key={pkg.id}
                                    className="p-3 rounded-lg border border-gray-200 hover:border-gold-300 hover:bg-gold-50/50 transition-all"
                                  >
                                    <div className="space-y-2">
                                      <div className="flex items-start justify-between gap-2">
                                        <h5 className="font-heading font-semibold text-sm text-gray-900 line-clamp-2">
                                          {pkg.name}
                                        </h5>
                                      </div>

                                      <div className="flex items-center justify-between">
                                        <div className="text-xs text-gray-500">
                                          {pkg.courseLevelName && (
                                            <div className="flex flex-col gap-0.5">
                                              <span className="font-medium">
                                                {pkg.courseLevelName}
                                              </span>
                                              <span className="text-gold-600">
                                                {pkg.shiftType}
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                        <Badge className="bg-gold-600 text-xs whitespace-nowrap">
                                          AED {pkg.fee_aed.toLocaleString()}
                                        </Badge>
                                      </div>

                                      {pkg.details?.notes && (
                                        <p className="text-xs text-gray-600 italic line-clamp-2">
                                          {pkg.details.notes}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                )
                              )}
                            </div>

                            <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-gray-100">
                              <div className="flex items-center gap-2">
                                <Link
                                  href={`/school/${school.schoolId}`}
                                  className="flex-1"
                                >
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full border-gold-200 text-gold-700 transition-all hover:bg-gold-50 hover:border-gold-300"
                                  >
                                    View Details
                                  </Button>
                                </Link>
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    handleCompareClick(
                                      school.schoolId,
                                      school.schoolName
                                    )
                                  }
                                  className={
                                    isInComparison(school.schoolId)
                                      ? "bg-gold-600 text-white hover:bg-gold-700"
                                      : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                                  }
                                >
                                  {isInComparison(school.schoolId) ? (
                                    <>
                                      <Check className="mr-1 h-4 w-4" />
                                      Added
                                    </>
                                  ) : (
                                    <>
                                      <GitCompare className="mr-1 h-4 w-4" />
                                      Compare
                                    </>
                                  )}
                                </Button>
                              </div>
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleEnquireClick(
                                    school.schoolId,
                                    school.schoolName
                                  )
                                }
                                className="w-full bg-gold-600 text-white hover:bg-gold-700"
                              >
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Enquire Now
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-600 mb-2">
                        No packages found for your selection.
                      </p>
                      <p className="text-sm text-gray-500">
                        Location: {location} • Experience: {experienceLevel}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="h-12 px-6"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}

            <div className={currentStep === 1 ? "ml-auto" : "ml-auto"}>
              {currentStep < 5 ? (
                <Button
                  onClick={handleNext}
                  className="h-12 px-8 bg-gold-600 hover:bg-gold-700"
                >
                  Continue
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="h-12 px-8 bg-gold-600 hover:bg-gold-700"
                >
                  View Schools
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>

      <EnquiryModal
        isOpen={isEnquiryModalOpen}
        onClose={() => {
          setIsEnquiryModalOpen(false);
          setEnquirySchoolId(null);
          setEnquirySchoolName(null);
        }}
        schoolId={enquirySchoolId || undefined}
        schoolName={enquirySchoolName || undefined}
      />
    </Dialog>
  );
}
