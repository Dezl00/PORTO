"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const targets = [
  "main h1", "main h2", "main h3", "main p", "main article",
  "main a", "main button", "main label", "main dl > div",
  "main .hero-image", "main [data-reveal]",
  ".site-header-inner a", ".site-header-inner button",
  "footer p", "footer a",
].join(",");

/** One observer for individual content units, never for an entire section. */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/admin") || !("IntersectionObserver" in window)) return;

    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const registered = new Set<HTMLElement>();
    let frame = 0;

    const reveal = (element: HTMLElement) => {
      element.dataset.revealState = "visible";
      observer.unobserve(element);
    };

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) reveal(entry.target as HTMLElement);
      }
    }, { threshold: 0, rootMargin: "0px 0px -24px 0px" });

    function scan() {
      frame = 0;
      if (preference.matches) return;
      const elements = Array.from(document.querySelectorAll<HTMLElement>(targets));
      const candidates = new Set(elements);
      const groups = new Map<Element, number>();

      for (const element of elements) {
        if (element.closest(".sr-only, [aria-live], [role='status'], [data-no-reveal]")) continue;
        let parent = element.parentElement;
        let nested = false;
        while (parent && parent !== document.body) {
          if (candidates.has(parent)) { nested = true; break; }
          parent = parent.parentElement;
        }
        if (nested) continue;

        const group = element.closest("section, footer, main") ?? document.body;
        const index = groups.get(group) ?? 0;
        groups.set(group, index + 1);
        if (registered.has(element) || element.dataset.revealState) continue;
        if (!element.getClientRects().length) continue;
        registered.add(element);

        const bounds = element.getBoundingClientRect();
        // Never hide restored, already-read content above the viewport.
        if (bounds.bottom <= 0) continue;
        element.style.setProperty("--reveal-delay", `${(index % 6) * 50}ms`);
        if (bounds.top < window.innerHeight - 24) reveal(element);
        else {
          element.dataset.revealState = "pending";
          observer.observe(element);
        }
      }
    }

    const mutations = new MutationObserver(() => {
      if (!frame) frame = requestAnimationFrame(scan);
    });
    mutations.observe(document.body, { childList: true, subtree: true });

    const showFocused = (event: FocusEvent) => {
      const element = (event.target as Element).closest<HTMLElement>("[data-reveal-state]");
      if (element) {
        observer.unobserve(element);
        element.dataset.revealState = "complete";
      }
    };
    const updatePreference = () => {
      if (preference.matches) {
        observer.disconnect();
        for (const element of registered) element.dataset.revealState = "complete";
      } else scan();
    };
    document.addEventListener("focusin", showFocused);
    preference.addEventListener("change", updatePreference);
    scan();

    return () => {
      observer.disconnect();
      mutations.disconnect();
      cancelAnimationFrame(frame);
      document.removeEventListener("focusin", showFocused);
      preference.removeEventListener("change", updatePreference);
      for (const element of registered) {
        delete element.dataset.revealState;
        element.style.removeProperty("--reveal-delay");
      }
    };
  }, [pathname]);

  return null;
}
