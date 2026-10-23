"use client";
import { Moon, Sun } from "lucide-react";
import { useAdmin } from "@/components/admin/admin-shell";
export function AppearanceSettings() {
  const {theme,setTheme} = useAdmin();
  return <section className="admin-panel"><h2 className="font-medium">Workspace appearance</h2><p className="mt-2 text-sm text-black/55">Dashboard only. Your public portfolio stays unchanged.</p><div className="mt-5 grid max-w-md grid-cols-2 gap-3">{([['light',Sun],['dark',Moon]] as const).map(([value,Icon]) => <button key={value} type="button" aria-pressed={theme === value} onClick={() => setTheme(value)} className={`admin-theme-option ${theme === value ? 'is-selected' : ''}`}><Icon size={22} strokeWidth={1.5} /><span>{value === 'light' ? 'Light' : 'Dark'}</span><span className="ml-auto size-3 rounded-full border border-current" style={{background:theme===value?'currentColor':'transparent'}} /></button>)}</div></section>;
}
