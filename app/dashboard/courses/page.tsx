"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
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
import { AddShiftDialog } from "@/components/dashboard/add-shift-dialog";
import { AddPackageDialog } from "@/components/dashboard/add-package-dialog";
import { AddCourseLevelDialog } from "@/components/dashboard/add-course-level-dialog";
import { AddLicenseTypeDialog } from "@/components/dashboard/add-license-type-dialog";
import { EditLicenseTypeDialog } from "@/components/dashboard/edit-license-type-dialog";
import { EditCourseLevelDialog } from "@/components/dashboard/edit-course-level-dialog";
import { EditShiftDialog } from "@/components/dashboard/edit-shift-dialog";
import { EditPackageDialog } from "@/components/dashboard/edit-package-dialog";

interface LicenseType {
  id: string;
  name: string;
  description: string;
}

interface CourseLevel {
  id: string;
  school_id: string;
  license_type_id: string;
  name: string;
  experience_level: string;
  duration_hours: number;
  description: string;
  schools: { name: string };
  license_types: { name: string };
}

interface CourseShift {
  id: string;
  course_level_id: string;
  type: string;
  description: string;
  course_levels?: {
    name: string;
    schools: { name: string };
    license_types: { name: string };
  };
}

interface CoursePackage {
  id: string;
  shift_id: string;
  name: string;
  fee_aed: number;
  details: any;
  shifts?: {
    type: string;
    course_levels?: {
      name: string;
      schools: { name: string };
      license_types: { name: string };
    };
  };
}

export default function CoursesPage() {
  const [licenseTypes, setLicenseTypes] = useState<LicenseType[]>([]);
  const [courseLevels, setCourseLevels] = useState<CourseLevel[]>([]);
  const [courseShifts, setCourseShifts] = useState<CourseShift[]>([]);
  const [coursePackages, setCoursePackages] = useState<CoursePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addLicenseTypeDialogOpen, setAddLicenseTypeDialogOpen] =
    useState(false);
  const [addCourseLevelDialogOpen, setAddCourseLevelDialogOpen] =
    useState(false);
  const [addShiftDialogOpen, setAddShiftDialogOpen] = useState(false);
  const [addPackageDialogOpen, setAddPackageDialogOpen] = useState(false);
  const [editLicenseTypeDialogOpen, setEditLicenseTypeDialogOpen] =
    useState(false);
  const [editCourseLevelDialogOpen, setEditCourseLevelDialogOpen] =
    useState(false);
  const [editShiftDialogOpen, setEditShiftDialogOpen] = useState(false);
  const [editPackageDialogOpen, setEditPackageDialogOpen] = useState(false);
  const [itemToEdit, setItemToEdit] = useState<any>(null);
  const [itemToDelete, setItemToDelete] = useState<{
    type: string;
    id: string;
  } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [licenseTypesRes, levelsRes, shiftsRes, packagesRes] =
        await Promise.all([
          fetch("/api/dashboard/courses/license-types"),
          fetch("/api/dashboard/courses/levels"),
          fetch("/api/dashboard/courses/shifts"),
          fetch("/api/dashboard/courses/packages"),
        ]);

      const licenseTypesData = await licenseTypesRes.json();
      const levelsData = await levelsRes.json();
      const shiftsData = await shiftsRes.json();
      const packagesData = await packagesRes.json();

      setLicenseTypes(licenseTypesData || []);
      setCourseLevels(levelsData.courseLevels || []);
      setCourseShifts(shiftsData.courseShifts || []);
      setCoursePackages(packagesData.coursePackages || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load courses data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!itemToDelete) return;

    try {
      const endpoint = `/api/dashboard/courses/${itemToDelete.type}/${itemToDelete.id}`;
      const response = await fetch(endpoint, { method: "DELETE" });

      if (response.ok) {
        toast.success("Item deleted successfully");
        fetchData();
      } else {
        toast.error("Failed to delete item");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete item");
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 sm:p-8 rounded-xl border border-primary/10">
        <h2 className="font-heading text-2xl sm:text-3xl font-bold text-slate-900">
          Courses Management
        </h2>
        <p className="text-sm sm:text-base text-slate-600 mt-2">
          Manage license types, course levels, shifts, and packages for your
          driving schools
        </p>
      </div>

      <Tabs defaultValue="license-types" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto bg-slate-100 p-1.5 rounded-lg">
          <TabsTrigger
            value="license-types"
            className="text-xs sm:text-sm px-3 sm:px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md font-medium transition-all"
          >
            License Types
          </TabsTrigger>
          <TabsTrigger
            value="levels"
            className="text-xs sm:text-sm px-3 sm:px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md font-medium transition-all"
          >
            Course Levels
          </TabsTrigger>
          <TabsTrigger
            value="shifts"
            className="text-xs sm:text-sm px-3 sm:px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md font-medium transition-all"
          >
            Shifts
          </TabsTrigger>
          <TabsTrigger
            value="packages"
            className="text-xs sm:text-sm px-3 sm:px-4 py-2.5 data-[state=active]:bg-white data-[state=active]:shadow-sm rounded-md font-medium transition-all"
          >
            Packages
          </TabsTrigger>
        </TabsList>

        <TabsContent value="license-types" className="space-y-4">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b">
              <div>
                <CardTitle className="text-lg sm:text-xl font-semibold">
                  License Types
                </CardTitle>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Manage available license categories
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                      <TableHead className="font-semibold text-slate-700">
                        Name
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        Description
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700 text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {licenseTypes.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center py-12 text-slate-500"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                              <Plus className="h-6 w-6 text-slate-400" />
                            </div>
                            <p className="font-medium">
                              No license types found
                            </p>
                            <p className="text-sm">
                              Get started by adding your first license type
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      licenseTypes.map((licenseType) => (
                        <TableRow
                          key={licenseType.id}
                          className="hover:bg-slate-50/50"
                        >
                          <TableCell className="font-medium text-slate-900">
                            {licenseType.name}
                          </TableCell>
                          <TableCell className="text-slate-600">
                            {licenseType.description || "N/A"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setItemToEdit(licenseType);
                                  setEditLicenseTypeDialogOpen(true);
                                }}
                                className="hover:bg-primary/10 hover:text-primary"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="levels" className="space-y-4">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <CardTitle className="text-lg sm:text-xl font-semibold">
                    Course Levels
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Define course levels for each license type
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setAddCourseLevelDialogOpen(true)}
                  className="w-full sm:w-auto text-xs sm:text-sm shadow-sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Level
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                      <TableHead className="font-semibold text-slate-700">
                        School
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        License Type
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        Name
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        Experience Level
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        Duration (hours)
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700 text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courseLevels.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-12 text-slate-500"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                              <Plus className="h-6 w-6 text-slate-400" />
                            </div>
                            <p className="font-medium">
                              No course levels found
                            </p>
                            <p className="text-sm">
                              Add course levels to organize your courses
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      courseLevels.map((level) => (
                        <TableRow
                          key={level.id}
                          className="hover:bg-slate-50/50"
                        >
                          <TableCell className="text-slate-900">
                            {level.schools?.name}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-primary/5">
                              {level.license_types?.name}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium text-slate-900">
                            {level.name}
                          </TableCell>
                          <TableCell className="text-slate-600">
                            {level.experience_level}
                          </TableCell>
                          <TableCell className="text-slate-600">
                            {level.duration_hours}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setItemToEdit(level);
                                  setEditCourseLevelDialogOpen(true);
                                }}
                                className="hover:bg-primary/10 hover:text-primary"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setItemToDelete({
                                    type: "levels",
                                    id: level.id,
                                  });
                                  setDeleteDialogOpen(true);
                                }}
                                className="hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shifts" className="space-y-4">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <CardTitle className="text-lg sm:text-xl font-semibold">
                    Course Shifts
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Manage shift timings for course levels
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setAddShiftDialogOpen(true)}
                  className="w-full sm:w-auto text-xs sm:text-sm shadow-sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Shift
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                      <TableHead className="font-semibold text-slate-700">
                        School
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        License Type
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        Course Level
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        Shift Type
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        Description
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700 text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courseShifts.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-12 text-slate-500"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                              <Plus className="h-6 w-6 text-slate-400" />
                            </div>
                            <p className="font-medium">
                              No course shifts found
                            </p>
                            <p className="text-sm">
                              Define shift timings for your courses
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      courseShifts.map((shift) => (
                        <TableRow
                          key={shift.id}
                          className="hover:bg-slate-50/50"
                        >
                          <TableCell className="text-slate-900">
                            {shift.course_levels?.schools?.name || "N/A"}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-primary/5">
                              {shift.course_levels?.license_types?.name ||
                                "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-600">
                            {shift.course_levels?.name || "N/A"}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                              {shift.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-600">
                            {shift.description || "N/A"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setItemToEdit(shift);
                                  setEditShiftDialogOpen(true);
                                }}
                                className="hover:bg-primary/10 hover:text-primary"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setItemToDelete({
                                    type: "shifts",
                                    id: shift.id,
                                  });
                                  setDeleteDialogOpen(true);
                                }}
                                className="hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="packages" className="space-y-4">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="bg-slate-50/50 border-b">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <CardTitle className="text-lg sm:text-xl font-semibold">
                    Course Packages
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Create and manage pricing packages
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => setAddPackageDialogOpen(true)}
                  className="w-full sm:w-auto text-xs sm:text-sm shadow-sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Package
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50 hover:bg-slate-50">
                      <TableHead className="font-semibold text-slate-700">
                        School
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        License Type
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        Course Level
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        Shift
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        Package Name
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700">
                        Fee (AED)
                      </TableHead>
                      <TableHead className="font-semibold text-slate-700 text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coursePackages.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="text-center py-12 text-slate-500"
                        >
                          <div className="flex flex-col items-center gap-2">
                            <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center">
                              <Plus className="h-6 w-6 text-slate-400" />
                            </div>
                            <p className="font-medium">
                              No course packages found
                            </p>
                            <p className="text-sm">
                              Create packages with pricing for your courses
                            </p>
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      coursePackages.map((pkg) => (
                        <TableRow key={pkg.id} className="hover:bg-slate-50/50">
                          <TableCell className="text-slate-900">
                            {pkg.shifts?.course_levels?.schools?.name || "N/A"}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-primary/5">
                              {pkg.shifts?.course_levels?.license_types?.name ||
                                "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-slate-600">
                            {pkg.shifts?.course_levels?.name || "N/A"}
                          </TableCell>
                          <TableCell>
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                              {pkg.shifts?.type || "N/A"}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium text-slate-900">
                            {pkg.name}
                          </TableCell>
                          <TableCell className="font-semibold text-emerald-600">
                            {pkg.fee_aed.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setItemToEdit(pkg);
                                  setEditPackageDialogOpen(true);
                                }}
                                className="hover:bg-primary/10 hover:text-primary"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setItemToDelete({
                                    type: "packages",
                                    id: pkg.id,
                                  });
                                  setDeleteDialogOpen(true);
                                }}
                                className="hover:bg-red-50 hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddLicenseTypeDialog
        open={addLicenseTypeDialogOpen}
        onOpenChange={setAddLicenseTypeDialogOpen}
        onSuccess={fetchData}
      />

      <AddCourseLevelDialog
        open={addCourseLevelDialogOpen}
        onOpenChange={setAddCourseLevelDialogOpen}
        onSuccess={fetchData}
      />

      <AddShiftDialog
        open={addShiftDialogOpen}
        onOpenChange={setAddShiftDialogOpen}
        onSuccess={fetchData}
      />

      <AddPackageDialog
        open={addPackageDialogOpen}
        onOpenChange={setAddPackageDialogOpen}
        onSuccess={fetchData}
      />

      <EditLicenseTypeDialog
        open={editLicenseTypeDialogOpen}
        onOpenChange={setEditLicenseTypeDialogOpen}
        onSuccess={fetchData}
        licenseType={itemToEdit}
      />

      <EditCourseLevelDialog
        open={editCourseLevelDialogOpen}
        onOpenChange={setEditCourseLevelDialogOpen}
        onSuccess={fetchData}
        courseLevel={itemToEdit}
      />

      <EditShiftDialog
        open={editShiftDialogOpen}
        onOpenChange={setEditShiftDialogOpen}
        onSuccess={fetchData}
        shift={itemToEdit}
      />

      <EditPackageDialog
        open={editPackageDialogOpen}
        onOpenChange={setEditPackageDialogOpen}
        onSuccess={fetchData}
        packageData={itemToEdit}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this item. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
