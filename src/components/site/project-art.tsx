import Image from "next/image";
import { cn } from "@/lib/utils";
import type { PortfolioProject } from "@/lib/types";

export function ProjectArt({ project, className, priority = false, sizes = "(max-width: 768px) 100vw, 50vw" }: { project: PortfolioProject; className?: string; priority?: boolean; sizes?: string }) {
  if (project.coverUrl) {
    return (
      <div data-reveal className={cn("relative overflow-hidden bg-[#e9e9e7]", className)}>
        <Image src={project.coverUrl} alt={project.coverAlt || project.title} fill sizes={sizes} preload={priority} className="object-cover" />
      </div>
    );
  }

  return (
    <div data-reveal className={cn("project-art @container relative isolate overflow-hidden", `art-${project.visual}`, className)} aria-label={`${project.title} project cover`} role="img">
      {project.visual === "noura" ? (
        <>
          <div className="absolute left-[12%] top-[12%] h-[53%] w-[53%] rounded-full border-[3cqi] border-black" />
          <p className="absolute bottom-[10%] left-[11%] text-[13cqi] font-semibold tracking-[-0.08em]">NOURA</p>
          <div className="absolute bottom-[14%] right-[12%] h-[18%] w-[18%] border border-black" />
        </>
      ) : null}
      {project.visual === "form" ? (
        <>
          <p className="absolute left-[8%] top-[10%] text-[38cqi] font-semibold leading-[0.74] tracking-[-0.11em]">F&F</p>
          <div className="absolute bottom-[10%] left-[8%] right-[8%] border-t border-black" />
          <p className="absolute bottom-[14%] left-[8%] text-[3.5cqi] tracking-[0.1em]">FORM / FIELD / 26</p>
        </>
      ) : null}
      {project.visual === "index" ? (
        <>
          <div className="absolute inset-[10%] grid grid-cols-3 gap-[2cqi] border border-black p-[2cqi]">
            <span className="col-span-2 border border-black" />
            <span className="border border-black bg-black" />
            <span className="border border-black bg-black" />
            <span className="col-span-2 border border-black" />
          </div>
          <p className="absolute bottom-[5%] right-[8%] text-[3cqi] tracking-[0.12em]">INDEX / ARCHIVE</p>
        </>
      ) : null}
      {project.visual === "studio" ? (
        <>
          <p className="absolute left-[8%] top-[8%] text-[7cqi] tracking-[-0.06em]">SIGNAL</p>
          <div className="absolute left-[8%] top-[25%] h-[50%] w-[84%] border border-black" />
          <div className="absolute left-[18%] top-[35%] h-[30%] w-[64%] rounded-full border-[2cqi] border-black" />
          <p className="absolute bottom-[8%] left-[8%] text-[7cqi] tracking-[-0.06em]">STILL</p>
        </>
      ) : null}
      {project.visual === "mono" ? (
        <>
          <p className="absolute left-[8%] top-[10%] text-[3.4cqi] tracking-[0.2em]">STUDIO NOTES</p>
          <div className="absolute left-[8%] right-[8%] top-[25%] h-px bg-black" />
          <p className="absolute left-[8%] top-[34%] max-w-[80%] text-[12cqi] font-medium leading-[0.87] tracking-[-0.09em]">A small collection of thoughts on making.</p>
          <div className="absolute bottom-[10%] left-[8%] h-[12%] w-[12%] rounded-full bg-black" />
        </>
      ) : null}
    </div>
  );
}
