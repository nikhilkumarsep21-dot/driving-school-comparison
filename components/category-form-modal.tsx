"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
import {
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperTitle,
  StepperSeparator,
} from "@/components/ui/stepper";
import { CATEGORY_TYPES } from "@/lib/constants";

const DUBAI_AREAS = [
  'Dubai Marina',
  'Downtown Dubai',
  'Jumeirah',
  'Deira',
  'Al Barsha',
  'Al Qusais',
  'Al Garhoud',
  'Al Quoz',
  'Motor City',
  'Dubai Silicon Oasis',
  'Business Bay',
  'Nad Al Hamar',
  'Al Aweer',
];
import {
  getUserDetailsFromCookie,
  saveUserDetailsToCookie,
} from "@/lib/cookies";
import { toast } from "sonner";

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: number;
}

const STEPS = [
  { step: 1, title: "Location", description: "Choose your preferred area" },
  {
    step: 2,
    title: "Your Details",
    description: "Enter your contact information",
  },
];

export function CategoryFormModal({
  isOpen,
  onClose,
  selectedCategory,
}: CategoryFormModalProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [location, setLocation] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      const savedDetails = getUserDetailsFromCookie();
      if (savedDetails) {
        setName(savedDetails.name);
        setEmail(savedDetails.email);
        setPhone(savedDetails.phone);
      }
    }
  }, [isOpen]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!location) newErrors.location = "Please select a location";
    }

    if (step === 2) {
      if (!name.trim()) newErrors.name = "Name is required";
      if (name.trim().length < 2)
        newErrors.name = "Name must be at least 2 characters";
      if (!email.trim()) newErrors.email = "Email is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        newErrors.email = "Invalid email format";
      if (!phone.trim()) newErrors.phone = "Phone number is required";
      if (!/^\+?[\d\s-()]+$/.test(phone))
        newErrors.phone = "Invalid phone number format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;

    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (!validateStep(currentStep)) return;

    saveUserDetailsToCookie({ name, email, phone });

    toast.success("Details saved! Finding schools for you...");

    const params = new URLSearchParams({
      category: selectedCategory.toString(),
      location: location,
    });

    router.push(`/schools?${params.toString()}`);
    onClose();
  };

  const handleModalClose = () => {
    setCurrentStep(1);
    setLocation("");
    setName("");
    setEmail("");
    setPhone("");
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {CATEGORY_TYPES[selectedCategory]?.label || 'License Category'}
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
                    <Label
                      htmlFor="location"
                      className="text-base font-semibold mb-2 block"
                    >
                      Select Location
                    </Label>
                    <Select value={location} onValueChange={setLocation}>
                      <SelectTrigger id="location" className="h-12">
                        <SelectValue placeholder="Choose your area" />
                      </SelectTrigger>
                      <SelectContent>
                        {DUBAI_AREAS.map((area) => (
                          <SelectItem key={area} value={area}>
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.location && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.location}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <Label
                      htmlFor="name"
                      className="text-base font-semibold mb-2 block"
                    >
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Enter your full name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="h-12"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-600 mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="email"
                      className="text-base font-semibold mb-2 block"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-12"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label
                      htmlFor="phone"
                      className="text-base font-semibold mb-2 block"
                    >
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+971 50 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="h-12"
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.phone}
                      </p>
                    )}
                  </div>
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
              {currentStep < 2 ? (
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
                  Find Schools
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
