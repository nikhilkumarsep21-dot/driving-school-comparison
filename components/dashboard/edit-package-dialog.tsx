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

interface Shift {
  id: string;
  type: string;
}

interface CoursePackage {
  id: string;
  shift_id: string;
  name: string;
  fee_aed: number;
  details?: any;
}

interface EditPackageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  packageData: CoursePackage | null;
}

export function EditPackageDialog({
  open,
  onOpenChange,
  onSuccess,
  packageData,
}: EditPackageDialogProps) {
  const [loading, setLoading] = useState(false);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loadingData, setLoadingData] = useState(true);

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

  useEffect(() => {
    if (packageData) {
      setFormData({
        shift_id: packageData.shift_id || "",
        name: packageData.name || "",
        fee_aed: packageData.fee_aed?.toString() || "",
        details: packageData.details
          ? JSON.stringify(packageData.details, null, 2)
          : "",
      });
    }
  }, [packageData]);

  const fetchShifts = async () => {
    try {
      setLoadingData(true);
      const response = await fetch("/api/dashboard/courses/shifts");
      if (response.ok) {
        const data = await response.json();
        setShifts(data.courseShifts || []);
      }
    } catch (error) {
      console.error("Error fetching shifts:", error);
      toast.error("Failed to load shifts");
    } finally {
      setLoadingData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!packageData) return;

    setLoading(true);

    try {
      // Validate JSON if details is provided
      let parsedDetails = null;
      if (formData.details.trim()) {
        try {
          parsedDetails = JSON.parse(formData.details);
        } catch (error) {
          toast.error("Invalid JSON format in details field");
          setLoading(false);
          return;
        }
      }

      const payload = {
        shift_id: formData.shift_id,
        name: formData.name,
        fee_aed: parseFloat(formData.fee_aed),
        details: parsedDetails,
      };

      const response = await fetch(
        `/api/dashboard/courses/packages/${packageData.id}`,
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
        throw new Error(error.error || "Failed to update package");
      }

      toast.success("Package updated successfully");
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating package:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to update package"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Package</DialogTitle>
          <DialogDescription>Update the package information.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="shift_id">Shift *</Label>
              <Select
                value={formData.shift_id}
                onValueChange={(value) =>
                  setFormData({ ...formData, shift_id: value })
                }
                disabled={loadingData}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a shift" />
                </SelectTrigger>
                <SelectContent>
                  {shifts.map((shift) => (
                    <SelectItem key={shift.id} value={shift.id}>
                      {shift.type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="name">Package Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Basic Package"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="fee_aed">Fee (AED) *</Label>
              <Input
                id="fee_aed"
                type="number"
                step="0.01"
                value={formData.fee_aed}
                onChange={(e) =>
                  setFormData({ ...formData, fee_aed: e.target.value })
                }
                placeholder="e.g., 2500"
                required
              />
            </div>

            <div className="grid gap-2">
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
                !formData.shift_id ||
                !formData.name ||
                !formData.fee_aed
              }
            >
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Package
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
