import type { Metadata } from "next";
import { ProjectBrowser } from "@/components/site/project-browser";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getCategories, getProfile, getProjects } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Work",
  description: "Selected graphic design work by Mohamed Alshobaky.",
};

export default async function ProjectsPage() {
  const [profile, projects, categories] = await Promise.all([getProfile(), getProjects(), getCategories()]);
  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1920px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28">
        <p className="eyebrow">Selected work</p>
        <h1 className="mt-4 max-w-4xl text-balance text-5xl font-medium leading-[0.88] tracking-[-0.075em] sm:text-7xl lg:text-8xl">Projects made to be seen, used, and remembered.</h1>
        <ProjectBrowser projects={projects} categories={categories} />
      </main>
      <SiteFooter profile={profile} />
    </>
  );
}
