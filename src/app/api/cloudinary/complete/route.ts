import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { hasDatabaseConnection, prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  await requireAdmin();
  if (!hasDatabaseConnection() || !prisma) {
    return NextResponse.json({ message: "The image could not be saved. Complete your workspace setup." }, { status: 503 });
  }

  const payload = (await request.json()) as Record<string, unknown>;
  const publicId = typeof payload.publicId === "string" ? payload.publicId : "";
  const secureUrl = typeof payload.secureUrl === "string" ? payload.secureUrl : "";
  if (!publicId || !secureUrl) {
    return NextResponse.json({ message: "The uploaded image is missing required information." }, { status: 400 });
  }

  const asset = await prisma.mediaAsset.upsert({
    where: { publicId },
    update: {
      cloudinaryId: typeof payload.assetId === "string" ? payload.assetId : undefined,
      secureUrl,
      format: typeof payload.format === "string" ? payload.format : undefined,
      width: typeof payload.width === "number" ? payload.width : undefined,
      height: typeof payload.height === "number" ? payload.height : undefined,
      bytes: typeof payload.bytes === "number" ? payload.bytes : undefined,
    },
    create: {
      publicId,
      cloudinaryId: typeof payload.assetId === "string" ? payload.assetId : undefined,
      secureUrl,
      format: typeof payload.format === "string" ? payload.format : undefined,
      width: typeof payload.width === "number" ? payload.width : undefined,
      height: typeof payload.height === "number" ? payload.height : undefined,
      bytes: typeof payload.bytes === "number" ? payload.bytes : undefined,
      folder: "shobaky-studio",
    },
  });

  return NextResponse.json({ asset });
}
