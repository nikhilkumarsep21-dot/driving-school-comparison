"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft, MapPin, Pencil, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { AddLocationDialog } from "@/components/dashboard/add-location-dialog";
import { EditLocationDialog } from "@/components/dashboard/edit-location-dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface School {
  id: string;
  name: string;
  email: string;
  phone: string;
  website: string;
  logo_url: string;
  rating: number;
  review_count: number;
}

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

export default function EditSchoolPage() {
  const params = useParams();
  const router = useRouter();
  const [school, setSchool] = useState<School | null>(null);
  const [locations, setLocations] = useState<BranchLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addLocationOpen, setAddLocationOpen] = useState(false);
  const [editLocationOpen, setEditLocationOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] =
    useState<BranchLocation | null>(null);
  const [deleteLocationOpen, setDeleteLocationOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] =
    useState<BranchLocation | null>(null);
  const [deletingLocation, setDeletingLocation] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchSchool(params.id as string);
      fetchLocations(params.id as string);
    }
  }, [params.id]);

  const fetchSchool = async (id: string) => {
    try {
      const response = await fetch(`/api/dashboard/schools/${id}`);
      const data = await response.json();
      setSchool(data.school);
    } catch (error) {
      console.error("Error fetching school:", error);
      toast.error("Failed to load school");
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async (schoolId: string) => {
    try {
      const response = await fetch(
        `/api/dashboard/schools/locations?school_id=${schoolId}`
      );
      const data = await response.json();
      setLocations(data.locations || []);
    } catch (error) {
      console.error("Error fetching locations:", error);
      toast.error("Failed to load locations");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!school) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/dashboard/schools/${school.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(school),
      });

      if (response.ok) {
        toast.success("School updated successfully");
        router.push("/dashboard/schools");
      } else {
        toast.error("Failed to update school");
      }
    } catch (error) {
      console.error("Error updating school:", error);
      toast.error("Failed to update school");
    } finally {
      setSaving(false);
    }
  };

  const handleEditLocation = (location: BranchLocation) => {
    setSelectedLocation(location);
    setEditLocationOpen(true);
  };

  const handleDeleteLocation = (location: BranchLocation) => {
    setLocationToDelete(location);
    setDeleteLocationOpen(true);
  };

  const confirmDeleteLocation = async () => {
    if (!locationToDelete) return;

    setDeletingLocation(true);
    try {
      const response = await fetch(
        `/api/dashboard/schools/locations/${locationToDelete.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toast.success("Location deleted successfully");
        fetchLocations(params.id as string);
      } else {
        toast.error("Failed to delete location");
      }
    } catch (error) {
      console.error("Error deleting location:", error);
      toast.error("Failed to delete location");
    } finally {
      setDeletingLocation(false);
      setDeleteLocationOpen(false);
      setLocationToDelete(null);
    }
  };

  const handleLocationSuccess = () => {
    fetchLocations(params.id as string);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!school) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500">School not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/schools">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <div>
          <h2 className="font-heading text-3xl font-bold text-slate-900">
            Edit School
          </h2>
          <p className="text-slate-500 mt-1">Update school information</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>School Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">School Name *</Label>
                <Input
                  id="name"
                  value={school.name}
                  onChange={(e) =>
                    setSchool({ ...school, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={school.email || ""}
                  onChange={(e) =>
                    setSchool({ ...school, email: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={school.phone || ""}
                  onChange={(e) =>
                    setSchool({ ...school, phone: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  type="url"
                  value={school.website || ""}
                  onChange={(e) =>
                    setSchool({ ...school, website: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo_url">Logo URL</Label>
                <Input
                  id="logo_url"
                  type="url"
                  value={school.logo_url || ""}
                  onChange={(e) =>
                    setSchool({ ...school, logo_url: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rating">Rating</Label>
                <Input
                  id="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="5"
                  value={school.rating}
                  onChange={(e) =>
                    setSchool({ ...school, rating: parseFloat(e.target.value) })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="review_count">Review Count</Label>
                <Input
                  id="review_count"
                  type="number"
                  min="0"
                  value={school.review_count}
                  onChange={(e) =>
                    setSchool({
                      ...school,
                      review_count: parseInt(e.target.value),
                    })
                  }
                />
              </div>
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
              <Link href="/dashboard/schools">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Branch Locations Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Branch Locations</CardTitle>
          <Button onClick={() => setAddLocationOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Location
          </Button>
        </CardHeader>
        <CardContent>
          {locations.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No branch locations added yet</p>
              <p className="text-sm mt-1">
                Click "Add Location" to add a branch location
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {locations.map((location) => (
                <div
                  key={location.id}
                  className="border rounded-lg p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <MapPin className="h-5 w-5 text-slate-500" />
                        <h4 className="font-semibold text-lg">
                          {location.name}
                        </h4>
                      </div>
                      <div className="space-y-1 text-sm text-slate-600">
                        <p>
                          <span className="font-medium">Address:</span>{" "}
                          {location.address}
                        </p>
                        <p>
                          <span className="font-medium">City:</span>{" "}
                          {location.city}
                        </p>
                        {location.contact && (
                          <p>
                            <span className="font-medium">Contact:</span>{" "}
                            {location.contact}
                          </p>
                        )}
                        {location.email && (
                          <p>
                            <span className="font-medium">Email:</span>{" "}
                            {location.email}
                          </p>
                        )}
                        {location.normal_hours && (
                          <p>
                            <span className="font-medium">Hours:</span>{" "}
                            {location.normal_hours}
                          </p>
                        )}
                        {location.directions_url && (
                          <p>
                            <a
                              href={location.directions_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View on Map →
                            </a>
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditLocation(location)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteLocation(location)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      {school && (
        <>
          <AddLocationDialog
            open={addLocationOpen}
            onOpenChange={setAddLocationOpen}
            onSuccess={handleLocationSuccess}
            schoolId={school.id}
          />
          <EditLocationDialog
            open={editLocationOpen}
            onOpenChange={setEditLocationOpen}
            onSuccess={handleLocationSuccess}
            location={selectedLocation}
          />
        </>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteLocationOpen}
        onOpenChange={setDeleteLocationOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Location</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{locationToDelete?.name}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingLocation}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteLocation}
              disabled={deletingLocation}
              className="bg-red-600 hover:bg-red-700"
            >
              {deletingLocation ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
