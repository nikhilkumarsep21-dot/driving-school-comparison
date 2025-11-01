"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, User, X, Send, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  getUserDetailsFromCookie,
  saveUserDetailsToCookie,
} from "@/lib/cookies";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  schoolId?: string;
  schoolName?: string;
}

export function EnquiryModal({
  isOpen,
  onClose,
  schoolId,
  schoolName,
}: EnquiryModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [licenseType, setLicenseType] = useState("");
  const [licenseStatus, setLicenseStatus] = useState("");
  const [packageType, setPackageType] = useState("");
  const [location, setLocation] = useState("");
  const [startTime, setStartTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [cities, setCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Load user details from cookie if available
      const userDetails = getUserDetailsFromCookie();
      if (userDetails) {
        setName(userDetails.name || "");
        setEmail(userDetails.email || "");
        setPhone(userDetails.phone || "");
      }
      // Fetch cities when modal opens
      if (cities.length === 0) {
        fetchCities();
      }
    }
  }, [isOpen]);

  const fetchCities = async () => {
    if (!schoolId) {
      // If no school ID, fetch all cities
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
      } finally {
        setLoadingCities(false);
      }
      return;
    }

    // Fetch cities specific to this school
    setLoadingCities(true);
    try {
      const { data, error } = await supabase
        .from("branch_locations")
        .select("city")
        .eq("school_id", schoolId)
        .order("city");

      if (error) throw error;

      const uniqueCities = Array.from(
        new Set(data?.map((item) => item.city) || [])
      ).sort();
      setCities(uniqueCities);
    } catch (error) {
      console.error("Error fetching cities:", error);
    } finally {
      setLoadingCities(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-()]{8,}$/.test(phone.trim())) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!licenseType) {
      newErrors.licenseType = "License type is required";
    }

    if (!licenseStatus) {
      newErrors.licenseStatus = "License status is required";
    }

    if (!packageType) {
      newErrors.packageType = "Package type is required";
    }

    if (!location) {
      newErrors.location = "Location is required";
    }

    if (!startTime) {
      newErrors.startTime = "Start time is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Save user details to cookie
      saveUserDetailsToCookie({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });

      // Save enquiry to database
      const { error } = await supabase.from("user_queries").insert({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        school_id: schoolId || null,
        school_name: schoolName || null,
        message: message.trim() || null,
        status: "pending",
        license_type: licenseType || null,
        license_status: licenseStatus || null,
        package_type: packageType || null,
        location: location || null,
        start_time: startTime || null,
      });

      if (error) throw error;

      toast.success("Enquiry submitted successfully!", {
        description: "We'll get back to you soon.",
      });

      handleClose();
    } catch (error) {
      console.error("Error submitting enquiry:", error);
      toast.error("Failed to submit enquiry", {
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setLicenseType("");
    setLicenseStatus("");
    setPackageType("");
    setLocation("");
    setStartTime("");
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Enquire Now
          </DialogTitle>
          {schoolName && (
            <p className="text-sm text-gray-600 mt-1">
              Get in touch about{" "}
              <span className="font-semibold">{schoolName}</span>
            </p>
          )}
        </DialogHeader>

        <AnimatePresence mode="wait">
          <motion.form
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            onSubmit={handleSubmit}
            className="space-y-4 mt-4"
          >
            {/* Personal Information Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Full Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`pl-10 ${errors.name ? "border-red-500" : ""}`}
                      disabled={loading}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-red-600">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium">
                    Phone Number <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+971 XX XXX XXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={`pl-10 ${
                        errors.phone ? "border-red-500" : ""
                      }`}
                      disabled={loading}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-600">{errors.phone}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                    disabled={loading}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-600">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Course Preferences Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">
                Course Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="license-type" className="text-sm font-medium">
                    License Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={licenseType}
                    onValueChange={(value) => {
                      setLicenseType(value);
                      setErrors((prev) => ({ ...prev, licenseType: "" }));
                    }}
                    disabled={loading}
                  >
                    <SelectTrigger
                      id="license-type"
                      className={errors.licenseType ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select license type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                      <SelectItem value="Light Motor Vehicle">
                        Light Motor Vehicle
                      </SelectItem>
                      <SelectItem value="Heavy Truck">Heavy Truck</SelectItem>
                      <SelectItem value="Light Bus">Light Bus</SelectItem>
                      <SelectItem value="Heavy Bus">Heavy Bus</SelectItem>
                      <SelectItem value="Light Forklift">
                        Light Forklift
                      </SelectItem>
                      <SelectItem value="Heavy Forklift">
                        Heavy Forklift
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.licenseType && (
                    <p className="text-xs text-red-600">{errors.licenseType}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="package-type" className="text-sm font-medium">
                    Package Type <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={packageType}
                    onValueChange={(value) => {
                      setPackageType(value);
                      setErrors((prev) => ({ ...prev, packageType: "" }));
                    }}
                    disabled={loading}
                  >
                    <SelectTrigger
                      id="package-type"
                      className={errors.packageType ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select package type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Regular">Regular</SelectItem>
                      <SelectItem value="Flexi">Flexi</SelectItem>
                      <SelectItem value="Unlimited">Unlimited</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.packageType && (
                    <p className="text-xs text-red-600">{errors.packageType}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Do you have a license from your home country?{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={licenseStatus}
                  onValueChange={(value) => {
                    setLicenseStatus(value);
                    setErrors((prev) => ({ ...prev, licenseStatus: "" }));
                  }}
                  disabled={loading}
                  className={
                    errors.licenseStatus
                      ? "border border-red-500 rounded-md p-2"
                      : ""
                  }
                >
                  <div className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="license-yes" />
                      <Label
                        htmlFor="license-yes"
                        className="font-normal cursor-pointer"
                      >
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="license-no" />
                      <Label
                        htmlFor="license-no"
                        className="font-normal cursor-pointer"
                      >
                        No
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
                {errors.licenseStatus && (
                  <p className="text-xs text-red-600">{errors.licenseStatus}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-sm font-medium">
                    Preferred Location <span className="text-red-500">*</span>
                  </Label>
                  {loadingCities ? (
                    <div className="flex items-center justify-center py-3 border rounded-md">
                      <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                    </div>
                  ) : (
                    <Select
                      value={location}
                      onValueChange={(value) => {
                        setLocation(value);
                        setErrors((prev) => ({ ...prev, location: "" }));
                      }}
                      disabled={loading || loadingCities}
                    >
                      <SelectTrigger
                        id="location"
                        className={errors.location ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Select your preferred area" />
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
                    <p className="text-xs text-red-600">{errors.location}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="start-time" className="text-sm font-medium">
                    When do you want to start?{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={startTime}
                    onValueChange={(value) => {
                      setStartTime(value);
                      setErrors((prev) => ({ ...prev, startTime: "" }));
                    }}
                    disabled={loading}
                  >
                    <SelectTrigger
                      id="start-time"
                      className={errors.startTime ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select start time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediately">
                        Immediately (This week)
                      </SelectItem>
                      <SelectItem value="1-2weeks">1-2 Weeks</SelectItem>
                      <SelectItem value="3-4weeks">3-4 Weeks</SelectItem>
                      <SelectItem value="1month+">1 Month or Later</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.startTime && (
                    <p className="text-xs text-red-600">{errors.startTime}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Message Section */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-gray-700 border-b pb-2">
                Additional Information
              </h3>
              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-medium">
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell us more about your requirements..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  disabled={loading}
                  className="resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gold-600 hover:bg-gold-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit
                  </>
                )}
              </Button>
            </div>
          </motion.form>
        </AnimatePresence>

        <p className="text-xs text-gray-500 text-center mt-4">
          By submitting this form, you agree to be contacted by the driving
          school.
        </p>
      </DialogContent>
    </Dialog>
  );
}
