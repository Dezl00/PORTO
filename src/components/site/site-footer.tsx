import Link from "next/link";
import { Globe, Mail, MessageCircle } from "lucide-react";
import { Logo } from "@/components/site/logo";
import type { SiteProfile } from "@/lib/types";

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
];

const socialLabels: Record<string, string> = {
  instagram: "Instagram",
  behance: "Behance",
  linkedin: "LinkedIn",
  dribbble: "Dribbble",
  whatsapp: "WhatsApp",
  youtube: "YouTube",
  twitter: "X / Twitter",
};

const footerLinkClass = "group inline-flex min-h-11 items-center gap-3 rounded-lg text-sm text-white/75 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";
const iconLinkClass = "footer-icon-link inline-flex size-11 shrink-0 items-center justify-center text-white/75 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white";

function SocialIcon({ name }: { name: string }) {
  if (name === "instagram") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true" focusable="false">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (name === "behance") {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <path d="M3 6h5a3 3 0 0 1 0 6H3V6Zm0 6h5.5a3 3 0 0 1 0 6H3v-6Zm12-5h5m1 7h-7a3.5 3.5 0 0 1 7 0Zm-7 0v.5a3.5 3.5 0 0 0 6.5 1.8" />
      </svg>
    );
  }

  if (name === "linkedin") {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <path d="M7.5 10.5v6m4.5 0v-6m0 3a3 3 0 0 1 6 0v3" />
        <circle cx="7.5" cy="7.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (name === "dribbble") return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M8 4c5 6 7 10 8 16M3 10c7 1 12-1 16-5M5 19c3-6 8-9 16-6" /></svg>;
  if (name === "youtube") return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="4" /><path d="m10 9 5 3-5 3V9Z" /></svg>;
  if (name === "whatsapp") return <MessageCircle size={22} strokeWidth={1.7} aria-hidden="true" />;
  if (name === "twitter" || name === "x") return <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M4 3h4l12 18h-4L4 3Zm16 0L4 21" /></svg>;
  return <Globe size={22} aria-hidden="true" />;
}

export function SiteFooter({ profile }: { profile: SiteProfile }) {
  return (
    <footer className="border-t border-white/15 bg-black text-white">
      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-[1.35fr_0.65fr_0.65fr] lg:gap-12">
          <div className="col-span-2 min-w-0 lg:col-span-1">
            <Logo className="rounded-sm text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white" />
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/65">{profile.description}</p>
          </div>
          <div>
            <p className="text-[0.7rem] font-medium uppercase leading-tight tracking-[0.1em] text-white/55">Explore</p>
            <nav className="mt-4 flex flex-col items-start gap-1" aria-label="Footer navigation">
              {footerLinks.map(({ href, label }) => (
                <Link key={href} href={href} className={footerLinkClass}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div>
            <p className="text-[0.7rem] font-medium uppercase leading-tight tracking-[0.1em] text-white/55">Get in touch</p>
            <nav className="mt-4 flex flex-wrap items-center gap-1" aria-label="Email and social links">
              <a href={`mailto:${profile.email}`} className={iconLinkClass} aria-label={`Email ${profile.email}`} title={profile.email}>
                <Mail size={22} strokeWidth={1.7} aria-hidden="true" />
              </a>
              {Object.entries(profile.socials).filter(([, url]) => url.trim()).map(([name, url]) => {
                const normalizedName = name.toLowerCase().replace(/[\s_-]+/g, "");
                const opensNewTab = url !== "#";

                return (
                  <a key={name} href={url} target={opensNewTab ? "_blank" : undefined} rel={opensNewTab ? "noopener noreferrer" : undefined} className={iconLinkClass} aria-label={`${socialLabels[normalizedName] ?? name}${opensNewTab ? " (opens in a new tab)" : ""}`} title={socialLabels[normalizedName] ?? name}>
                    <SocialIcon name={normalizedName} />
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-white/15 pt-5 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {profile.brandName}</p>
          <p>Designed by {profile.founderName}</p>
        </div>
      </div>
    </footer>
  );
}
