import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Enquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  school_name: string;
  license_type: string;
  license_status: string;
  status: string;
  message: string;
  location: string;
  start_time: string;
  package_type: string;
  created_at: string;
  schools?: {
    name: string;
  };
}

interface EnquiryDetailsDialogProps {
  enquiry: Enquiry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EnquiryDetailsDialog({
  enquiry,
  open,
  onOpenChange,
}: EnquiryDetailsDialogProps) {
  if (!enquiry) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enquiry Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="font-heading text-sm font-medium text-slate-500 mb-2">
              Contact Information
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Name:</span>
                <span className="text-sm">{enquiry.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm">{enquiry.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Phone:</span>
                <span className="text-sm">{enquiry.phone}</span>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-heading text-sm font-medium text-slate-500 mb-2">
              Enquiry Details
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">School:</span>
                <span className="text-sm">
                  {enquiry.schools?.name || enquiry.school_name || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">License Type:</span>
                <span className="text-sm">{enquiry.license_type || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">License Status:</span>
                <span className="text-sm">
                  {enquiry.license_status || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Package Type:</span>
                <span className="text-sm">{enquiry.package_type || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Location:</span>
                <span className="text-sm">{enquiry.location || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Start Time:</span>
                <span className="text-sm">{enquiry.start_time || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Status:</span>
                <Badge
                  variant={
                    enquiry.status === "pending" ? "secondary" : "default"
                  }
                >
                  {enquiry.status}
                </Badge>
              </div>
            </div>
          </div>

          {enquiry.message && (
            <>
              <Separator />
              <div>
                <h3 className="font-heading text-sm font-medium text-slate-500 mb-2">
                  Message
                </h3>
                <p className="text-sm bg-slate-50 p-3 rounded-lg">
                  {enquiry.message}
                </p>
              </div>
            </>
          )}

          <Separator />

          <div>
            <h3 className="font-heading text-sm font-medium text-slate-500 mb-2">
              Metadata
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Submitted:</span>
                <span className="text-sm">
                  {new Date(enquiry.created_at).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Enquiry ID:</span>
                <span className="text-sm font-mono text-xs">{enquiry.id}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
