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
}

interface CoursePackage {
  id: string;
  shift_id: string;
  name: string;
  fee_aed: number;
  details: any;
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
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-3xl font-bold text-slate-900">
          Courses
        </h2>
        <p className="text-slate-500 mt-1">
          Manage license types, course levels, shifts, and packages
        </p>
      </div>

      <Tabs defaultValue="license-types" className="space-y-4">
        <TabsList>
          <TabsTrigger value="license-types">License Types</TabsTrigger>
          <TabsTrigger value="levels">Course Levels</TabsTrigger>
          <TabsTrigger value="shifts">Shifts</TabsTrigger>
          <TabsTrigger value="packages">Packages</TabsTrigger>
        </TabsList>

        <TabsContent value="license-types">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>License Types</CardTitle>
                <Button
                  size="sm"
                  onClick={() => setAddLicenseTypeDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add License Type
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {licenseTypes.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center py-8 text-slate-500"
                        >
                          No license types found
                        </TableCell>
                      </TableRow>
                    ) : (
                      licenseTypes.map((licenseType) => (
                        <TableRow key={licenseType.id}>
                          <TableCell className="font-medium">
                            {licenseType.name}
                          </TableCell>
                          <TableCell>
                            {licenseType.description || "N/A"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setItemToEdit(licenseType);
                                  setEditLicenseTypeDialogOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setItemToDelete({
                                    type: "license-types",
                                    id: licenseType.id,
                                  });
                                  setDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
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

        <TabsContent value="levels">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Course Levels</CardTitle>
                <Button
                  size="sm"
                  onClick={() => setAddCourseLevelDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Level
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>School</TableHead>
                      <TableHead>License Type</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Experience Level</TableHead>
                      <TableHead>Duration (hours)</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courseLevels.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-8 text-slate-500"
                        >
                          No course levels found
                        </TableCell>
                      </TableRow>
                    ) : (
                      courseLevels.map((level) => (
                        <TableRow key={level.id}>
                          <TableCell>{level.schools?.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {level.license_types?.name}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {level.name}
                          </TableCell>
                          <TableCell>{level.experience_level}</TableCell>
                          <TableCell>{level.duration_hours}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setItemToEdit(level);
                                  setEditCourseLevelDialogOpen(true);
                                }}
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
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
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

        <TabsContent value="shifts">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Course Shifts</CardTitle>
                <Button size="sm" onClick={() => setAddShiftDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Shift
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Type</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courseShifts.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center py-8 text-slate-500"
                        >
                          No course shifts found
                        </TableCell>
                      </TableRow>
                    ) : (
                      courseShifts.map((shift) => (
                        <TableRow key={shift.id}>
                          <TableCell className="font-medium">
                            <Badge>{shift.type}</Badge>
                          </TableCell>
                          <TableCell>{shift.description || "N/A"}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setItemToEdit(shift);
                                  setEditShiftDialogOpen(true);
                                }}
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
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
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

        <TabsContent value="packages">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Course Packages</CardTitle>
                <Button size="sm" onClick={() => setAddPackageDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Package
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Fee (AED)</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coursePackages.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={3}
                          className="text-center py-8 text-slate-500"
                        >
                          No course packages found
                        </TableCell>
                      </TableRow>
                    ) : (
                      coursePackages.map((pkg) => (
                        <TableRow key={pkg.id}>
                          <TableCell className="font-medium">
                            {pkg.name}
                          </TableCell>
                          <TableCell>{pkg.fee_aed.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setItemToEdit(pkg);
                                  setEditPackageDialogOpen(true);
                                }}
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
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
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
