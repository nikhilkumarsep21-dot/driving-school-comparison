"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, User, X, Send, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { getUserDetailsFromCookie, saveUserDetailsToCookie } from "@/lib/cookies";
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
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      // Load user details from cookie if available
      const userDetails = getUserDetailsFromCookie();
      if (userDetails) {
        setName(userDetails.name || "");
        setEmail(userDetails.email || "");
        setPhone(userDetails.phone || "");
      }
    }
  }, [isOpen]);

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
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Enquire Now
          </DialogTitle>
          {schoolName && (
            <p className="text-sm text-gray-600 mt-1">
              Get in touch about <span className="font-semibold">{schoolName}</span>
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
                  className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                  disabled={loading}
                />
              </div>
              {errors.phone && (
                <p className="text-xs text-red-600">{errors.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-medium">
                Message <span className="text-gray-400 text-xs">(Optional)</span>
              </Label>
              <Textarea
                id="message"
                placeholder="Tell us more about your requirements..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                disabled={loading}
                className="resize-none"
              />
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
          By submitting this form, you agree to be contacted by the driving school.
        </p>
      </DialogContent>
    </Dialog>
  );
}
