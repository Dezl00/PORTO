import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ServiceCard } from "@/components/site/service-card";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getProfile, getServices } from "@/lib/portfolio";
import { getPageCopy } from "@/lib/page-copy";

export const metadata: Metadata = { title: "Services", description: "Brand identity, campaign art direction, and digital design services." };

export default async function ServicesPage() {
  const [profile, services] = await Promise.all([getProfile(), getServices()]);
  const copy=await getPageCopy("services");
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28">
        <p className="eyebrow">{copy.eyebrow}</p>
        <div className="mt-4 flex flex-col gap-8 border-b border-black/10 pb-12 lg:flex-row lg:items-end lg:justify-between">
          <h1 className="max-w-4xl text-balance text-5xl font-medium leading-[0.88] tracking-[-0.075em] sm:text-7xl">{copy.title}</h1>
          <p className="max-w-sm whitespace-pre-line text-lg leading-7 text-black/60">{copy.intro}</p>
        </div>
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {services.map((service, index) => <ServiceCard key={service.id} service={service} index={index} />)}
        </div>
        <div className="mt-20 flex flex-col justify-between gap-6 border-t border-black/10 pt-8 sm:flex-row sm:items-center">
          <p className="max-w-xl whitespace-pre-line text-lg leading-7 text-black/60">{copy.body}</p>
          <Link href="/contact" className="button button-primary shrink-0">Tell me about it <ArrowRight size={16} /></Link>
        </div>
      </main>
      <SiteFooter profile={profile} />
    </>
  );
}
