import type { MetadataRoute } from "next";
import { getCategories, getProjects } from "@/lib/portfolio";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const [projects, categories] = await Promise.all([getProjects(), getCategories()]);
  return [
    "",
    "/projects",
    "/about",
    "/services",
    "/contact",
    ...projects.map((project) => `/projects/${project.slug}`),
    ...categories.map((category) => `/categories/${category.slug}`),
  ].map((path) => ({ url: `${baseUrl}${path}`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: path === "" ? 1 : 0.7 }));
}
