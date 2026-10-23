import { PanelsTopLeft, Shapes, Sparkles } from "lucide-react";
import type { PortfolioService } from "@/lib/types";

const icons = { Shapes, Sparkles, PanelsTopLeft };

export function ServiceCard({ service, index }: { service: PortfolioService; index: number }) {
  const Icon = icons[service.iconKey as keyof typeof icons] ?? Shapes;
  return (
    <article className="rounded-[22px] border border-black/15 bg-white p-6 text-black sm:p-7">
      <div className="flex items-start justify-between">
        <Icon size={24} strokeWidth={1.35} />
        <span className="text-xs text-black/40">0{index + 1}</span>
      </div>
      <h3 className="mt-14 text-xl font-medium tracking-[-0.045em]">{service.title}</h3>
      <p className="mt-3 max-w-sm text-sm leading-6 text-black/55">{service.description}</p>
    </article>
  );
}
