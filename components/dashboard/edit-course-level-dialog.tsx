"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface School {
  id: string;
  name: string;
}

interface LicenseType {
  id: string;
  name: string;
}

interface CourseLevel {
  id: string;
  school_id: string;
  license_type_id: string;
  name: string;
  experience_level: string;
  duration_hours: number;
  description: string;
}

interface EditCourseLevelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  courseLevel: CourseLevel | null;
}

export function EditCourseLevelDialog({
  open,
  onOpenChange,
  onSuccess,
  courseLevel,
}: EditCourseLevelDialogProps) {
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [licenseTypes, setLicenseTypes] = useState<LicenseType[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState({
    school_id: "",
    license_type_id: "",
    name: "",
    experience_level: "",
    duration_hours: "",
    description: "",
  });

  useEffect(() => {
    if (open) {
      fetchSchoolsAndLicenseTypes();
    }
  }, [open]);

  useEffect(() => {
    if (courseLevel) {
      setFormData({
        school_id: courseLevel.school_id || "",
        license_type_id: courseLevel.license_type_id || "",
        name: courseLevel.name || "",
        experience_level: courseLevel.experience_level || "",
        duration_hours: courseLevel.duration_hours?.toString() || "",
        description: courseLevel.description || "",
      });
    }
  }, [courseLevel]);

  const fetchSchoolsAndLicenseTypes = async () => {
    try {
      setLoadingData(true);
      const [schoolsRes, licenseTypesRes] = await Promise.all([
        fetch("/api/dashboard/schools"),
        fetch("/api/dashboard/courses/license-types"),
      ]);

      if (schoolsRes.ok) {
        const schoolsData = await schoolsRes.json();
        setSchools(schoolsData.schools || schoolsData || []);
      }

      if (licenseTypesRes.ok) {
        const licenseTypesData = await licenseTypesRes.json();
        setLicenseTypes(licenseTypesData || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load schools and license types");
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseLevel) return;

    setLoading(true);

    try {
      const payload = {
        ...formData,
        duration_hours: formData.duration_hours
          ? parseInt(formData.duration_hours)
          : null,
      };

      const response = await fetch(
        `/api/dashboard/courses/levels/${courseLevel.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update course level");
      }

      toast.success("Course level updated successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating course level:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update course level"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Course Level</DialogTitle>
          <DialogDescription>
            Update the course level information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="school_id">School *</Label>
              <Select
                value={formData.school_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, school_id: value })
                }
                disabled={loadingData}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a school" />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="license_type_id">License Type *</Label>
              <Select
                value={formData.license_type_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, license_type_id: value })
                }
                disabled={loadingData}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a license type" />
                </SelectTrigger>
                <SelectContent>
                  {licenseTypes.map((licenseType) => (
                    <SelectItem key={licenseType.id} value={licenseType.id}>
                      {licenseType.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Course Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Basic Training"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="experience_level">Experience Level</Label>
              <Select
                value={formData.experience_level}
                onValueChange={(value) =>
                  setFormData({ ...formData, experience_level: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Beginner">Beginner</SelectItem>
                  <SelectItem value="Intermediate">Intermediate</SelectItem>
                  <SelectItem value="Advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="duration_hours">Duration (hours)</Label>
              <Input
                id="duration_hours"
                type="number"
                value={formData.duration_hours}
                onChange={(e) =>
                  setFormData({ ...formData, duration_hours: e.target.value })
                }
                placeholder="e.g., 20"
                min="1"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter course description..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                loading ||
                !formData.school_id ||
                !formData.license_type_id ||
                !formData.name
              }
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Course Level
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
