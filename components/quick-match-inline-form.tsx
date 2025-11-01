"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  X,
  GitCompare,
  MessageSquare,
  User,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORY_TYPES } from "@/lib/constants";
import {
  getUserDetailsFromCookie,
  saveUserDetailsToCookie,
} from "@/lib/cookies";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { useComparisonStore } from "@/store/comparison-store";
import { EnquiryModal } from "./enquiry-modal";
import Link from "next/link";

interface QuickMatchInlineFormProps {
  selectedCategory: number;
  onComplete?: () => void;
}

export function QuickMatchInlineForm({
  selectedCategory: initialCategory,
  onComplete,
}: QuickMatchInlineFormProps) {
  const router = useRouter();
  const { addSchool, removeSchool, isInComparison, canAddMore } =
    useComparisonStore();
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [location, setLocation] = useState("");
  const [hasLicense, setHasLicense] = useState<string>("");
  const [experienceLevel, setExperienceLevel] = useState<string>("");
  const [selectedShiftType, setSelectedShiftType] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cities, setCities] = useState<string[]>([]);
  const [packages, setPackages] = useState<any[]>([]);
  const [groupedPackages, setGroupedPackages] = useState<Record<string, any>>(
    {}
  );
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingPackages, setLoadingPackages] = useState(false);
  const [enquirySchoolId, setEnquirySchoolId] = useState<string | null>(null);
  const [enquirySchoolName, setEnquirySchoolName] = useState<string | null>(
    null
  );
  const [isEnquiryModalOpen, setIsEnquiryModalOpen] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [capturingLead, setCapturingLead] = useState(false);

  useEffect(() => {
    // Fetch cities when component mounts
    if (cities.length === 0) {
      fetchCities();
    }
    // Load user details from cookie if available
    const userDetails = getUserDetailsFromCookie();
    if (userDetails) {
      setLeadName(userDetails.name || "");
      setLeadEmail(userDetails.email || "");
      setLeadPhone(userDetails.phone || "");
    }
  }, []);

  useEffect(() => {
    if (
      location &&
      experienceLevel &&
      selectedShiftType &&
      startTime &&
      leadCaptured &&
      selectedCategory
    ) {
      fetchPackages();
    }
  }, [
    location,
    experienceLevel,
    selectedShiftType,
    startTime,
    leadCaptured,
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
      setCities(uniqueCities);
    } catch (error) {
      console.error("Error fetching cities:", error);
      toast.error("Failed to load cities");
    } finally {
      setLoadingCities(false);
    }
  };

  const fetchPackages = async () => {
    if (!selectedCategory) return;
    setLoadingPackages(true);
    try {
      const licenseTypeName = CATEGORY_TYPES[selectedCategory]?.label;

      if (!licenseTypeName) {
        toast.error("Invalid category selected");
        return;
      }

      const { data: licenseType, error: licenseError } = await supabase
        .from("license_types")
        .select("id, name")
        .eq("name", licenseTypeName)
        .single();

      if (licenseError) throw licenseError;

      const { data: schoolsInLocation, error: schoolError } = await supabase
        .from("branch_locations")
        .select("school_id, city")
        .eq("city", location);

      if (schoolError) throw schoolError;

      const schoolIds =
        schoolsInLocation?.map((branch) => branch.school_id) || [];

      if (schoolIds.length === 0) {
        setPackages([]);
        setGroupedPackages({});
        return;
      }

      const { data: schools, error: schoolsError } = await supabase
        .from("schools")
        .select("id, name, logo_url, rating")
        .in("id", schoolIds);

      if (schoolsError) throw schoolsError;

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
        .ilike("experience_level", experienceLevel)
        .in("school_id", schoolIds);

      if (courseError) throw courseError;

      const packagesBySchool: Record<string, any> = {};
      const allPackages: any[] = [];

      schools?.forEach((school) => {
        packagesBySchool[school.id] = {
          schoolId: school.id,
          schoolName: school.name,
          logoUrl: school.logo_url,
          rating: school.rating,
          packages: [],
        };
      });

      courseLevels?.forEach((level: any) => {
        level.shifts?.forEach((shift: any) => {
          if (shift.type !== selectedShiftType) return;

          if (shift.packages) {
            shift.packages.forEach((pkg: any) => {
              const packageWithMeta = {
                ...pkg,
                courseLevelName: level.name,
                shiftType: shift.type,
                schoolId: level.school_id,
              };
              allPackages.push(packageWithMeta);

              if (packagesBySchool[level.school_id]) {
                packagesBySchool[level.school_id].packages.push(
                  packageWithMeta
                );
              }
            });
          }
        });
      });

      const filteredPackagesBySchool = Object.fromEntries(
        Object.entries(packagesBySchool).filter(
          ([_, value]: [string, any]) => value.packages.length > 0
        )
      );

      setPackages(allPackages);
      setGroupedPackages(filteredPackagesBySchool);
    } catch (error) {
      console.error("Error fetching packages:", error);
      toast.error("Failed to load packages");
    } finally {
      setLoadingPackages(false);
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

  const handleLeadCapture = async () => {
    const newErrors: Record<string, string> = {};

    if (!leadName.trim()) {
      newErrors.leadName = "Name is required";
    } else if (leadName.trim().length < 2) {
      newErrors.leadName = "Name must be at least 2 characters";
    }

    if (!leadPhone.trim()) {
      newErrors.leadPhone = "Phone number is required";
    } else if (!/^\+?[\d\s-()]{8,}$/.test(leadPhone.trim())) {
      newErrors.leadPhone = "Please enter a valid phone number";
    }

    if (leadEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(leadEmail)) {
      newErrors.leadEmail = "Please enter a valid email address";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setCapturingLead(true);

    try {
      // Save user details to cookie
      saveUserDetailsToCookie({
        name: leadName.trim(),
        email: leadEmail.trim() || "",
        phone: leadPhone.trim(),
      });

      // Save lead to database
      const licenseTypeName = selectedCategory
        ? CATEGORY_TYPES[selectedCategory]?.label
        : null;

      const { error } = await supabase.from("user_queries").insert({
        name: leadName.trim(),
        email: leadEmail.trim() || null,
        phone: leadPhone.trim(),
        school_id: null,
        school_name: null,
        message: `Interested in ${
          licenseTypeName || "driving license"
        } - ${experienceLevel} level - ${selectedShiftType} package - Location: ${location} - Start: ${startTime}`,
        status: "pending",
        license_type: licenseTypeName || null,
        license_status: hasLicense || null,
        package_type: selectedShiftType || null,
        location: location || null,
        start_time: startTime || null,
      });

      if (error) throw error;

      setLeadCaptured(true);
      toast.success("Details saved successfully!", {
        description: "Finding the best schools for you...",
      });

      // Call onComplete callback if provided
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Error capturing lead:", error);
      toast.error("Failed to save details", {
        description: "Please try again.",
      });
    } finally {
      setCapturingLead(false);
    }
  };

  const handleSubmit = () => {
    if (!selectedCategory) return;
    toast.success("Finding schools for you...");

    const params = new URLSearchParams({
      category: selectedCategory.toString(),
      location: location,
      experience: experienceLevel,
      shiftType: selectedShiftType,
      startTime: startTime,
    });

    router.push(`/schools?${params.toString()}`);
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl border-2 border-gold-200 p-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {selectedCategory
              ? CATEGORY_TYPES[selectedCategory]?.label
              : "Quick Match"}{" "}
            - Find Your Perfect School
          </h2>
          <p className="text-gray-600">
            Fill in your preferences to find the perfect driving school
          </p>
        </div>

        {/* Inline Form with Vertical Stepper */}
        <div className="flex gap-8">
          {/* Vertical Stepper */}
          <div className="hidden md:flex flex-col gap-6 min-w-[200px]">
            {/* Step 0: License Type */}
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold text-sm transition-all ${
                    selectedCategory
                      ? "bg-gold-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {selectedCategory ? <Check className="h-5 w-5" /> : "1"}
                </div>
                <div
                  className={`w-0.5 h-12 mt-2 transition-colors ${
                    selectedCategory ? "bg-gold-600" : "bg-gray-200"
                  }`}
                />
              </div>
              <div className="pt-2">
                <p
                  className={`font-semibold text-sm ${
                    selectedCategory ? "text-gold-600" : "text-gray-600"
                  }`}
                >
                  License Type
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Select your category
                </p>
              </div>
            </div>

            {/* Step 1: License Status */}
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold text-sm transition-all ${
                    hasLicense
                      ? "bg-gold-600 text-white"
                      : selectedCategory
                      ? "bg-gray-200 text-gray-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {hasLicense ? <Check className="h-5 w-5" /> : "2"}
                </div>
                <div
                  className={`w-0.5 h-12 mt-2 transition-colors ${
                    hasLicense ? "bg-gold-600" : "bg-gray-200"
                  }`}
                />
              </div>
              <div className="pt-2">
                <p
                  className={`font-semibold text-sm ${
                    hasLicense
                      ? "text-gold-600"
                      : selectedCategory
                      ? "text-gray-600"
                      : "text-gray-400"
                  }`}
                >
                  License Status
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Home country license
                </p>
              </div>
            </div>

            {/* Step 2: Package Type */}
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold text-sm transition-all ${
                    selectedShiftType
                      ? "bg-gold-600 text-white"
                      : hasLicense
                      ? "bg-gray-200 text-gray-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {selectedShiftType ? <Check className="h-5 w-5" /> : "3"}
                </div>
                <div
                  className={`w-0.5 h-12 mt-2 transition-colors ${
                    selectedShiftType ? "bg-gold-600" : "bg-gray-200"
                  }`}
                />
              </div>
              <div className="pt-2">
                <p
                  className={`font-semibold text-sm ${
                    selectedShiftType
                      ? "text-gold-600"
                      : hasLicense
                      ? "text-gray-600"
                      : "text-gray-400"
                  }`}
                >
                  Package Type
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Regular, Flexi, Unlimited
                </p>
              </div>
            </div>

            {/* Step 3: Location */}
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold text-sm transition-all ${
                    location
                      ? "bg-gold-600 text-white"
                      : selectedShiftType
                      ? "bg-gray-200 text-gray-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {location ? <Check className="h-5 w-5" /> : "4"}
                </div>
                <div
                  className={`w-0.5 h-12 mt-2 transition-colors ${
                    location ? "bg-gold-600" : "bg-gray-200"
                  }`}
                />
              </div>
              <div className="pt-2">
                <p
                  className={`font-semibold text-sm ${
                    location
                      ? "text-gold-600"
                      : selectedShiftType
                      ? "text-gray-600"
                      : "text-gray-400"
                  }`}
                >
                  Location
                </p>
                <p className="text-xs text-gray-500 mt-1">Choose your area</p>
              </div>
            </div>

            {/* Step 4: Start Date */}
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold text-sm transition-all ${
                    startTime
                      ? "bg-gold-600 text-white"
                      : location
                      ? "bg-gray-200 text-gray-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {startTime ? <Check className="h-5 w-5" /> : "5"}
                </div>
                <div
                  className={`w-0.5 h-12 mt-2 transition-colors ${
                    startTime ? "bg-gold-600" : "bg-gray-200"
                  }`}
                />
              </div>
              <div className="pt-2">
                <p
                  className={`font-semibold text-sm ${
                    startTime
                      ? "text-gold-600"
                      : location
                      ? "text-gray-600"
                      : "text-gray-400"
                  }`}
                >
                  Start Date
                </p>
                <p className="text-xs text-gray-500 mt-1">When to begin</p>
              </div>
            </div>

            {/* Step 5: Your Details */}
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold text-sm transition-all ${
                    leadCaptured
                      ? "bg-gold-600 text-white"
                      : startTime
                      ? "bg-gray-200 text-gray-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {leadCaptured ? <Check className="h-5 w-5" /> : "6"}
                </div>
                <div
                  className={`w-0.5 h-12 mt-2 transition-colors ${
                    leadCaptured ? "bg-gold-600" : "bg-gray-200"
                  }`}
                />
              </div>
              <div className="pt-2">
                <p
                  className={`font-semibold text-sm ${
                    leadCaptured
                      ? "text-gold-600"
                      : startTime
                      ? "text-gray-600"
                      : "text-gray-400"
                  }`}
                >
                  Your Details
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Contact information
                </p>
              </div>
            </div>

            {/* Step 6: Results */}
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold text-sm transition-all ${
                    leadCaptured && Object.keys(groupedPackages).length > 0
                      ? "bg-gold-600 text-white"
                      : leadCaptured
                      ? "bg-gray-200 text-gray-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  7
                </div>
              </div>
              <div className="pt-2">
                <p
                  className={`font-semibold text-sm ${
                    leadCaptured && Object.keys(groupedPackages).length > 0
                      ? "text-gold-600"
                      : leadCaptured
                      ? "text-gray-600"
                      : "text-gray-400"
                  }`}
                >
                  Results
                </p>
                <p className="text-xs text-gray-500 mt-1">Available schools</p>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 space-y-6">
            {/* Step 0: License Type Selection */}
            <AnimatePresence mode="wait">
              <motion.div
                key="license-type"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3 overflow-hidden"
              >
                <div className="flex items-center gap-2 md:hidden">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-600 text-white font-semibold text-sm">
                    1
                  </div>
                  <Label className="text-base font-semibold">
                    Select License Type
                  </Label>
                </div>
                <Label className="text-base font-semibold hidden md:block">
                  Select License Type
                </Label>
                <p className="text-sm text-gray-600">
                  Choose the type of license you want to obtain
                </p>
                <Select
                  value={selectedCategory?.toString() || ""}
                  onValueChange={(value) => {
                    setSelectedCategory(Number(value));
                    setHasLicense("");
                    setExperienceLevel("");
                    setSelectedShiftType("");
                    setLocation("");
                    setStartTime("");
                    setErrors((prev) => ({ ...prev, licenseType: "" }));
                  }}
                >
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Choose license category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Motorcycle</SelectItem>
                    <SelectItem value="2">Light Motor Vehicle</SelectItem>
                    <SelectItem value="3">Heavy Truck</SelectItem>
                    <SelectItem value="4">Light Bus</SelectItem>
                    <SelectItem value="5">Heavy Bus</SelectItem>
                    <SelectItem value="6">Light Forklift</SelectItem>
                    <SelectItem value="7">Heavy Forklift</SelectItem>
                  </SelectContent>
                </Select>
                {errors.licenseType && (
                  <p className="text-sm text-red-600">{errors.licenseType}</p>
                )}
                {selectedCategory && (
                  <p className="text-sm text-gray-600">
                    Great! You've selected{" "}
                    {selectedCategory &&
                      CATEGORY_TYPES[selectedCategory]?.label}
                  </p>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Step 1: License Status */}
            <AnimatePresence>
              {selectedCategory && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 overflow-hidden"
                >
                  <div className="flex items-center gap-2 md:hidden">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-600 text-white font-semibold text-sm">
                      2
                    </div>
                    <Label className="text-base font-semibold">
                      Do you have a driving license from your home country?
                    </Label>
                  </div>
                  <Label className="text-base font-semibold hidden md:block">
                    Do you have a driving license from your home country?
                  </Label>
                  <RadioGroup
                    value={hasLicense}
                    onValueChange={(value) => {
                      setHasLicense(value);
                      const newExperienceLevel =
                        value === "yes" ? "expert" : "beginner";
                      setExperienceLevel(newExperienceLevel);
                      setSelectedShiftType("");
                      setLocation("");
                      setErrors((prev) => ({ ...prev, hasLicense: "" }));
                    }}
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <label
                        htmlFor="license-yes"
                        className={`
                          relative flex items-center justify-center gap-2 p-5 rounded-xl cursor-pointer transition-all
                          ${
                            hasLicense === "yes"
                              ? "bg-gold-600 text-white shadow-md"
                              : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                          }
                        `}
                      >
                        <RadioGroupItem
                          value="yes"
                          id="license-yes"
                          className="sr-only"
                        />
                        <Check
                          className={`h-5 w-5 ${
                            hasLicense === "yes"
                              ? "text-white"
                              : "text-gray-400"
                          }`}
                        />
                        <span className="font-semibold">Yes</span>
                        {hasLicense === "yes" && (
                          <div className="absolute top-2 right-2">
                            <div className="h-2 w-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </label>
                      <label
                        htmlFor="license-no"
                        className={`
                          relative flex items-center justify-center gap-2 p-5 rounded-xl cursor-pointer transition-all
                          ${
                            hasLicense === "no"
                              ? "bg-gold-600 text-white shadow-md"
                              : "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200"
                          }
                        `}
                      >
                        <RadioGroupItem
                          value="no"
                          id="license-no"
                          className="sr-only"
                        />
                        <X
                          className={`h-5 w-5 ${
                            hasLicense === "no" ? "text-white" : "text-gray-400"
                          }`}
                        />
                        <span className="font-semibold">No</span>
                        {hasLicense === "no" && (
                          <div className="absolute top-2 right-2">
                            <div className="h-2 w-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </label>
                    </div>
                  </RadioGroup>
                  {errors.hasLicense && (
                    <p className="text-sm text-red-600">{errors.hasLicense}</p>
                  )}
                  {hasLicense && (
                    <p className="text-sm text-gray-600">
                      {hasLicense === "yes" &&
                        "Great! You'll be categorized as an experienced driver."}
                      {hasLicense === "no" &&
                        "No problem! You'll start with beginner-friendly courses."}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 2: Package Type */}
            <AnimatePresence>
              {experienceLevel && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 overflow-hidden"
                >
                  <div className="flex items-center gap-2 md:hidden">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-600 text-white font-semibold text-sm">
                      3
                    </div>
                    <Label className="text-base font-semibold">
                      Select Your Preferred Package Type
                    </Label>
                  </div>
                  <Label className="text-base font-semibold hidden md:block">
                    Select Your Preferred Package Type
                  </Label>
                  <p className="text-sm text-gray-600">
                    Choose the package type that best fits your schedule and
                    preferences
                  </p>

                  <RadioGroup
                    value={selectedShiftType}
                    onValueChange={(value) => {
                      setSelectedShiftType(value);
                      setLocation("");
                      setErrors((prev) => ({ ...prev, shiftType: "" }));
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {["Regular", "Flexi", "Unlimited"].map((shiftType) => (
                        <label
                          key={shiftType}
                          htmlFor={`shift-${shiftType}`}
                          className={`
                                  flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all
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
                          <span className="font-medium">{shiftType}</span>
                        </label>
                      ))}
                    </div>
                  </RadioGroup>

                  {errors.shiftType && (
                    <p className="text-sm text-red-600">{errors.shiftType}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 3: Location */}
            <AnimatePresence>
              {experienceLevel && selectedShiftType && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 overflow-hidden"
                >
                  <div className="flex items-center gap-2 md:hidden">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-600 text-white font-semibold text-sm">
                      4
                    </div>
                    <Label
                      htmlFor="location"
                      className="text-base font-semibold"
                    >
                      Select Location
                    </Label>
                  </div>
                  <Label
                    htmlFor="location"
                    className="text-base font-semibold hidden md:block"
                  >
                    Select Location
                  </Label>
                  {loadingCities ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold-600"></div>
                    </div>
                  ) : (
                    <Select
                      value={location}
                      onValueChange={(value) => {
                        setLocation(value);
                        if (errors.location) {
                          setErrors((prev) => ({
                            ...prev,
                            location: "",
                          }));
                        }
                      }}
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
                    <p className="text-sm text-red-600">{errors.location}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 4: Start Date */}
            <AnimatePresence>
              {experienceLevel && selectedShiftType && location && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-3 overflow-hidden"
                >
                  <div className="flex items-center gap-2 md:hidden">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-600 text-white font-semibold text-sm">
                      5
                    </div>
                    <Label className="text-base font-semibold">
                      How soon do you want to start?
                    </Label>
                  </div>
                  <Label className="text-base font-semibold hidden md:block">
                    How soon do you want to start?
                  </Label>
                  <RadioGroup
                    value={startTime}
                    onValueChange={(value) => {
                      setStartTime(value);
                      setErrors((prev) => ({ ...prev, startTime: "" }));
                    }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        {
                          value: "immediately",
                          label: "Immediately (This week)",
                        },
                        { value: "1-2weeks", label: "1-2 Weeks" },
                        { value: "3-4weeks", label: "3-4 Weeks" },
                        { value: "1month+", label: "1 Month or Later" },
                      ].map((option) => (
                        <label
                          key={option.value}
                          htmlFor={`start-${option.value}`}
                          className={`
                                flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all
                                ${
                                  startTime === option.value
                                    ? "border-gold-600 bg-gold-50"
                                    : "border-gray-200 hover:border-gold-300"
                                }
                              `}
                        >
                          <RadioGroupItem
                            value={option.value}
                            id={`start-${option.value}`}
                          />
                          <span className="font-medium">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </RadioGroup>
                  {errors.startTime && (
                    <p className="text-sm text-red-600">{errors.startTime}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step 5: Lead Capture */}
            <AnimatePresence>
              {experienceLevel &&
                selectedShiftType &&
                location &&
                startTime && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-3 overflow-hidden"
                  >
                    <div className="flex items-center gap-2 md:hidden">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-600 text-white font-semibold text-sm">
                        6
                      </div>
                      <Label className="text-base font-semibold">
                        Your Contact Details
                      </Label>
                    </div>
                    <Label className="text-base font-semibold hidden md:block">
                      Your Contact Details
                    </Label>
                    <p className="text-sm text-gray-600">
                      Enter your details to see personalized school
                      recommendations
                    </p>

                    {!leadCaptured && (
                      <div className="space-y-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
                        <div className="space-y-2">
                          <Label
                            htmlFor="lead-name"
                            className="text-sm font-medium"
                          >
                            Full Name <span className="text-red-500">*</span>
                          </Label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="lead-name"
                              type="text"
                              placeholder="Enter your full name"
                              value={leadName}
                              onChange={(e) => setLeadName(e.target.value)}
                              className={`pl-10 bg-white ${
                                errors.leadName ? "border-red-500" : ""
                              }`}
                              disabled={capturingLead}
                            />
                          </div>
                          {errors.leadName && (
                            <p className="text-xs text-red-600">
                              {errors.leadName}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="lead-phone"
                            className="text-sm font-medium"
                          >
                            Phone Number <span className="text-red-500">*</span>
                          </Label>
                          <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="lead-phone"
                              type="tel"
                              placeholder="+971 XX XXX XXXX"
                              value={leadPhone}
                              onChange={(e) => setLeadPhone(e.target.value)}
                              className={`pl-10 bg-white ${
                                errors.leadPhone ? "border-red-500" : ""
                              }`}
                              disabled={capturingLead}
                            />
                          </div>
                          {errors.leadPhone && (
                            <p className="text-xs text-red-600">
                              {errors.leadPhone}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label
                            htmlFor="lead-email"
                            className="text-sm font-medium"
                          >
                            Email Address{" "}
                            <span className="text-gray-400 text-xs">
                              (Optional)
                            </span>
                          </Label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              id="lead-email"
                              type="email"
                              placeholder="your.email@example.com"
                              value={leadEmail}
                              onChange={(e) => setLeadEmail(e.target.value)}
                              className={`pl-10 bg-white ${
                                errors.leadEmail ? "border-red-500" : ""
                              }`}
                              disabled={capturingLead}
                            />
                          </div>
                          {errors.leadEmail && (
                            <p className="text-xs text-red-600">
                              {errors.leadEmail}
                            </p>
                          )}
                        </div>

                        <Button
                          onClick={handleLeadCapture}
                          disabled={capturingLead}
                          className="w-full bg-gold-600 hover:bg-gold-700 h-12"
                        >
                          {capturingLead ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                              Saving...
                            </>
                          ) : (
                            "Continue to View Schools"
                          )}
                        </Button>
                      </div>
                    )}

                    {leadCaptured && (
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-green-700">
                          <Check className="h-5 w-5" />
                          <p className="font-medium">
                            Details saved successfully!
                          </p>
                        </div>
                        <p className="text-sm text-green-600 mt-1">
                          Loading personalized recommendations for you...
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
            </AnimatePresence>

            {/* Step 6: Results */}
            <AnimatePresence>
              {experienceLevel &&
                selectedShiftType &&
                location &&
                startTime &&
                leadCaptured && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div className="flex items-center gap-2 md:hidden">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-600 text-white font-semibold text-sm">
                        7
                      </div>
                      <div>
                        <h3 className="text-base font-semibold">
                          Available Schools in {location}
                        </h3>
                        <p className="text-sm text-gray-600">
                          For{" "}
                          {experienceLevel === "beginner"
                            ? "beginners"
                            : "experienced drivers"}
                        </p>
                      </div>
                    </div>
                    <div className="hidden md:block">
                      <h3 className="text-base font-semibold">
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
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[600px] overflow-y-auto pr-2">
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
                                      <span className="text-yellow-500">
                                        ⭐
                                      </span>
                                      <span className="font-medium">
                                        {school.rating.toFixed(1)}
                                      </span>
                                    </div>
                                  )}
                                  <Badge
                                    variant="secondary"
                                    className="text-xs"
                                  >
                                    {school.packages.length} package
                                    {school.packages.length !== 1 ? "s" : ""}
                                  </Badge>
                                </div>
                              </div>
                            </CardHeader>

                            <CardContent className="pt-4 flex-1 flex flex-col">
                              <div className="space-y-3 flex-1">
                                {school.packages.map((pkg: any) => (
                                  <div
                                    key={pkg.id}
                                    className="p-3 rounded-lg border border-gray-200 hover:border-gold-300 hover:bg-gold-50/50 transition-all"
                                  >
                                    <div className="space-y-2">
                                      <div className="flex items-start justify-between gap-2">
                                        <h5 className="font-semibold text-sm text-gray-900 line-clamp-2">
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
                                ))}
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
                      <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-600 mb-2">
                          No packages found for your selection.
                        </p>
                        <p className="text-sm text-gray-500">
                          Location: {location} • Experience: {experienceLevel}
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
            </AnimatePresence>
          </div>
        </div>

        {/* Action Buttons */}
        {location &&
          experienceLevel &&
          selectedShiftType &&
          startTime &&
          Object.keys(groupedPackages).length > 0 && (
            <div className="flex justify-end mt-6 pt-6 border-t">
              <Button
                onClick={handleSubmit}
                className="h-12 px-8 bg-gold-600 hover:bg-gold-700"
              >
                View All Schools
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
      </div>

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
    </>
  );
}
