import Link from "next/link";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import { PROJECT_GRID_CLASSNAME, ProjectCard } from "@/components/site/project-card";
import { SectionHeading } from "@/components/site/section-heading";
import { ServiceCard } from "@/components/site/service-card";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getHomeData } from "@/lib/portfolio";
import { getSectionTone } from "@/lib/home-sections";
import { HeroSection } from "@/components/site/hero-section";

function copy(section: { content: Record<string, unknown> | null }, key: string, fallback: string) {
  const value = section.content?.[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

export default async function Home() {
  const { profile, featuredProjects, latestProjects, services, sections } = await getHomeData();

  return (
    <>
      <SiteHeader />
      <main>
        {sections.filter((section) => section.isVisible).map((section) => {
          const tone = getSectionTone(section.key, section.content);
          const cardTone = tone === "dark" ? "dark" : "light";

          if (section.key === "hero") {
            return (
              <HeroSection key={section.id} section={section} selectedWorkVisible={sections.some((item) => item.key === "featured-work" && item.isVisible)} />
            );
          }

          if (section.key === "featured-work") {
            return (
              <section key={section.id} id="featured-work" className="home-section scroll-mt-[76px]" data-tone={tone} aria-labelledby="featured-work-heading">
                <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
                  <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
                    <SectionHeading id="featured-work-heading" eyebrow={copy(section, "eyebrow", "Selected work")} title={copy(section, "title", "Selected with a point of view.")} body={copy(section, "body", "")} />
                    <Link href="/projects" className="button section-button-secondary w-fit shrink-0">All projects <ArrowRight size={15} aria-hidden="true" /></Link>
                  </div>
                  {featuredProjects.length ? <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {featuredProjects.map((project) => <ProjectCard key={project.id} project={project} tone={cardTone} variant="featured" />)}
                  </div> : <p className="section-muted mt-10">Selected projects are being curated.</p>}
                </div>
              </section>
            );
          }

          if (section.key === "latest-projects") {
            return (
              <section key={section.id} id="latest-projects" className="home-section" data-tone={tone} aria-labelledby="latest-projects-heading">
                <div className="mx-auto max-w-[1920px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
                  <SectionHeading id="latest-projects-heading" eyebrow={copy(section, "eyebrow", "Latest projects")} title={copy(section, "title", "The latest from the studio.")} body={copy(section, "body", "A look at the six most recently published projects.")} />
                  {latestProjects.length ? <div className={`mt-10 ${PROJECT_GRID_CLASSNAME}`}>
                    {latestProjects.map((project) => <ProjectCard key={project.id} project={project} compact tone={cardTone} />)}
                  </div> : <p className="section-muted mt-10">New work is on its way.</p>}
                  <div className="mt-9 flex justify-center">
                    <Link href="/projects" className="button section-button-secondary">View all projects <ArrowRight size={15} aria-hidden="true" /></Link>
                  </div>
                </div>
              </section>
            );
          }

          if (section.key === "services") {
            return (
              <section key={section.id} className="home-section" data-tone={tone}>
                <div className="mx-auto max-w-[1440px] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
                  <SectionHeading eyebrow={copy(section, "eyebrow", "What I do")} title={copy(section, "title", "From first thought to final surface.")} body={copy(section, "body", "")} />
                  <div className="mt-12 grid gap-4 lg:grid-cols-3">
                    {services.map((service, index) => <ServiceCard key={service.id} service={service} index={index} />)}
                  </div>
                </div>
              </section>
            );
          }

          if (section.key === "cta") {
            return (
              <section key={section.id} className="home-section" data-tone={tone}>
                <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-9 px-5 py-20 sm:px-8 sm:py-24 lg:flex-row lg:items-end lg:px-12 lg:py-28">
                  <div>
                    <p className="eyebrow">{copy(section, "eyebrow", "New projects")}</p>
                    <h2 className="mt-4 max-w-3xl text-balance text-4xl font-medium leading-[0.92] tracking-[-0.07em] sm:text-6xl lg:text-7xl">{copy(section, "title", "Have a project in mind?")}</h2>
                    <p className="section-muted mt-5 max-w-xl text-lg leading-7">{copy(section, "body", "Tell me a little about it, and we can find the right direction.")}</p>
                  </div>
                  <Link href="/contact" className="button section-button-primary w-fit shrink-0">Let&apos;s talk <ArrowDownRight size={16} aria-hidden="true" /></Link>
                </div>
              </section>
            );
          }

          return null;
        })}
      </main>
      <SiteFooter profile={profile} />
    </>
  );
}
