import { NextResponse } from "next/server";
import { hasDatabaseConnection, prisma } from "@/lib/prisma";
import { contactSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const formData = await request.formData();
  if (String(formData.get("company") || "")) {
    return NextResponse.json({ message: "Thanks — your message is on its way." });
  }

  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    service: formData.get("service") || undefined,
    budget: formData.get("budget") || undefined,
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return NextResponse.json({ message: parsed.error.issues[0]?.message || "Please check the form and try again." }, { status: 400 });
  }

  if (hasDatabaseConnection() && prisma) {
    await prisma.contactMessage.create({ data: parsed.data });
    return NextResponse.json({ message: "Thanks — your message is on its way." }, { status: 201 });
  }

  return NextResponse.json({ message: "Demo mode: your message was validated. Add Neon to save enquiries." }, { status: 201 });
}
