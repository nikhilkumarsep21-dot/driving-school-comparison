import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { EnquiryEmail } from "@/emails/enquiry-email";
import { render } from "@react-email/render";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const data = await request.json();

    // Validate required fields
    if (!data.name || !data.email || !data.phone) {
      return NextResponse.json(
        { error: "Name, email, and phone are required" },
        { status: 400 },
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
        license_age: data.licenseAge || null,
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
        { status: 500 },
      );
    }

    // Send email notification using Nodemailer
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
        connectionTimeout: 10000,
      });

      // Render the React email to HTML
      const html = await render(
        EnquiryEmail({
          name: data.name,
          email: data.email,
          phone: data.phone,
          schoolName: data.schoolName,
          message: data.message,
          licenseType: data.licenseType,
          licenseStatus: data.licenseStatus,
          licenseAge: data.licenseAge,
          packageType: data.packageType,
          location: data.location,
          startTime: data.startTime,
        }),
      );

      await transporter.sendMail({
        from: `"Driving School Leads" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: `New Lead: ${data.name} - Driving School Inquiry`,
        html: html,
      });
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
      { status: 500 },
    );
  }
}
