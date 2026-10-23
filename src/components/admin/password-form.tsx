"use client";
import { useActionState, useState } from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { changePasswordAction } from "@/app/admin/(protected)/account/actions";
export function PasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, {});
  const [show, setShow] = useState(false);
  return <form action={action} className="admin-panel"><div className="flex items-center justify-between gap-4"><h2 className="font-medium">Change password</h2><button type="button" className="admin-icon-button" onClick={() => setShow(!show)} aria-label={show ? "Hide passwords" : "Show passwords"}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></div><p className="mt-2 text-sm leading-6 text-black/55">At least 12 characters. Changing your password signs out all other sessions.</p><fieldset disabled={pending} className="mt-6 grid gap-5">{[['currentPassword','Current password','current-password'],['newPassword','New password','new-password'],['confirmPassword','Confirm new password','new-password']].map(([name,label,autocomplete]) => <label key={name}><span className="mb-2 block text-sm font-medium">{label}</span><input type={show ? 'text' : 'password'} className="field" name={name} required autoComplete={autocomplete} minLength={name==='currentPassword'?1:12} maxLength={72} /></label>)}<button className="button button-primary w-fit" type="submit"><KeyRound size={16} />{pending ? 'Updating…' : 'Update password'}</button></fieldset>{state.error && <p role="alert" className="admin-form-error">{state.error}</p>}{state.success && <p role="status" className="admin-success">{state.success}</p>}</form>;
}
