import { AdminHeading } from "@/components/admin/admin-heading";
import { AppearanceSettings } from "@/components/admin/appearance-settings";
import { PasswordForm } from "@/components/admin/password-form";
import { requireAdmin } from "@/lib/auth";
export default async function AccountPage() {
  const session = await requireAdmin();
  return <div className="mx-auto max-w-[960px] px-5 py-7 sm:px-8 sm:py-10 lg:px-12"><AdminHeading eyebrow="Your workspace" title="Account & security" description="One owner. Full control. Manage your password and workspace appearance." /><div className="mt-7 grid gap-6"><section className="admin-panel"><p className="eyebrow">Signed in as</p><p className="mt-3 break-all font-medium">{session.email}</p><p className="mt-2 text-sm text-black/55">Owner email is configured securely through ADMIN_EMAIL on your server.</p></section><AppearanceSettings /><PasswordForm /></div></div>;
}
