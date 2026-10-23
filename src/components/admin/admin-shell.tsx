"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useContext, useRef, useState } from "react";
import { ArrowUpRight, ExternalLink, FolderKanban, House, Images, LayoutPanelTop, LogOut, Mail, Menu, Moon, PanelsTopLeft, Plus, Settings, ShieldCheck, Sun, Tag, X } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { logoutAction } from "@/app/admin/actions";

type Theme = "light" | "dark";
const AdminContext = createContext({ canWrite: false, theme: "light" as Theme, setTheme: (_theme: Theme) => {} });
export const useAdmin = () => useContext(AdminContext);
const navigation = [
  { href: "/admin", label: "Overview", icon: House },
  { href: "/admin/projects", label: "Projects", icon: FolderKanban },
  { href: "/admin/categories", label: "Categories", icon: Tag },
  { href: "/admin/media", label: "Media library", icon: Images },
  { href: "/admin/home", label: "Homepage", icon: LayoutPanelTop },
  { href: "/admin/pages", label: "Pages", icon: PanelsTopLeft },
  { href: "/admin/services", label: "Services", icon: PanelsTopLeft },
  { href: "/admin/messages", label: "Messages", icon: Mail },
  { href: "/admin/settings", label: "Settings", icon: Settings },
  { href: "/admin/account", label: "Account & security", icon: ShieldCheck },
];
export function AdminShell({ children, email, canWrite, initialTheme }: { children: React.ReactNode; email: string; canWrite: boolean; initialTheme: Theme }) {
  const pathname = usePathname();
  const [theme, updateTheme] = useState<Theme>(initialTheme);
  const menu = useRef<HTMLDialogElement>(null);
  const active = (href: string) => href === "/admin" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  const current = navigation.find(item => active(item.href))?.label ?? "Workspace";
  const setTheme = (value: Theme) => { updateTheme(value); document.cookie = `shobaky_admin_theme=${value}; Path=/admin; Max-Age=31536000; SameSite=Lax`; };
  function sidebar(mobile = false) {
    return <>
      <div className="admin-sidebar-brand"><Logo href="/admin" className="!text-white" />{mobile && <button type="button" className="admin-icon-button" aria-label="Close menu" onClick={() => menu.current?.close()}><X size={20} /></button>}</div>
      <p className="admin-sidebar-caption">STUDIO WORKSPACE</p>
      <nav className="admin-navigation" aria-label={mobile ? "Mobile workspace navigation" : "Workspace navigation"}>{navigation.map(({href,label,icon:Icon}) => <Link key={href} href={href} onClick={() => menu.current?.close()} aria-current={active(href) ? "page" : undefined} className={`admin-nav-link ${active(href) ? "is-active" : ""}`}><Icon size={18} strokeWidth={1.6} /><span>{label}</span></Link>)}</nav>
      <div className="admin-sidebar-bottom"><a href="/" target="_blank" rel="noreferrer" className="admin-nav-link"><ExternalLink size={17} /> View live site <ArrowUpRight size={14} className="ml-auto" /></a><div className="admin-owner"><span className="admin-avatar">MA</span><div className="min-w-0"><p>Mohamed Alshobaky</p><p className="truncate text-xs opacity-50">{email}</p></div></div><form action={logoutAction}><button type="submit" className="admin-nav-link w-full"><LogOut size={17} /> Sign out</button></form></div>
    </>;
  }
  return <AdminContext value={{canWrite,theme,setTheme}}><div className="admin-app" data-theme={theme}>
    <aside className="admin-sidebar">{sidebar()}</aside>
    <div className="admin-workspace"><header className="admin-topbar"><div className="flex min-w-0 items-center gap-3"><button type="button" onClick={() => menu.current?.showModal()} className="admin-icon-button lg:!hidden" aria-label="Open workspace menu"><Menu size={21} /></button><span className="hidden text-xs opacity-40 sm:block">Workspace /</span><p className="truncate text-sm font-medium">{current}</p></div><div className="flex items-center gap-2"><span className="admin-mode-label">{canWrite ? "Configured workspace" : "Preview mode"}</span><button type="button" className="admin-icon-button" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}>{theme === "light" ? <Moon size={18} /> : <Sun size={18} />}</button><a href="/" target="_blank" rel="noreferrer" className="admin-icon-button" aria-label="View public website"><ExternalLink size={18} /></a><Link href="/admin/account" className="admin-top-avatar" aria-label="Account settings">MA</Link></div></header><main className="admin-content">{!canWrite && <div className="admin-preview-notice"><span className="size-1.5 shrink-0 rounded-full bg-current" /><p>Preview mode. Saving and uploads are unavailable until workspace setup is complete.</p><Link href="/admin/settings#connections" className="ml-auto shrink-0 underline underline-offset-4">Set up</Link></div>}{children}</main></div>
    <dialog ref={menu} className="admin-mobile-menu" onClick={event => { if (event.target === event.currentTarget) menu.current?.close(); }}><div className="admin-mobile-menu-content">{sidebar(true)}</div></dialog>
    <nav className="admin-bottom-nav" aria-label="Quick workspace navigation">{[navigation[0],navigation[1]].map(({href,label,icon:Icon}) => <Link key={href} href={href} aria-current={active(href) ? "page" : undefined}><Icon size={21} strokeWidth={1.6} /><span>{label}</span></Link>)}<Link href="/admin/projects/new" className="admin-bottom-create" aria-label="Create project"><Plus size={24} /></Link><Link href="/admin/messages" aria-current={active("/admin/messages") ? "page" : undefined}><Mail size={21} strokeWidth={1.6} /><span>Inbox</span></Link><button type="button" onClick={() => menu.current?.showModal()}><Menu size={21} strokeWidth={1.6} /><span>More</span></button></nav>
  </div></AdminContext>;
}
