"use server";

import { redirect } from "next/navigation";
import { createAdminSession, verifyAdminCredentials } from "@/lib/auth";
import { headers } from "next/headers";
import { allowAuthAttempt } from "@/lib/auth-throttle";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const address = (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (!allowAuthAttempt(`login:${address}`)) redirect("/admin/login?error=rate");
  if (!(await verifyAdminCredentials(email, password))) {
    redirect("/admin/login?error=invalid");
  }
  await createAdminSession(email);
  redirect("/admin");
}
