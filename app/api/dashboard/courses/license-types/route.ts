import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const { data: licenseTypes, error } = await supabase
      .from("license_types")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching license types:", error);
      return NextResponse.json(
        { error: "Failed to fetch license types" },
        { status: 500 }
      );
    }

    return NextResponse.json(licenseTypes);
  } catch (error) {
    console.error("Error in GET /api/dashboard/courses/license-types:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const { data, error } = await supabase
      .from("license_types")
      .insert([body])
      .select()
      .single();

    if (error) {
      console.error("Error creating license type:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in POST /api/dashboard/courses/license-types:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
