"use client";

import { useState, useEffect } from "react";
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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AddShiftDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface CourseLevel {
  id: string;
  name: string;
  schools: { name: string };
  license_types: { name: string };
}

export function AddShiftDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddShiftDialogProps) {
  const [saving, setSaving] = useState(false);
  const [courseLevels, setCourseLevels] = useState<CourseLevel[]>([]);
  const [loadingLevels, setLoadingLevels] = useState(true);
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

  const fetchCourseLevels = async () => {
    setLoadingLevels(true);
    try {
      const response = await fetch("/api/dashboard/courses/levels");
      const data = await response.json();
      setCourseLevels(data.courseLevels || []);
    } catch (error) {
      console.error("Error fetching course levels:", error);
      toast.error("Failed to load course levels");
    } finally {
      setLoadingLevels(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch("/api/dashboard/courses/shifts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Shift added successfully");
        onSuccess();
        onOpenChange(false);
        setFormData({
          course_level_id: "",
          type: "",
          description: "",
        });
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to add shift");
      }
    } catch (error) {
      console.error("Error adding shift:", error);
      toast.error("Failed to add shift");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Shift</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="course_level_id">Course Level *</Label>
            {loadingLevels ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <Select
                value={formData.course_level_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, course_level_id: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select course level" />
                </SelectTrigger>
                <SelectContent>
                  {courseLevels.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.schools?.name} - {level.license_types?.name} -{" "}
                      {level.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Shift Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value) =>
                setFormData({ ...formData, type: value })
              }
              required
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

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Enter shift description"
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Shift"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
