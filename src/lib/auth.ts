import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { hasDatabaseConnection, prisma } from "@/lib/prisma";

const SESSION_COOKIE = "shobaky_admin_session";
const FALLBACK_EMAIL = "admin@shobakystudio.local";
const FALLBACK_PASSWORD = "studio-demo";

function getSecret() {
  if (process.env.NODE_ENV === "production" && (!process.env.AUTH_SECRET || process.env.AUTH_SECRET.length < 32)) throw new Error("Configure AUTH_SECRET with at least 32 characters.");
  const source = process.env.AUTH_SECRET || "local-development-secret-change-before-production";
  return new TextEncoder().encode(source);
}

export function getAdminEmail() {
  return process.env.ADMIN_EMAIL || (process.env.NODE_ENV !== "production" ? FALLBACK_EMAIL : "");
}

export async function verifyAdminCredentials(email: string, password: string) {
  if (email.toLowerCase() !== getAdminEmail().toLowerCase()) return false;

  const credential = hasDatabaseConnection() && prisma ? await prisma.adminCredential.findUnique({ where: { id: "owner" } }) : null;
  if (credential) return bcrypt.compare(password, credential.passwordHash);

  const passwordHash = process.env.ADMIN_PASSWORD_HASH;
  if (passwordHash) return bcrypt.compare(password, passwordHash);

  return process.env.NODE_ENV !== "production" && password === FALLBACK_PASSWORD;
}

export async function createAdminSession(email: string) {
  const credential = hasDatabaseConnection() && prisma ? await prisma.adminCredential.findUnique({ where: { id: "owner" } }) : null;
  const token = await new SignJWT({ email: email.toLowerCase(), role: "owner", version: credential?.sessionVersion ?? 0 })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function destroyAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getAdminSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, getSecret());
    if (payload.role !== "owner" || typeof payload.email !== "string" || payload.email.toLowerCase() !== getAdminEmail().toLowerCase()) return null;
    const credential = hasDatabaseConnection() && prisma ? await prisma.adminCredential.findUnique({ where: { id: "owner" } }) : null;
    if ((payload.version ?? 0) !== (credential?.sessionVersion ?? 0)) return null;
    return { email: payload.email };
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  return session;
}
