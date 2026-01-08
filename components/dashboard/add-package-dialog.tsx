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

interface AddPackageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

interface Shift {
  id: string;
  type: string;
  course_level_id: string;
  course_levels?: {
    name: string;
    schools: { name: string };
    license_types: { name: string };
  };
}

export function AddPackageDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddPackageDialogProps) {
  const [saving, setSaving] = useState(false);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loadingShifts, setLoadingShifts] = useState(true);
  const [formData, setFormData] = useState({
    shift_id: "",
    name: "",
    fee_aed: "",
    details: "",
  });

  useEffect(() => {
    if (open) {
      fetchShifts();
    }
  }, [open]);

  const fetchShifts = async () => {
    setLoadingShifts(true);
    try {
      const response = await fetch("/api/dashboard/courses/shifts");
      const data = await response.json();
      setShifts(data.courseShifts || []);
    } catch (error) {
      console.error("Error fetching shifts:", error);
      toast.error("Failed to load shifts");
    } finally {
      setLoadingShifts(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Validate JSON if details is provided
      let parsedDetails = null;
      if (formData.details.trim()) {
        try {
          parsedDetails = JSON.parse(formData.details);
        } catch (error) {
          toast.error("Invalid JSON format in details field");
          setSaving(false);
          return;
        }
      }

      const response = await fetch("/api/dashboard/courses/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shift_id: formData.shift_id,
          name: formData.name,
          fee_aed: parseFloat(formData.fee_aed),
          details: parsedDetails,
        }),
      });

      if (response.ok) {
        toast.success("Package added successfully");
        onSuccess();
        onOpenChange(false);
        setFormData({
          shift_id: "",
          name: "",
          fee_aed: "",
          details: "",
        });
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to add package");
      }
    } catch (error) {
      console.error("Error adding package:", error);
      toast.error("Failed to add package");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Package</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shift_id">Shift *</Label>
            {loadingShifts ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <Select
                value={formData.shift_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, shift_id: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select shift" />
                </SelectTrigger>
                <SelectContent>
                  {shifts.map((shift) => (
                    <SelectItem key={shift.id} value={shift.id}>
                      {shift.course_levels?.schools?.name} -{" "}
                      {shift.course_levels?.license_types?.name} -{" "}
                      {shift.course_levels?.name} ({shift.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Package Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g., Basic Package, Premium Package"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fee_aed">Fee (AED) *</Label>
            <Input
              id="fee_aed"
              type="number"
              step="0.01"
              min="0"
              value={formData.fee_aed}
              onChange={(e) =>
                setFormData({ ...formData, fee_aed: e.target.value })
              }
              placeholder="e.g., 3500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Details (JSON)</Label>
            <Textarea
              id="details"
              value={formData.details}
              onChange={(e) =>
                setFormData({ ...formData, details: e.target.value })
              }
              placeholder='e.g., {"includes": ["theory", "practical"], "duration": "30 days"}'
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Optional JSON object for additional package information
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Package"
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
