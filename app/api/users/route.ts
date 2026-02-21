import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/lib/redis";
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  picture: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = userSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid user data" }, { status: 400 });
    }

    const { name, email, picture } = parsed.data;

    // Store user in a hash keyed by email
    await redis.hset(`user:${email}`, {
      name,
      email,
      picture: picture || "",
      lastLogin: new Date().toISOString(),
    });

    // Also add to a set of all user emails for easy listing
    await redis.sadd("users:emails", email);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to save user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET: List all stored users (for admin/debug)
export async function GET() {
  try {
    const emails = await redis.smembers("users:emails");
    const users = await Promise.all(
      emails.map(async (email) => {
        const data = await redis.hgetall(`user:${email}`);
        return data;
      })
    );

    return NextResponse.json({ count: users.length, users });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
