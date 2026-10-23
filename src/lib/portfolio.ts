import { unstable_noStore as noStore } from "next/cache";
import { demoCategories, demoProfile, demoProjects, demoSections, demoServices } from "@/lib/mock-data";
import { hasDatabaseConnection, prisma } from "@/lib/prisma";
import type {
  PortfolioCategory,
  PortfolioBlock,
  PortfolioProject,
  PortfolioSection,
  PortfolioService,
  SiteProfile,
} from "@/lib/types";

function visualFor(projectId: string): PortfolioProject["visual"] {
  const hash = Array.from(projectId).reduce((value, character) => (value * 31 + character.charCodeAt(0)) >>> 0, 0);
  return ["noura", "form", "index", "studio", "mono"][hash % 5] as PortfolioProject["visual"];
}

function asRecord(value: unknown): Record<string, string> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? Object.fromEntries(
        Object.entries(value as Record<string, unknown>).filter((entry): entry is [string, string] => typeof entry[1] === "string"),
      )
    : {};
}

export async function getProfile(): Promise<SiteProfile> {
  noStore();
  if (!hasDatabaseConnection() || !prisma) return demoProfile;

  const settings = await prisma.siteSettings.findUnique({ where: { id: "site" } });
  if (!settings) return demoProfile;

  const contact = asRecord(settings.contactDetails);
  return {
    brandName: settings.brandName,
    founderName: settings.founderName,
    description: settings.siteDescription ?? demoProfile.description,
    accentColor: settings.accentColor,
    email: contact.email || demoProfile.email,
    socials: asRecord(settings.socialLinks),
  };
}

export async function getProjects(options?: {
  category?: string;
  featured?: boolean;
  includeDrafts?: boolean;
  sort?: "manual" | "latest";
  limit?: number;
}): Promise<PortfolioProject[]> {
  noStore();
  const { category, featured, includeDrafts = false, sort = "manual", limit } = options ?? {};

  if (!hasDatabaseConnection() || !prisma) {
    const projects = demoProjects.filter(
      (project) =>
        (!category || project.category?.slug === category) &&
        (featured === undefined || project.isFeatured === featured),
    );
    if (sort === "latest") {
      projects.sort((a, b) => Date.parse(b.publishedAt || "1970-01-01") - Date.parse(a.publishedAt || "1970-01-01"));
    }
    return limit === undefined ? projects : projects.slice(0, limit);
  }

  const projects = await prisma.project.findMany({
    where: {
      ...(includeDrafts ? {} : { status: "PUBLISHED" }),
      ...(featured === undefined ? {} : { isFeatured: featured }),
      ...(category ? { category: { slug: category } } : {}),
    },
    include: {
      category: true,
      tags: true,
      coverAsset: true,
    },
    orderBy: sort === "latest"
      ? [{ publishedAt: { sort: "desc", nulls: "last" } }, { createdAt: "desc" }, { id: "asc" }]
      : [{ sortOrder: "asc" }, { publishedAt: "desc" }],
    ...(limit === undefined ? {} : { take: limit }),
  });

  return projects.map((project) => ({
    id: project.id,
    title: project.title,
    slug: project.slug,
    excerpt: project.excerpt ?? "",
    description: project.description ?? project.excerpt ?? "",
    client: project.client,
    year: project.year,
    services: project.services,
    externalLink: project.externalLink,
    category: project.category ? { name: project.category.name, slug: project.category.slug } : null,
    tags: project.tags.map((tag) => tag.name),
    isFeatured: project.isFeatured,
    publishedAt: project.publishedAt?.toISOString(),
    coverUrl: project.coverAsset?.secureUrl,
    coverAlt: project.coverAsset?.alt,
    visual: visualFor(project.id),
  }));
}

export async function getProjectBySlug(slug: string): Promise<PortfolioProject | null> {
  const project = (await getProjects({ includeDrafts: false })).find((item) => item.slug === slug);
  if (project) return project;

  if (!hasDatabaseConnection() || !prisma) return null;
  const redirect = await prisma.projectSlugRedirect.findUnique({ where: { oldSlug: slug }, include: { project: true } });
  if (!redirect || redirect.project.status !== "PUBLISHED") return null;

  return (await getProjects({ includeDrafts: false })).find((item) => item.slug === redirect.project.slug) ?? null;
}

export async function getProjectBlocks(project: PortfolioProject): Promise<PortfolioBlock[]> {
  noStore();
  if (!hasDatabaseConnection() || !prisma || project.id.startsWith("demo-")) {
    return [
      {
        id: `${project.id}-statement`,
        type: "TEXT",
        layout: "full",
        content: { heading: "A system with room to move.", body: project.description },
      },
      { id: `${project.id}-visual-one`, type: "IMAGE", layout: "half", groupId: "visual-pair", content: { visual: project.visual }, assetUrl: null },
      { id: `${project.id}-visual-two`, type: "IMAGE", layout: "half", groupId: "visual-pair", content: { visual: project.visual === "noura" ? "index" : "noura" }, assetUrl: null },
    ];
  }

  const blocks = await prisma.projectBlock.findMany({
    where: { projectId: project.id },
    include: { asset: true },
    orderBy: { sortOrder: "asc" },
  });

  return blocks.map((block) => ({
    id: block.id,
    type: block.type,
    layout: block.layout,
    groupId: block.groupId,
    content: (block.content as Record<string, unknown> | null) ?? null,
    assetUrl: block.asset?.secureUrl,
    assetAlt: block.asset?.alt,
  }));
}

export async function getCategories(): Promise<PortfolioCategory[]> {
  noStore();
  if (!hasDatabaseConnection() || !prisma) return demoCategories;

  const categories = await prisma.category.findMany({
    where: { isVisible: true },
    include: { _count: { select: { projects: { where: { status: "PUBLISHED" } } } }, coverAsset: true },
    orderBy: { sortOrder: "asc" },
  });
  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
    projectCount: category._count.projects,
    coverUrl: category.coverAsset?.secureUrl,
  }));
}

export async function getServices(): Promise<PortfolioService[]> {
  noStore();
  if (!hasDatabaseConnection() || !prisma) return demoServices;
  const services = await prisma.service.findMany({ where: { isVisible: true }, orderBy: { sortOrder: "asc" } });
  return services.map((service) => ({
    id: service.id,
    title: service.title,
    slug: service.slug,
    description: service.description ?? "",
    iconKey: service.iconKey ?? "Shapes",
  }));
}

export async function getSections(): Promise<PortfolioSection[]> {
  noStore();
  if (!hasDatabaseConnection() || !prisma) return demoSections;
  const sections = await prisma.homeSection.findMany({ orderBy: { sortOrder: "asc" } });
  return sections.map((section) => ({
    id: section.id,
    key: section.key,
    label: section.label,
    type: section.type,
    isVisible: section.isVisible,
    sortOrder: section.sortOrder,
    content: (section.content as Record<string, unknown> | null) ?? null,
  }));
}

export async function getHomeData() {
  const [profile, featuredProjects, latestProjects, services, sections] = await Promise.all([
    getProfile(),
    getProjects({ featured: true }),
    getProjects({ sort: "latest", limit: 6 }),
    getServices(),
    getSections(),
  ]);

  return { profile, featuredProjects, latestProjects, services, sections };
}
