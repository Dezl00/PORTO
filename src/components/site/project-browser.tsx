"use client";

import { Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ProjectCard, PROJECT_GRID_CLASSNAME } from "@/components/site/project-card";
import type { PortfolioCategory, PortfolioProject } from "@/lib/types";

export function ProjectBrowser({ projects, categories }: { projects: PortfolioProject[]; categories: PortfolioCategory[] }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [query, setQuery] = useState("");
  const visibleProjects = useMemo(() => {
    const term = query.trim().toLowerCase();
    return projects.filter((project) => {
      const inCategory = activeCategory === "all" || project.category?.slug === activeCategory;
      const haystack = [project.title, project.excerpt, project.category?.name, ...project.tags].filter(Boolean).join(" ").toLowerCase();
      return inCategory && (!term || haystack.includes(term));
    });
  }, [activeCategory, projects, query]);

  return (
    <>
      <div className="mt-10 flex flex-col gap-4 border-y border-black/10 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
          <button onClick={() => setActiveCategory("all")} aria-pressed={activeCategory === "all"} className={`shrink-0 rounded-full border px-4 py-2 text-sm ${activeCategory === "all" ? "border-black bg-black text-white" : "border-black/15 text-black/60 hover:border-black"}`}>All work</button>
          {categories.map((category) => (
            <button key={category.id} onClick={() => setActiveCategory(category.slug)} aria-pressed={activeCategory === category.slug} className={`shrink-0 rounded-full border px-4 py-2 text-sm ${activeCategory === category.slug ? "border-black bg-black text-white" : "border-black/15 text-black/60 hover:border-black"}`}>
              {category.name}
            </button>
          ))}
        </div>
        <label className="relative block lg:w-64">
          <Search size={16} strokeWidth={1.5} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-black/45" />
          <input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search projects" placeholder="Search work" className="h-10 w-full rounded-full border border-black/15 bg-white py-2 pl-9 pr-9 text-sm outline-none focus:border-black" />
          {query ? <button onClick={() => setQuery("")} aria-label="Clear search" className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-black/45 hover:text-black"><X size={15} /></button> : null}
        </label>
      </div>
      {visibleProjects.length ? (
        <div className={`mt-8 ${PROJECT_GRID_CLASSNAME}`}>
          {visibleProjects.map((project, index) => <ProjectCard key={project.id} project={project} compact priority={index === 0} />)}
        </div>
      ) : (
        <div className="mt-12 rounded-[22px] border border-black/10 p-8 sm:p-10">
          <p className="text-lg font-medium tracking-[-0.035em]">No projects found.</p>
          <button onClick={() => { setActiveCategory("all"); setQuery(""); }} className="mt-4 text-sm underline underline-offset-4">Clear filters</button>
        </div>
      )}
    </>
  );
}
