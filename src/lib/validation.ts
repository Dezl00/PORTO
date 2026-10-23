import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z.string().trim().max(40).optional(),
  service: z.string().trim().max(100).optional(),
  budget: z.string().trim().max(100).optional(),
  message: z.string().trim().min(10, "Please share a little more about the project.").max(3000),
});

export const projectSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase words separated by hyphens."),
  excerpt: z.string().trim().max(280).optional(),
  description: z.string().trim().max(10000).optional(),
  client: z.string().trim().max(120).optional(),
  year: z.coerce.number().int().min(1900).max(2100).optional(),
  categoryId: z.string().cuid().optional(),
  services: z.string().trim().max(1000).optional(),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  isFeatured: z.boolean(),
  seoTitle: z.string().trim().max(70).optional(),
  seoDescription: z.string().trim().max(160).optional(),
  externalLink: z.union([z.literal(""),z.url().refine(value => /^https?:\/\//.test(value), "Use an HTTP or HTTPS URL.")]).optional(),
  sortOrder: z.coerce.number().int().min(0).max(100000).default(0),
});

export const heroImageSettingsSchema = z.object({
  showImage: z.boolean(),
  imageAssetId: z.string().cuid().nullable(),
  imageAlt: z.string().trim().max(240),
});
