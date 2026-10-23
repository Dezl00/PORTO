"use client";
import { useActionState, type ReactNode } from "react";
import { unstable_rethrow } from "next/navigation";
import { useAdmin } from "@/components/admin/admin-shell";
export function AdminForm({ action, children, className, confirm }: { action: (data: FormData) => void | Promise<void>; children: ReactNode; className?: string; confirm?: string }) {
  const { canWrite } = useAdmin();
  const [state, submit, pending] = useActionState(async (_state: string | null, data: FormData) => {
    if (!canWrite) return "Saving is unavailable in preview mode. Your changes have not been saved.";
    try { await action(data); return null; } catch (error) {
      unstable_rethrow(error);
      const detail = error instanceof Error ? error.message : "";
      if (/prisma|postgres|database|neon|cloudinary|ECONN|fetch failed/i.test(detail)) return "This action is unavailable right now. Check your workspace setup and try again.";
      if (/unique constraint|already in use/i.test(detail)) return "That URL is already in use. Choose another slug.";
      if (detail.startsWith("[")) return "Please check the required fields and their length, then try again.";
      return detail.length < 240 ? detail || "Unable to complete this action. Try again." : "Unable to complete this action. Check your input and try again.";
    }
  }, null);
  return <form action={submit} className={className} onSubmit={event => { if (confirm && !window.confirm(confirm)) event.preventDefault(); }} aria-busy={pending}><fieldset disabled={pending} className="admin-form-fields">{children}</fieldset>{state && <p role="alert" className="admin-form-error">{state}</p>}{pending && <p role="status" className="admin-form-pending">Saving…</p>}</form>;
}
