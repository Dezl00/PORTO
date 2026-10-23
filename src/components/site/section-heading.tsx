import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  body?: string;
  className?: string;
};

export function SectionHeading({ id, eyebrow, title, body, className }: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", className)}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h2 id={id} className="mt-4 text-balance text-3xl font-medium tracking-[-0.055em] sm:text-4xl lg:text-5xl">{title}</h2>
      {body ? <p className="section-muted mt-5 max-w-xl text-base leading-7 sm:text-lg">{body}</p> : null}
    </div>
  );
}
