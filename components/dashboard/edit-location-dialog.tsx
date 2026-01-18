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
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface BranchLocation {
  id: string;
  school_id: string;
  name: string;
  address: string;
  city: string;
  contact: string | null;
  email: string | null;
  normal_hours: string | null;
  directions_url: string | null;
  coordinates: any;
}

interface EditLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  location: BranchLocation | null;
}

export function EditLocationDialog({
  open,
  onOpenChange,
  onSuccess,
  location,
}: EditLocationDialogProps) {
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    contact: "",
    email: "",
    normal_hours: "",
    directions_url: "",
    coordinates: "",
  });

  useEffect(() => {
    if (location) {
      setFormData({
        name: location.name || "",
        address: location.address || "",
        city: location.city || "",
        contact: location.contact || "",
        email: location.email || "",
        normal_hours: location.normal_hours || "",
        directions_url: location.directions_url || "",
        coordinates: location.coordinates
          ? JSON.stringify(location.coordinates, null, 2)
          : "",
      });
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!location) return;

    setSaving(true);

    try {
      // Parse coordinates if provided
      let coordinatesJson = null;
      if (formData.coordinates.trim()) {
        try {
          coordinatesJson = JSON.parse(formData.coordinates);
        } catch (error) {
          toast.error("Invalid JSON format for coordinates");
          setSaving(false);
          return;
        }
      }

      const response = await fetch(
        `/api/dashboard/schools/locations/${location.id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name,
            address: formData.address,
            city: formData.city,
            contact: formData.contact || null,
            email: formData.email || null,
            normal_hours: formData.normal_hours || null,
            directions_url: formData.directions_url || null,
            coordinates: coordinatesJson,
          }),
        }
      );

      if (response.ok) {
        toast.success("Location updated successfully");
        onSuccess();
        onOpenChange(false);
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to update location");
      }
    } catch (error) {
      console.error("Error updating location:", error);
      toast.error("Failed to update location");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Branch Location</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Branch Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Downtown Branch"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                placeholder="e.g., Dubai"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="Enter full address"
              rows={2}
              required
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact">Contact Number</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) =>
                  setFormData({ ...formData, contact: e.target.value })
                }
                placeholder="e.g., +971 4 123 4567"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="branch@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="normal_hours">Operating Hours</Label>
            <Input
              id="normal_hours"
              value={formData.normal_hours}
              onChange={(e) =>
                setFormData({ ...formData, normal_hours: e.target.value })
              }
              placeholder="e.g., Mon-Fri: 8AM-8PM, Sat-Sun: 9AM-5PM"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="directions_url">Directions URL</Label>
            <Input
              id="directions_url"
              type="url"
              value={formData.directions_url}
              onChange={(e) =>
                setFormData({ ...formData, directions_url: e.target.value })
              }
              placeholder="https://maps.google.com/..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="coordinates">
              Coordinates (JSON format, optional)
            </Label>
            <Textarea
              id="coordinates"
              value={formData.coordinates}
              onChange={(e) =>
                setFormData({ ...formData, coordinates: e.target.value })
              }
              placeholder='{"lat": 25.2048, "lng": 55.2708}'
              rows={2}
            />
            <p className="text-xs text-slate-500">
              Enter coordinates in JSON format with lat and lng properties
            </p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
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
