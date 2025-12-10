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

interface CourseLevel {
  id: string;
  name: string;
}

interface CourseShift {
  id: string;
  course_level_id: string;
  type: string;
  description: string;
}

interface EditShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  shift: CourseShift | null;
}

export function EditShiftDialog({
  open,
  onOpenChange,
  onSuccess,
  shift,
}: EditShiftDialogProps) {
  const [loading, setLoading] = useState(false);
  const [courseLevels, setCourseLevels] = useState<CourseLevel[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState({
    course_level_id: "",
    type: "",
    description: "",
  });

  useEffect(() => {
    if (open) {
      fetchCourseLevels();
    }
  }, [open]);

  useEffect(() => {
    if (shift) {
      setFormData({
        course_level_id: shift.course_level_id || "",
        type: shift.type || "",
        description: shift.description || "",
      });
    }
  }, [shift]);

  const fetchCourseLevels = async () => {
    try {
      setLoadingData(true);
      const response = await fetch("/api/dashboard/courses/levels");
      if (response.ok) {
        const data = await response.json();
        setCourseLevels(data.courseLevels || []);
      }
    } catch (error) {
      console.error("Error fetching course levels:", error);
      toast.error("Failed to load course levels");
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shift) return;

    setLoading(true);

    try {
      const response = await fetch(
        `/api/dashboard/courses/shifts/${shift.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update shift");
      }

      toast.success("Shift updated successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating shift:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update shift"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Shift</DialogTitle>
          <DialogDescription>Update the shift information.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="course_level_id">Course Level *</Label>
              <Select
                value={formData.course_level_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, course_level_id: value })
                }
                disabled={loadingData}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a course level" />
                </SelectTrigger>
                <SelectContent>
                  {courseLevels.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="type">Shift Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select shift type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Regular">Regular</SelectItem>
                  <SelectItem value="Night">Night</SelectItem>
                  <SelectItem value="Weekend">Weekend</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Enter shift description..."
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
              disabled={loading || !formData.course_level_id || !formData.type}
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Shift
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
