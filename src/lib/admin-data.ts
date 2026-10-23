import { demoCategories, demoProfile, demoProjects, demoSections, demoServices } from "@/lib/mock-data";
import { hasDatabaseConnection, prisma } from "@/lib/prisma";

export type AdminProjectRow = {
  id: string;
  title: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isFeatured: boolean;
  categoryName: string;
  categoryId: string | null;
  excerpt: string;
  description: string;
  client: string;
  year: number | null;
  services: string[];
  tags: string[];
  coverAssetId: string | null;
  coverUrl: string | null;
  seoTitle: string;
  seoDescription: string;
  createdAt: Date;
  updatedAt: Date;
  sortOrder: number;
  externalLink: string;
};

export type AdminCategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  isVisible: boolean;
  sortOrder: number;
  projectCount: number;
  coverAssetId?: string | null;
  coverUrl?: string | null;
  seoTitle?: string;
  seoDescription?: string;
};

export type AdminServiceRow = {
  id: string;
  title: string;
  slug: string;
  description: string;
  iconKey: string;
  isVisible: boolean;
  sortOrder: number;
};

export type AdminMessageRow = {
  id: string;
  name: string;
  email: string;
  service: string;
  budget: string;
  message: string;
  status: "NEW" | "READ" | "REPLIED" | "ARCHIVED";
  createdAt: Date;
};

export type AdminProjectBlockRow = {
  id: string;
  type: "TEXT" | "IMAGE" | "VIDEO" | "EMBED";
  layout: string;
  sortOrder: number;
  assetId: string | null;
  assetUrl: string | null;
  content: Record<string, unknown> | null;
};

export async function getAdminProjects(): Promise<AdminProjectRow[]> {
  if (!hasDatabaseConnection() || !prisma) {
    return demoProjects.map((project, index) => ({
      id: project.id,
      title: project.title,
      slug: project.slug,
      status: "PUBLISHED",
      isFeatured: project.isFeatured,
      categoryName: project.category?.name || "Uncategorised",
      categoryId: null,
      excerpt: project.excerpt,
      description: project.description,
      client: project.client || "",
      year: project.year || null,
      services: project.services,
      tags: project.tags,
      coverAssetId: null,
      coverUrl: null,
      seoTitle: project.title,
      seoDescription: project.excerpt,
      createdAt: new Date(Date.now() - index * 86_400_000),
      updatedAt: new Date(),
      sortOrder: index,
      externalLink: project.externalLink || "",
    }));
  }

  const projects = await prisma.project.findMany({
    include: { category: true, coverAsset: true, tags: true },
    orderBy: [{ updatedAt: "desc" }],
  });
  return projects.map((project) => ({
    id: project.id,
    title: project.title,
    slug: project.slug,
    status: project.status,
    isFeatured: project.isFeatured,
    categoryName: project.category?.name || "Uncategorised",
    categoryId: project.categoryId,
    excerpt: project.excerpt || "",
    description: project.description || "",
    client: project.client || "",
    year: project.year,
    services: project.services,
    tags: project.tags.map((tag) => tag.name),
    coverAssetId: project.coverAssetId,
    coverUrl: project.coverAsset?.secureUrl || null,
    seoTitle: project.seoTitle || "",
    seoDescription: project.seoDescription || "",
    createdAt: project.createdAt,
    updatedAt: project.updatedAt,
    sortOrder: project.sortOrder,
    externalLink: project.externalLink || "",
  }));
}

export async function getAdminCategories(): Promise<AdminCategoryRow[]> {
  if (!hasDatabaseConnection() || !prisma) {
    return demoCategories.map((category, index) => ({ ...category, isVisible: true, sortOrder: index }));
  }
  const categories = await prisma.category.findMany({
    include: { _count: { select: { projects: true } }, coverAsset: true },
    orderBy: { sortOrder: "asc" },
  });
  return categories.map((category) => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description || "",
    isVisible: category.isVisible,
    sortOrder: category.sortOrder,
    projectCount: category._count.projects,
    coverAssetId: category.coverAssetId,
    coverUrl: category.coverAsset?.secureUrl,
    seoTitle: category.seoTitle || "",
    seoDescription: category.seoDescription || "",
  }));
}

export async function getAdminServices(): Promise<AdminServiceRow[]> {
  if (!hasDatabaseConnection() || !prisma) {
    return demoServices.map((service, index) => ({ ...service, isVisible: true, sortOrder: index }));
  }
  const services = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });
  return services.map((service) => ({
    id: service.id,
    title: service.title,
    slug: service.slug,
    description: service.description || "",
    iconKey: service.iconKey || "Shapes",
    isVisible: service.isVisible,
    sortOrder: service.sortOrder,
  }));
}

export async function getAdminSections() {
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

export async function getAdminMessages(): Promise<AdminMessageRow[]> {
  if (!hasDatabaseConnection() || !prisma) return [];
  const messages = await prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 100 });
  return messages.map((message) => ({
    id: message.id,
    name: message.name,
    email: message.email,
    service: message.service || "—",
    budget: message.budget || "—",
    message: message.message,
    status: message.status,
    createdAt: message.createdAt,
  }));
}

export async function getAdminProjectBlocks(projectId: string): Promise<AdminProjectBlockRow[]> {
  if (!hasDatabaseConnection() || !prisma) return [];
  const blocks = await prisma.projectBlock.findMany({
    where: { projectId },
    include: { asset: true },
    orderBy: { sortOrder: "asc" },
  });
  return blocks.map((block) => ({
    id: block.id,
    type: block.type,
    layout: block.layout,
    sortOrder: block.sortOrder,
    assetId: block.assetId,
    assetUrl: block.asset?.secureUrl || null,
    content: (block.content as Record<string, unknown> | null) ?? null,
  }));
}

export async function getAdminSettings() {
  if (!hasDatabaseConnection() || !prisma) {
    return {
      brandName: demoProfile.brandName,
      founderName: demoProfile.founderName,
      siteDescription: demoProfile.description,
      accentColor: demoProfile.accentColor,
      email: demoProfile.email,
      instagram: "",
      behance: "",
      linkedin: "",
      dribbble: "", whatsapp: "", youtube: "", twitter: "",
      defaultSeoTitle: "SHOBAKY STUDIO — Graphic Design Portfolio",
      defaultSeoDescription: "Selected graphic design work by Mohamed Alshobaky, founder of SHOBAKY STUDIO.",
    };
  }
  const settings = await prisma.siteSettings.findUnique({ where: { id: "site" } });
  const social = settings?.socialLinks && typeof settings.socialLinks === "object" && !Array.isArray(settings.socialLinks) ? settings.socialLinks as Record<string, unknown> : {};
  const contact = settings?.contactDetails && typeof settings.contactDetails === "object" && !Array.isArray(settings.contactDetails) ? settings.contactDetails as Record<string, unknown> : {};
  return {
    brandName: settings?.brandName || demoProfile.brandName,
    founderName: settings?.founderName || demoProfile.founderName,
    siteDescription: settings?.siteDescription || demoProfile.description,
    accentColor: settings?.accentColor || demoProfile.accentColor,
    email: typeof contact.email === "string" ? contact.email : demoProfile.email,
    instagram: typeof social.instagram === "string" ? social.instagram : "",
    behance: typeof social.behance === "string" ? social.behance : "",
    linkedin: typeof social.linkedin === "string" ? social.linkedin : "",
    dribbble: typeof social.dribbble === "string" ? social.dribbble : "",
    whatsapp: typeof social.whatsapp === "string" ? social.whatsapp : "",
    youtube: typeof social.youtube === "string" ? social.youtube : "",
    twitter: typeof social.twitter === "string" ? social.twitter : "",
    defaultSeoTitle: settings?.defaultSeoTitle || "SHOBAKY STUDIO — Graphic Design Portfolio",
    defaultSeoDescription: settings?.defaultSeoDescription || "Selected graphic design work by Mohamed Alshobaky, founder of SHOBAKY STUDIO.",
  };
}

export async function getAdminDashboard() {
  if (!hasDatabaseConnection() || !prisma) {
    return {
      demo: true,
      projects: demoProjects.length,
      published: demoProjects.length,
      categories: demoCategories.length,
      newMessages: 0,
      recentProjects: await getAdminProjects(),
    };
  }
  const [projects, published, categories, newMessages, recentProjects] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { status: "PUBLISHED" } }),
    prisma.category.count(),
    prisma.contactMessage.count({ where: { status: "NEW" } }),
    getAdminProjects(),
  ]);
  return { demo: false, projects, published, categories, newMessages, recentProjects: recentProjects.slice(0, 5) };
}

export async function getAdminMedia() {
  if (!hasDatabaseConnection() || !prisma) return [];
  return prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    select: { id: true, publicId: true, secureUrl: true, alt: true, width: true, height: true, bytes: true, kind: true, createdAt: true },
  });
}
