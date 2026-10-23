"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/site/logo";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const isActive = (href: string) => href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="site-header" data-menu-open={isOpen}>
      <div className="site-header-inner">
        <Logo />
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "text-sm transition-colors hover:text-black",
                isActive(item.href) ? "text-black" : "text-black/50",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden md:block">
          <Link href="/contact" className="button button-primary">
            Start a project
          </Link>
        </div>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          aria-label={isOpen ? "Close navigation" : "Open navigation"}
          onClick={() => setIsOpen((open) => !open)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-black/15 md:hidden"
        >
          {isOpen ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
        </button>
      </div>
      {isOpen ? (
        <div id="mobile-navigation" className="border-t border-black/10 bg-transparent px-5 py-5 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "rounded-2xl px-4 py-3 text-lg",
                  isActive(item.href) ? "bg-black text-white" : "text-black/70",
                )}
              >
                {item.label}
              </Link>
            ))}
            <Link href="/contact" onClick={() => setIsOpen(false)} className="mt-3 button button-primary justify-center">
              Start a project
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
