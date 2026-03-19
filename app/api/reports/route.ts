import { NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured, listGeneratedReports } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Supabase is not configured on the server." },
        { status: 500 }
      );
    }

    const email = request.nextUrl.searchParams.get("email") || undefined;
    const reports = await listGeneratedReports(email);

    return NextResponse.json({ count: reports.length, reports });
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

