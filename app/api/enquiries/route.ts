import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { EnquiryEmail } from "@/emails/enquiry-email";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required" },
        { status: 400 }
      );
    }

    // Save enquiry to database
    const { data: enquiry, error: dbError } = await supabase
      .from("user_queries")
      .insert({
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        school_id: data.schoolId || null,
        school_name: data.schoolName || null,
        message: data.message?.trim() || null,
        status: "pending",
        license_type: data.licenseType || null,
        license_status: data.licenseStatus || null,
        package_type: data.packageType || null,
        location: data.location || null,
        start_time: data.startTime || null,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
      return NextResponse.json(
        { error: "Failed to save enquiry" },
        { status: 500 }
      );
    }

    // Send email notification
    try {
      // Always use the email from environment config
      const recipientEmail =
        process.env.DEFAULT_ENQUIRY_EMAIL || "admin@example.com";

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
        to: recipientEmail,
        subject: `New Lead Enquiry from ${data.name}${data.schoolName ? ` - ${data.schoolName}` : ""}`,
        react: EnquiryEmail({
          name: data.name,
          email: data.email,
          phone: data.phone,
          schoolName: data.schoolName,
          message: data.message,
          licenseType: data.licenseType,
          licenseStatus: data.licenseStatus,
          packageType: data.packageType,
          location: data.location,
          startTime: data.startTime,
        }),
      });

      console.log("Email sent successfully to:", recipientEmail);
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Don't fail the request if email fails - enquiry is already saved
      return NextResponse.json({
        success: true,
        enquiry,
        emailSent: false,
        warning: "Enquiry saved but email notification failed",
      });
    }

    return NextResponse.json({
      success: true,
      enquiry,
      emailSent: true,
    });
  } catch (error) {
    console.error("Error processing enquiry:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
