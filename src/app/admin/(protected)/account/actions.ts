"use server";
import bcrypt from "bcryptjs";
import { createAdminSession, requireAdmin, verifyAdminCredentials } from "@/lib/auth";
import { hasDatabaseConnection, prisma } from "@/lib/prisma";
import { allowAuthAttempt } from "@/lib/auth-throttle";

export async function changePasswordAction(_state: { error?: string; success?: string }, form: FormData): Promise<{ error?: string; success?: string }> {
  const session = await requireAdmin();
  if (!hasDatabaseConnection() || !prisma) return { error: "Password changes are unavailable in preview mode. Your current password has not changed." };
  if (!allowAuthAttempt(`password:${session.email}`)) return { error: "Too many attempts. Please wait 15 minutes before trying again." };
  const currentPassword = String(form.get("currentPassword") || "");
  const password = String(form.get("newPassword") || "");
  if (password.length < 12 || Buffer.byteLength(password, "utf8") > 72) return { error: "Use at least 12 characters and no more than 72 UTF-8 bytes." };
  if (password !== form.get("confirmPassword")) return { error: "The new passwords do not match." };
  if (password === currentPassword) return { error: "Choose a different password from your current one." };
  try {
    const previous = await prisma.adminCredential.findUnique({ where: { id: "owner" } });
    if (!(await verifyAdminCredentials(session.email, currentPassword))) return { error: "Your current password is not correct." };
    const passwordHash = await bcrypt.hash(password, 12);
    if (previous) {
      const changed = await prisma.adminCredential.updateMany({ where: { id: "owner", sessionVersion: previous.sessionVersion }, data: { passwordHash, sessionVersion: { increment: 1 } } });
      if (changed.count !== 1) return { error: "Your credentials changed in another session. Sign in again before retrying." };
    } else await prisma.adminCredential.create({ data: { id: "owner", passwordHash, sessionVersion: 1 } });
    await createAdminSession(session.email);
    return { success: "Password updated. Other sessions are now signed out. Use your new password next time." };
  } catch { return { error: "Could not update your password. Check your database connection and migrations." }; }
}
