import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { ProjectArt } from "@/components/site/project-art";
import { ProjectCard } from "@/components/site/project-card";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getProfile, getProjectBlocks, getProjectBySlug, getProjects } from "@/lib/portfolio";
import type { PortfolioProject } from "@/lib/types";
import { embedUrl, videoUrl } from "@/lib/project-media";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.excerpt,
    openGraph: { title: project.title, description: project.excerpt, images: project.coverUrl ? [project.coverUrl] : [] },
  };
}

function text(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const [profile, blocks, related] = await Promise.all([
    getProfile(),
    getProjectBlocks(project),
    getProjects({ category: project.category?.slug }),
  ]);
  const relatedProjects = related.filter((item) => item.slug !== project.slug).slice(0, 2);

  return (
    <>
      <SiteHeader />
      <main>
        <section className="mx-auto max-w-[1440px] px-5 pb-12 pt-8 sm:px-8 sm:pb-16 sm:pt-10 lg:px-12 lg:pb-20">
          <Link href="/projects" className="inline-flex items-center gap-2 text-sm text-black/55 transition-colors hover:text-black"><ArrowLeft size={15} /> All projects</Link>
          <div className="mt-12 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
            <div>
              <p className="eyebrow">{project.category?.name ?? "Independent work"}</p>
              <h1 className="mt-4 text-balance text-5xl font-medium leading-[0.87] tracking-[-0.08em] sm:text-7xl lg:text-8xl">{project.title}</h1>
              <p className="mt-6 max-w-xl text-lg leading-7 text-black/60">{project.excerpt}</p>
            </div>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-7 border-t border-black/10 pt-6 text-sm sm:grid-cols-3 lg:pt-0">
              <div><dt className="eyebrow">Client</dt><dd className="mt-2 text-black/70">{project.client || "Independent"}</dd></div>
              <div><dt className="eyebrow">Year</dt><dd className="mt-2 text-black/70">{project.year || "—"}</dd></div>
              <div className="col-span-2 sm:col-span-1"><dt className="eyebrow">Services</dt><dd className="mt-2 leading-6 text-black/70">{project.services.join(", ")}</dd></div>
            </dl>
          </div>
          <ProjectArt project={project} priority className="mt-12 aspect-[1.55/1] rounded-[24px] border border-black/10 sm:mt-16" />
        </section>

        <section className="mx-auto max-w-[1120px] px-5 py-16 sm:px-8 sm:py-20 lg:py-28">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {blocks.map((block) => {
              if (block.type === "TEXT") {
                return (
                  <article key={block.id} className="md:col-span-2 mx-auto max-w-3xl py-5 sm:py-10">
                    <p className="text-balance text-3xl font-medium leading-[1.02] tracking-[-0.055em] sm:text-5xl">{text(block.content?.heading, "A system with room to move.")}</p>
                    <p className="mt-6 max-w-2xl text-lg leading-8 text-black/60">{text(block.content?.body, project.description)}</p>
                  </article>
                );
              }

              const visual = text(block.content?.visual, project.visual) as PortfolioProject["visual"];
              if (block.type === "VIDEO" || block.type === "EMBED") {
                const source = block.type === "VIDEO" ? videoUrl(text(block.content?.url)) : embedUrl(text(block.content?.url));
                if (!source) return null;
                return <figure key={block.id} data-reveal className={block.layout === "half" ? "min-w-0" : "min-w-0 md:col-span-2"}>{block.type === "VIDEO" ? <video controls playsInline preload="metadata" className="aspect-video w-full rounded-[22px] bg-black" src={source} aria-label={text(block.content?.heading, `${project.title} video`)} /> : <iframe title={text(block.content?.heading, `${project.title} video`)} src={source} loading="lazy" className="aspect-video w-full rounded-[22px] border-0 bg-black" allow="fullscreen; picture-in-picture; encrypted-media" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen />}{text(block.content?.body) && <figcaption className="mt-3 text-sm text-black/55">{text(block.content?.body)}</figcaption>}</figure>;
              }
              const blockProject: PortfolioProject = { ...project, coverUrl: block.assetUrl ?? null, coverAlt: block.assetAlt ?? null, visual };
              return <ProjectArt key={block.id} project={blockProject} className={`${block.layout === "half" ? "aspect-[1/1]" : "aspect-[1.45/1] md:col-span-2"} rounded-[22px] border border-black/10`} />;
            })}
          </div>
          <div className="mt-16 flex flex-col gap-5 border-t border-black/10 pt-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow">Project notes</p>
              <p className="mt-2 text-sm text-black/60">{project.tags.join(" · ")}</p>
            </div>
            {project.externalLink ? <a href={project.externalLink} target="_blank" rel="noreferrer" className="button button-secondary w-fit">Visit project <ArrowUpRight size={15} /></a> : null}
          </div>
        </section>

        {relatedProjects.length ? (
          <section className="border-t border-black/10 bg-[#f7f7f5]">
            <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28">
              <p className="eyebrow">More work</p>
              <div className="mt-8 grid gap-x-5 gap-y-10 md:grid-cols-2">
                {relatedProjects.map((item) => <ProjectCard key={item.id} project={item} />)}
              </div>
            </div>
          </section>
        ) : null}
      </main>
      <SiteFooter profile={profile} />
    </>
  );
}
