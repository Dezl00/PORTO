import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { PortfolioCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

export function CategoryCard({ category, index, tone = "light" }: { category: PortfolioCategory; index: number; tone?: "light" | "dark" }) {
  const labels = ["01", "02", "03", "04", "05"];
  return (
    <Link href={`/categories/${category.slug}`} className={cn("group flex min-h-[230px] flex-col justify-between rounded-[22px] border bg-white p-6 text-black transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 sm:p-7", tone === "dark" ? "border-white/25 hover:bg-[#efefed] focus-visible:outline-white" : "border-black/10 hover:bg-black hover:text-white focus-visible:outline-black")}>
      <div className="flex items-start justify-between">
        <span className={cn("text-xs text-black/55", tone === "light" && "group-hover:text-white/65")}>{labels[index] ?? String(index + 1).padStart(2, "0")}</span>
        <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.5} className={cn("text-black/65", tone === "light" && "group-hover:text-white")} />
      </div>
      <div>
        <h3 className="text-xl font-medium tracking-[-0.045em]">{category.name}</h3>
        <p className={cn("mt-2 max-w-xs text-sm leading-6 text-black/60", tone === "light" && "group-hover:text-white/70")}>{category.description}</p>
        <p className={cn("mt-5 text-xs text-black/55", tone === "light" && "group-hover:text-white/65")}>{category.projectCount} {category.projectCount === 1 ? "project" : "projects"}</p>
      </div>
    </Link>
  );
}
