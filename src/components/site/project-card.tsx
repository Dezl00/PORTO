import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ProjectArt } from "@/components/site/project-art";
import { cn } from "@/lib/utils";
import type { PortfolioProject } from "@/lib/types";

export const PROJECT_GRID_CLASSNAME = "grid grid-cols-1 gap-x-4 gap-y-5 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6";

const COMPACT_IMAGE_SIZES = "(min-width: 1920px) 284px, (min-width: 1536px) 16vw, (min-width: 1280px) 19vw, (min-width: 1024px) 24vw, (min-width: 768px) 32vw, (min-width: 480px) 48vw, 100vw";
const FEATURED_IMAGE_SIZES = "(min-width: 1440px) 432px, (min-width: 1024px) 31vw, (min-width: 640px) 47vw, 100vw";

type ProjectCardProps = {
  project: PortfolioProject;
  priority?: boolean;
  compact?: boolean;
  tone?: "light" | "dark";
  sizes?: string;
  variant?: "card" | "featured";
};

export function ProjectCard({ project, priority = false, compact = false, tone = "light", sizes, variant = "card" }: ProjectCardProps) {
  const dark = tone === "dark";
  const featured = variant === "featured";

  return (
    <article className="group min-w-0">
      <Link
        href={`/projects/${project.slug}`}
        className={cn(
          "block h-full rounded-[20px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4",
          featured ? "bg-transparent" : "overflow-hidden border",
          featured ? (dark ? "text-white focus-visible:outline-white" : "text-black focus-visible:outline-black") : dark
            ? "border-white/20 bg-[#1c1c1c] text-white hover:border-white/50 focus-visible:outline-white"
            : "border-black/12 bg-white text-[#111111] hover:border-black/35 focus-visible:outline-black",
        )}
      >
        <ProjectArt
          project={project}
          priority={priority}
          sizes={sizes ?? (compact ? COMPACT_IMAGE_SIZES : FEATURED_IMAGE_SIZES)}
          className={cn("aspect-[1.12/1] transition-transform duration-300", featured ? "rounded-[20px] motion-safe:group-hover:scale-[0.985]" : "border-b motion-safe:group-hover:scale-[1.015]", !featured && (dark ? "border-white/20" : "border-black/10"))}
        />
        <div className={cn("relative flex items-start justify-between", featured ? "gap-4 px-1 pt-4" : compact ? "gap-2 p-3.5" : "gap-4 p-5")}>
          <div className="min-w-0">
            <h3 className={cn("break-words font-medium leading-snug tracking-[-0.035em]", compact ? "text-sm" : "text-base sm:text-lg")}>{project.title}</h3>
            <p className={cn("mt-1 truncate", compact ? "text-xs" : "text-sm", dark ? "text-white/60" : "text-black/55")}>{project.category?.name ?? "Independent work"}</p>
          </div>
          <span aria-hidden="true" className={cn(
            "mt-0.5 flex shrink-0 items-center justify-center rounded-full transition-colors",
            !featured && "border",
            compact ? "h-7 w-7" : "h-8 w-8",
            dark ? "border-white/25 group-hover:bg-white group-hover:text-black" : "border-black/15 group-hover:bg-black group-hover:text-white",
          )}>
            <ArrowUpRight size={compact ? 13 : 15} strokeWidth={1.5} />
          </span>
        </div>
      </Link>
    </article>
  );
}
