export type SectionTone = "light" | "soft" | "dark";

export const latestProjectsSection = {
  key: "latest-projects",
  label: "Latest Projects",
  type: "CUSTOM" as const,
  content: {
    eyebrow: "Latest projects",
    title: "The latest from the studio.",
    body: "A look at the six most recently published projects.",
    background: "light",
  },
};

export function getSectionTone(key: string, content: Record<string, unknown> | null): SectionTone {
  const background = content?.background;
  if (key === "hero" && background === "soft") return "light";
  if (background === "light" || background === "soft" || background === "dark") return background;
  if (key === "featured-work" || key === "services") return "dark";
  return key === "categories" ? "soft" : "light";
}

export function getHeroImage(content: Record<string, unknown> | null) {
  return {
    assetId: typeof content?.imageAssetId === "string" ? content.imageAssetId : "",
    url: typeof content?.imageUrl === "string" ? content.imageUrl.trim() : "",
    alt: typeof content?.imageAlt === "string" ? content.imageAlt : "",
    width: typeof content?.imageWidth === "number" && content.imageWidth > 0 ? content.imageWidth : 1200,
    height: typeof content?.imageHeight === "number" && content.imageHeight > 0 ? content.imageHeight : 1200,
    showImage: content?.showImage !== false,
  };
}
