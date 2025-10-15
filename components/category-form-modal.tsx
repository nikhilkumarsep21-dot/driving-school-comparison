'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, Mail, CheckCircle2, Loader2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Stepper,
  StepperItem,
  StepperTrigger,
  StepperIndicator,
  StepperTitle,
  StepperSeparator,
} from '@/components/ui/stepper';
import { LicenseType } from '@/lib/types';
import { LICENSE_TYPES, DUBAI_AREAS } from '@/lib/constants';
import { getUserDetailsFromCookie, saveUserDetailsToCookie } from '@/lib/cookies';
import { toast } from 'sonner';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: LicenseType;
}

const STEPS = [
  { step: 1, title: 'Location', description: 'Choose your preferred area' },
  { step: 2, title: 'Your Details', description: 'Enter your contact information' },
  { step: 3, title: 'Verify Email', description: 'Confirm your email address' },
  { step: 4, title: 'Confirmation', description: 'Review and submit' },
];

export function CategoryFormModal({ isOpen, onClose, selectedCategory }: CategoryFormModalProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [location, setLocation] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpExpiry, setOtpExpiry] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
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

  useEffect(() => {
    if (currentStep === 3 && !canResend && resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [currentStep, canResend, resendTimer]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (step === 1) {
      if (!location) newErrors.location = 'Please select a location';
    }

    if (step === 2) {
      if (!name.trim()) newErrors.name = 'Name is required';
      if (name.trim().length < 2) newErrors.name = 'Name must be at least 2 characters';
      if (!email.trim()) newErrors.email = 'Email is required';
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email format';
      if (!phone.trim()) newErrors.phone = 'Phone number is required';
      if (!/^\+?[\d\s-()]+$/.test(phone)) newErrors.phone = 'Invalid phone number format';
    }

    if (step === 3) {
      if (!otp.trim()) newErrors.otp = 'OTP is required';
      if (otp.trim().length !== 6) newErrors.otp = 'OTP must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendOTP = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          phone,
          selected_category: selectedCategory,
          location,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send OTP');
      }

      setOtpExpiry(data.expiresAt);
      toast.success('OTP sent to your email');
      setCanResend(false);
      setResendTimer(60);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to send OTP');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify OTP');
      }

      toast.success('Email verified successfully');
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to verify OTP');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async () => {
    if (!validateStep(currentStep)) return;

    if (currentStep === 2) {
      try {
        await sendOTP();
        setCurrentStep(currentStep + 1);
      } catch (error) {
        return;
      }
    } else if (currentStep === 3) {
      const verified = await verifyOTP();
      if (verified) {
        setCurrentStep(currentStep + 1);
      }
    } else if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    saveUserDetailsToCookie({ name, email, phone });

    toast.success('Registration complete!');

    const params = new URLSearchParams({
      category: selectedCategory,
      location: location,
    });

    router.push(`/schools?${params.toString()}`);
    onClose();
  };

  const handleResendOTP = async () => {
    if (!canResend) return;
    try {
      await sendOTP();
    } catch (error) {
      console.error('Failed to resend OTP:', error);
    }
  };

  const handleModalClose = () => {
    setCurrentStep(1);
    setLocation('');
    setName('');
    setEmail('');
    setPhone('');
    setOtp('');
    setErrors({});
    setOtpExpiry(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="relative">
          <button
            onClick={handleModalClose}
            className="absolute right-0 top-0 rounded-full p-2 hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {LICENSE_TYPES[selectedCategory].label}
            </h2>
            <p className="text-gray-600">Complete the steps below to get started</p>
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
                    <StepperIndicator />
                    <div className="text-left hidden md:block">
                      <StepperTitle>{title}</StepperTitle>
                    </div>
                  </div>
                </StepperTrigger>
                {step < STEPS.length && <StepperSeparator className="max-md:mt-3.5 md:mx-4" />}
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
                    <Label htmlFor="location" className="text-base font-semibold mb-2 block">
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
                      <p className="text-sm text-red-600 mt-1">{errors.location}</p>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="name" className="text-base font-semibold mb-2 block">
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
                    <Label htmlFor="email" className="text-base font-semibold mb-2 block">
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
                      <p className="text-sm text-red-600 mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-base font-semibold mb-2 block">
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
                      <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gold-100 mb-4">
                      <Mail className="w-8 h-8 text-gold-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Check Your Email</h3>
                    <p className="text-gray-600">
                      We've sent a 6-digit code to <strong>{email}</strong>
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="otp" className="text-base font-semibold mb-2 block">
                      Enter OTP Code
                    </Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      className="h-12 text-center text-2xl tracking-widest"
                      maxLength={6}
                    />
                    {errors.otp && (
                      <p className="text-sm text-red-600 mt-1">{errors.otp}</p>
                    )}
                  </div>

                  <div className="text-center">
                    <button
                      onClick={handleResendOTP}
                      disabled={!canResend || isLoading}
                      className="text-sm text-gold-600 hover:text-gold-700 disabled:text-gray-400 disabled:cursor-not-allowed"
                    >
                      {canResend ? 'Resend OTP' : `Resend in ${resendTimer}s`}
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 text-center">
                    The OTP will expire in 10 minutes
                  </p>
                </div>
              )}

              {currentStep === 4 && (
                <div className="flex items-center justify-center min-h-[300px]">
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">All Set!</h3>
                    <p className="text-gray-600">You're ready to find the perfect driving school</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center justify-between mt-8 pt-6 border-t">
            {currentStep > 1 && currentStep < 4 && (
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={isLoading}
                className="h-12 px-6"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}

            <div className={currentStep === 1 ? 'ml-auto' : 'ml-auto'}>
              {currentStep < 4 ? (
                <Button
                  onClick={handleNext}
                  disabled={isLoading}
                  className="h-12 px-8 bg-gold-600 hover:bg-gold-700"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
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
