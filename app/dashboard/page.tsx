import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, GraduationCap, Clock, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function getStats() {
  const supabase = await createClient();

  // Get total enquiries
  const { count: totalEnquiries } = await supabase
    .from("user_queries")
    .select("*", { count: "exact", head: true });

  // Get pending enquiries
  const { count: pendingEnquiries } = await supabase
    .from("user_queries")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  // Get total schools
  const { count: totalSchools } = await supabase
    .from("schools")
    .select("*", { count: "exact", head: true });

  // Get recent enquiries
  const { data: recentEnquiries } = await supabase
    .from("user_queries")
    .select("*, schools(name)")
    .order("created_at", { ascending: false })
    .limit(5);

  return {
    totalEnquiries: totalEnquiries || 0,
    pendingEnquiries: pendingEnquiries || 0,
    totalSchools: totalSchools || 0,
    recentEnquiries: recentEnquiries || [],
  };
}

export default async function DashboardPage() {
  const stats = await getStats();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-3xl font-bold text-slate-900">
          Overview
        </h2>
        <p className="text-slate-500 mt-1">
          Welcome back! Here's what's happening with your driving school
          platform.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Enquiries
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEnquiries}</div>
            <p className="text-xs text-slate-500 mt-1">All time enquiries</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Enquiries
            </CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingEnquiries}</div>
            <p className="text-xs text-slate-500 mt-1">Awaiting response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Schools</CardTitle>
            <GraduationCap className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSchools}</div>
            <p className="text-xs text-slate-500 mt-1">Active schools</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalEnquiries > 0
                ? Math.round(
                    ((stats.totalEnquiries - stats.pendingEnquiries) /
                      stats.totalEnquiries) *
                      100
                  )
                : 0}
              %
            </div>
            <p className="text-xs text-slate-500 mt-1">Enquiries handled</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Enquiries */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Enquiries</CardTitle>
            <Link href="/dashboard/enquiries">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          {stats.recentEnquiries.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              No enquiries yet
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentEnquiries.map((enquiry: any) => (
                <div
                  key={enquiry.id}
                  className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{enquiry.name}</p>
                      <Badge
                        variant={
                          enquiry.status === "pending" ? "secondary" : "default"
                        }
                      >
                        {enquiry.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-500">{enquiry.email}</p>
                    {enquiry.schools && (
                      <p className="text-sm text-slate-600">
                        School: {enquiry.schools.name}
                      </p>
                    )}
                    {enquiry.license_type && (
                      <p className="text-sm text-slate-600">
                        License: {enquiry.license_type}
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-slate-500">
                    {new Date(enquiry.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
