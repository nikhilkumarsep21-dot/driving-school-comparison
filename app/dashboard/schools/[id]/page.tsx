"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

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

export default function EditSchoolPage() {
  const params = useParams();
  const router = useRouter();
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchSchool(params.id as string);
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
          <h2 className="text-3xl font-bold text-slate-900">Edit School</h2>
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
    </div>
  );
}
