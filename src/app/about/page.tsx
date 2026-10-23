import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getProfile } from "@/lib/portfolio";
import { getPageCopy } from "@/lib/page-copy";

export const metadata: Metadata = {
  title: "About",
  description: "About Mohamed Alshobaky and SHOBAKY STUDIO.",
};

export default async function AboutPage() {
  const profile = await getProfile();
  const copy = await getPageCopy("about");
  return (
    <>
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28">
          <p className="eyebrow">{copy.eyebrow}</p>
          <h1 className="mt-5 max-w-6xl text-balance text-5xl font-medium leading-[0.88] tracking-[-0.078em] sm:text-7xl lg:text-8xl">{copy.title}</h1>
          <div className="mt-16 grid gap-10 border-t border-black/10 pt-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <p className="eyebrow">The approach</p>
            <div className="max-w-2xl text-xl leading-8 tracking-[-0.025em] text-black/70 sm:text-2xl sm:leading-9">
              <p className="whitespace-pre-line">{copy.intro}</p>
              <p className="mt-7 whitespace-pre-line">{copy.body}</p>
              <Link href="/contact" className="button button-primary mt-10">Start a conversation <ArrowRight size={16} /></Link>
            </div>
          </div>
        </section>
        <section className="border-y border-black/10 bg-[#f7f7f5]">
          <div className="mx-auto grid max-w-[1440px] gap-5 px-5 py-16 sm:px-8 lg:grid-cols-3 lg:px-12">
            {[['01', 'Strategy', 'Finding the right point of view before the visual work begins.'], ['02', 'System', 'Building a language with enough structure to hold together.'], ['03', 'Detail', 'Making every surface feel considered at every size.']].map(([number, title, body]) => (
              <article key={number} className="rounded-[22px] border border-black/10 bg-white p-6 sm:p-7">
                <p className="text-xs text-black/45">{number}</p>
                <h2 className="mt-16 text-2xl font-medium tracking-[-0.05em]">{title}</h2>
                <p className="mt-3 text-sm leading-6 text-black/55">{body}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter profile={profile} />
    </>
  );
}
