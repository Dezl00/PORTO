import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProjectCard, PROJECT_GRID_CLASSNAME } from "@/components/site/project-card";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getCategories, getProfile, getProjects } from "@/lib/portfolio";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = (await getCategories()).find((item) => item.slug === slug);
  return category ? { title: category.name, description: category.description } : {};
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const [profile, categories, projects] = await Promise.all([getProfile(), getCategories(), getProjects({ category: slug })]);
  const category = categories.find((item) => item.slug === slug);
  if (!category) notFound();

  return (
    <>
      <SiteHeader />
      <main className="mx-auto max-w-[1920px] px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-28">
        <p className="eyebrow">Practice area</p>
        <div className="mt-4 flex flex-col gap-6 border-b border-black/10 pb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-5xl font-medium tracking-[-0.075em] sm:text-7xl">{category.name}</h1>
            <p className="mt-5 max-w-xl text-lg leading-7 text-black/60">{category.description}</p>
          </div>
          <p className="text-sm text-black/50">{projects.length} {projects.length === 1 ? "project" : "projects"}</p>
        </div>
        <div className={`mt-8 ${PROJECT_GRID_CLASSNAME}`}>
          {projects.map((project, index) => <ProjectCard key={project.id} project={project} compact priority={index === 0} />)}
        </div>
      </main>
      <SiteFooter profile={profile} />
    </>
  );
}
