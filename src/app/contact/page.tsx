import type { Metadata } from "next";
import { ContactForm } from "@/components/site/contact-form";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getProfile } from "@/lib/portfolio";
import { getPageCopy } from "@/lib/page-copy";

export const metadata: Metadata = { title: "Contact", description: "Start a project with SHOBAKY STUDIO." };

export default async function ContactPage() {
  const profile = await getProfile();
  const copy=await getPageCopy("contact");
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div>
            <p className="eyebrow">{copy.eyebrow}</p>
            <h1 className="mt-5 text-balance text-5xl font-medium leading-[0.88] tracking-[-0.075em] sm:text-7xl">{copy.title}</h1>
            <p className="mt-6 max-w-md whitespace-pre-line text-lg leading-7 text-black/60">{copy.intro}</p>
            {copy.body && <p className="mt-4 max-w-md whitespace-pre-line text-sm leading-6 text-black/60">{copy.body}</p>}
            <a href={`mailto:${profile.email}`} className="mt-8 inline-block text-sm font-medium underline underline-offset-4">{profile.email}</a>
          </div>
          <div className="rounded-[24px] border border-black/10 p-5 sm:p-8 lg:p-10">
            <ContactForm />
          </div>
        </div>
      </main>
      <SiteFooter profile={profile} />
    </>
  );
}
