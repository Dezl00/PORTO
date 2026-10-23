import { AdminShell } from "@/components/admin/admin-shell";
import { requireAdmin } from "@/lib/auth";
import { cookies } from "next/headers";
import { hasDatabaseConnection } from "@/lib/prisma";
import "../admin.css";
export const metadata = { title: "Studio workspace", robots: { index: false, follow: false } };

export default async function ProtectedAdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await requireAdmin();
  const initialTheme = (await cookies()).get("shobaky_admin_theme")?.value === "dark" ? "dark" : "light";
  return <AdminShell email={session.email} canWrite={hasDatabaseConnection()} initialTheme={initialTheme}>{children}</AdminShell>;
}
