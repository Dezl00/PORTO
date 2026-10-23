import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getAdminMedia } from "@/lib/admin-data";
export async function GET() {
  if (!(await getAdminSession())) return NextResponse.json({ message: "Sign in to access media." }, { status: 401 });
  return NextResponse.json({ assets: await getAdminMedia() }, { headers: { "Cache-Control": "private, no-store" } });
}
