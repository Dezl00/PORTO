import { NextResponse } from "next/server";
import { getCloudinary, isCloudinaryConfigured } from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/auth";

export async function POST() {
  await requireAdmin();
  if (!isCloudinaryConfigured()) {
    return NextResponse.json({ message: "Image uploads are unavailable. Complete your workspace setup." }, { status: 503 });
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = "shobaky-studio";
  const cloudinary = getCloudinary();
  const signature = cloudinary.utils.api_sign_request({ timestamp, folder }, process.env.CLOUDINARY_API_SECRET!);

  return NextResponse.json({
    signature,
    timestamp,
    folder,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
  });
}
