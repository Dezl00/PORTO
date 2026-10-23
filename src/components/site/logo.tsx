import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  href?: string;
};

export function Logo({ className, href = "/" }: LogoProps) {
  return (
    <Link
      href={href}
      aria-label="SHOBAKY STUDIO — home"
      className={cn("inline-flex items-baseline gap-1.5 tracking-[-0.055em] text-black", className)}
    >
      <span className="text-[0.95rem] font-bold leading-none">SHOBAKY</span>
      <span className="text-[0.62rem] font-medium leading-none tracking-[-0.025em]">STUDIO</span>
    </Link>
  );
}
