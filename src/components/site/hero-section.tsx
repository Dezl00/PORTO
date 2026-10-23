import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getHeroImage, getSectionTone } from "@/lib/home-sections";
import type { PortfolioSection } from "@/lib/types";

function sectionText(section: PortfolioSection, key: string, fallback: string) {
  const value = section.content?.[key];
  return typeof value === "string" && value.trim() ? value : fallback;
}

export function HeroSection({ section, selectedWorkVisible }: { section: PortfolioSection; selectedWorkVisible: boolean }) {
  const image = getHeroImage(section.content);
  const hasImage = image.showImage && Boolean(image.url);

  return (
    <section id="hero" className="home-section hero-section" data-tone={getSectionTone(section.key, section.content)} aria-labelledby="hero-title">
      <div className="hero-layout" data-has-image={hasImage}>
        {hasImage ? (
          <div className="hero-image">
            <Image
              src={image.url}
              alt={image.alt}
              width={image.width}
              height={image.height}
              sizes="(min-width: 1024px) 480px, (min-width: 400px) 340px, calc(100vw - 40px)"
              preload
            />
          </div>
        ) : null}
        <div className="hero-copy">
          <p className="eyebrow">{sectionText(section, "eyebrow", "Independent graphic design")}</p>
          <h1 id="hero-title" className="hero-title">{sectionText(section, "title", "Ideas, shaped into systems.")}</h1>
          <p className="hero-description section-muted">{sectionText(section, "body", "SHOBAKY STUDIO is the independent practice of Mohamed Alshobaky.")}</p>
          <div className="hero-actions">
            <Link href={selectedWorkVisible ? "#featured-work" : "/projects"} className="button section-button-primary">View selected work <ArrowRight size={16} aria-hidden="true" /></Link>
            <Link href="/contact" className="button section-button-secondary">Start a project</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
