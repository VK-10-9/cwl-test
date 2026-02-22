import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  isSupabaseConfigured,
  listUserProfiles,
  upsertUserProfile,
} from "@/lib/supabase-server";

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  picture: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Supabase is not configured on the server." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const parsed = userSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
    }

    const { name, email, picture } = parsed.data;

    await upsertUserProfile({ name, email, picture });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to save user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET: List all stored users (for admin/debug)
export async function GET() {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        { error: "Supabase is not configured on the server." },
        { status: 500 }
      );
    }

    const users = await listUserProfiles();

    return NextResponse.json({ count: users.length, users });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
