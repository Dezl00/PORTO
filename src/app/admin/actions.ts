"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { destroyAdminSession, requireAdmin } from "@/lib/auth";
import { hasDatabaseConnection, prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { heroImageSettingsSchema, projectSchema } from "@/lib/validation";
import { getSectionTone } from "@/lib/home-sections";
import { z } from "zod";
import { pageDefaults } from "@/lib/page-copy";
import { embedUrl, videoUrl } from "@/lib/project-media";

function database() {
  if (!hasDatabaseConnection() || !prisma) {
    throw new Error("Saving is unavailable. Complete your workspace setup and try again.");
  }
  return prisma;
}

function refreshPublicPages(slug?: string, categorySlug?: string | null) {
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/projects/${slug}`);
  if (categorySlug) revalidatePath(`/categories/${categorySlug}`);
}

async function getTags(db: ReturnType<typeof database>, source: string) {
  const names = [...new Set(source.split(",").map((value) => value.trim()).filter(Boolean))];
  return Promise.all(
    names.map((name) =>
      db.tag.upsert({
        where: { slug: slugify(name) },
        update: { name },
        create: { name, slug: slugify(name) },
      }),
    ),
  );
}

function projectInput(formData: FormData) {
  return projectSchema.parse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt") || undefined,
    description: formData.get("description") || undefined,
    client: formData.get("client") || undefined,
    year: formData.get("year") || undefined,
    categoryId: formData.get("categoryId") || undefined,
    services: formData.get("services") || undefined,
    status: formData.get("status"),
    isFeatured: formData.get("isFeatured") === "on",
    seoTitle: formData.get("seoTitle") || undefined,
    seoDescription: formData.get("seoDescription") || undefined,
    externalLink: formData.get("externalLink") || undefined,
    sortOrder: formData.get("sortOrder") || 0,
  });
}

export async function logoutAction() {
  await destroyAdminSession();
  redirect("/admin/login");
}

export async function createProjectAction(formData: FormData) {
  await requireAdmin();
  const db = database();
  const input = projectInput(formData);
  const tags = await getTags(db, String(formData.get("tags") || ""));
  const existing = await db.project.findUnique({ where: { slug: input.slug } });
  if (existing) throw new Error("This slug is already in use. Choose a unique URL.");

  const project = await db.project.create({
    data: {
      title: input.title,
      slug: input.slug,
      excerpt: input.excerpt || null,
      description: input.description || null,
      client: input.client || null,
      year: input.year || null,
      services: input.services ? input.services.split(",").map((item) => item.trim()).filter(Boolean) : [],
      status: input.status,
      isFeatured: input.isFeatured,
      publishedAt: input.status === "PUBLISHED" ? new Date() : null,
      categoryId: input.categoryId || null,
      coverAssetId: String(formData.get("coverAssetId") || "") || null,
      seoTitle: input.seoTitle || null,
      seoDescription: input.seoDescription || null,
      externalLink: input.externalLink || null,
      sortOrder: input.sortOrder,
      tags: { connect: tags.map((tag) => ({ id: tag.id })) },
    },
    include: { category: true },
  });

  refreshPublicPages(project.slug, project.category?.slug);
  redirect(`/admin/projects/${project.id}?saved=1`);
}

export async function updateProjectAction(projectId: string, formData: FormData) {
  await requireAdmin();
  const db = database();
  const input = projectInput(formData);
  const tags = await getTags(db, String(formData.get("tags") || ""));
  const current = await db.project.findUnique({ where: { id: projectId }, include: { category: true } });
  if (!current) throw new Error("Project not found.");

  const slugOwner = await db.project.findUnique({ where: { slug: input.slug } });
  if (slugOwner && slugOwner.id !== projectId) throw new Error("This slug is already in use. Choose a unique URL.");

  const project = await db.$transaction(async (tx) => {
    if (current.slug !== input.slug && current.status === "PUBLISHED") {
      await tx.projectSlugRedirect.upsert({
        where: { oldSlug: current.slug },
        update: { projectId },
        create: { oldSlug: current.slug, projectId },
      });
    }
    return tx.project.update({
      where: { id: projectId },
      data: {
        title: input.title,
        slug: input.slug,
        excerpt: input.excerpt || null,
        description: input.description || null,
        client: input.client || null,
        year: input.year || null,
        services: input.services ? input.services.split(",").map((item) => item.trim()).filter(Boolean) : [],
        status: input.status,
        isFeatured: input.isFeatured,
        publishedAt: input.status === "PUBLISHED" ? current.publishedAt || new Date() : null,
        categoryId: input.categoryId || null,
        coverAssetId: String(formData.get("coverAssetId") || "") || null,
        seoTitle: input.seoTitle || null,
        seoDescription: input.seoDescription || null,
        externalLink: input.externalLink || null,
        sortOrder: input.sortOrder,
        tags: { set: tags.map((tag) => ({ id: tag.id })) },
      },
      include: { category: true },
    });
  });

  refreshPublicPages(current.slug, current.category?.slug);
  refreshPublicPages(project.slug, project.category?.slug);
  redirect(`/admin/projects/${project.id}?saved=1`);
}

export async function archiveProjectAction(formData: FormData) {
  await requireAdmin();
  const db = database();
  const id = String(formData.get("id") || "");
  const project = await db.project.update({ where: { id }, data: { status: "ARCHIVED", isFeatured: false }, include: { category: true } });
  refreshPublicPages(project.slug, project.category?.slug);
  redirect("/admin/projects");
}

export async function addProjectBlockAction(projectId: string, formData: FormData) {
  await requireAdmin();
  const db = database();
  const project = await db.project.findUnique({ where: { id: projectId }, include: { category: true } });
  if (!project) throw new Error("Project not found.");
  const type = String(formData.get("type") || "");
  const layout = String(formData.get("layout") || "full") === "half" ? "half" : "full";
  if (!["TEXT", "IMAGE", "VIDEO", "EMBED"].includes(type)) throw new Error("Choose a valid content block type.");
  const assetId = String(formData.get("assetId") || "") || null;
  if (type === "IMAGE" && !assetId) throw new Error("Upload an image before adding the media block.");
  const url = String(formData.get("url") || "").trim();
  if (type === "EMBED" && !embedUrl(url)) throw new Error("Use an HTTPS YouTube or Vimeo video URL.");
  if (type === "VIDEO" && !videoUrl(url)) throw new Error("Use an HTTPS URL ending in .mp4 or .webm.");
  if (assetId && !(await db.mediaAsset.findFirst({ where: { id: assetId, kind: "IMAGE" } }))) throw new Error("Choose a valid uploaded image.");
  const last = await db.projectBlock.aggregate({ where: { projectId }, _max: { sortOrder: true } });
  const count = (last._max.sortOrder ?? -1) + 1;
  await db.projectBlock.create({
    data: {
      projectId,
      type: type as "TEXT" | "IMAGE" | "VIDEO" | "EMBED",
      layout,
      groupId: layout === "half" ? `group-${count}` : null,
      sortOrder: count,
      assetId,
      content: {
        heading: String(formData.get("heading") || "").trim().slice(0,400),
        body: String(formData.get("body") || "").trim().slice(0,10000),
        url,
      },
    },
  });
  refreshPublicPages(project.slug, project.category?.slug);
  redirect(`/admin/projects/${projectId}?saved=1#project-content`);
}

export async function updateProjectBlockAction(projectId: string, form: FormData) {
  await requireAdmin(); const db=database();
  const id=String(form.get('id')||'');
  const block=await db.projectBlock.findFirst({where:{id,projectId},include:{project:{include:{category:true}}}});
  if(!block) throw new Error('Content block not found.');
  const layout=form.get('layout')==='half'?'half':'full';
  const assetId=String(form.get('assetId')||'')||null;
  const url=String(form.get('url')||'').trim();
  if(block.type==='IMAGE'&&(!assetId||!(await db.mediaAsset.findFirst({where:{id:assetId,kind:'IMAGE'}})))) throw new Error('Choose a valid uploaded image.');
  if(block.type==='VIDEO'&&!videoUrl(url)) throw new Error('Use an HTTPS URL ending in .mp4 or .webm.');
  if(block.type==='EMBED'&&!embedUrl(url)) throw new Error('Use an HTTPS YouTube or Vimeo video URL.');
  await db.projectBlock.update({where:{id},data:{layout,assetId:block.type==='IMAGE'?assetId:null,content:{heading:String(form.get('heading')||'').trim().slice(0,400),body:String(form.get('body')||'').trim().slice(0,10000),url}}});
  refreshPublicPages(block.project.slug,block.project.category?.slug);
  redirect(`/admin/projects/${projectId}?saved=1#project-content`);
}

export async function moveProjectBlockAction(projectId: string, formData: FormData) {
  await requireAdmin();
  const db = database();
  const id = String(formData.get("id") || "");
  const direction = String(formData.get("direction") || "");
  const current = await db.projectBlock.findFirst({ where: { id, projectId }, include: { project: { include: { category: true } } } });
  if (!current || !["up", "down"].includes(direction)) return;
  const neighbour = await db.projectBlock.findFirst({
    where: direction === "up" ? { projectId, sortOrder: { lt: current.sortOrder } } : { projectId, sortOrder: { gt: current.sortOrder } },
    orderBy: { sortOrder: direction === "up" ? "desc" : "asc" },
  });
  if (neighbour) {
    await db.$transaction([
      db.projectBlock.update({ where: { id: current.id }, data: { sortOrder: neighbour.sortOrder } }),
      db.projectBlock.update({ where: { id: neighbour.id }, data: { sortOrder: current.sortOrder } }),
    ]);
  }
  refreshPublicPages(current.project.slug, current.project.category?.slug);
  redirect(`/admin/projects/${projectId}#project-content`);
}

export async function removeProjectBlockAction(projectId: string, formData: FormData) {
  await requireAdmin();
  const db = database();
  const id = String(formData.get("id") || "");
  const block = await db.projectBlock.findFirst({ where: { id, projectId }, include: { project: { include: { category: true } } } });
  if (!block) return;
  await db.projectBlock.delete({ where: { id: block.id } });
  refreshPublicPages(block.project.slug, block.project.category?.slug);
  redirect(`/admin/projects/${projectId}#project-content`);
}

export async function createCategoryAction(formData: FormData) {
  await requireAdmin();
  const db = database();
  const name = String(formData.get("name") || "").trim();
  const rawSlug = String(formData.get("slug") || "").trim();
  const slug = slugify(rawSlug || name);
  const description = String(formData.get("description") || "").trim();
  if (!name || !slug) throw new Error("Category name and slug are required.");
  const sortOrder = await db.category.count();
  const owner = await db.category.findUnique({ where: { slug } });
  if (owner) throw new Error("This category slug is already in use.");
  await db.category.create({ data: { name: name.slice(0,120), slug, description: description.slice(0,2000) || null, sortOrder } });
  refreshPublicPages(undefined, slug);
  redirect("/admin/categories?created=1");
}

export async function updateCategoryAction(formData: FormData) {
  await requireAdmin();
  const db = database();
  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const slug = slugify(String(formData.get("slug") || ""));
  const description = String(formData.get("description") || "").trim();
  const isVisible = formData.get("isVisible") === "on";
  const current = await db.category.findUnique({ where: { id } });
  if (!current || !name || !slug) throw new Error("Please provide a category name and a valid slug.");
  const owner = await db.category.findUnique({ where: { slug } });
  if (owner && owner.id !== id) throw new Error("This category slug is already in use.");
  const coverAssetId = String(formData.get("coverAssetId") || "") || null;
  if (coverAssetId && !(await db.mediaAsset.findFirst({ where: { id: coverAssetId, kind: "IMAGE" } }))) throw new Error("Choose a valid image from the media library.");
  await db.category.update({ where: { id }, data: { name: name.slice(0,120), slug, description: description.slice(0,2000) || null, isVisible, coverAssetId, sortOrder: boundedOrder(formData.get("sortOrder")), seoTitle: String(formData.get("seoTitle") || "").slice(0,70), seoDescription: String(formData.get("seoDescription") || "").slice(0,160) } });
  refreshPublicPages(undefined, current.slug);
  refreshPublicPages(undefined, slug);
  redirect("/admin/categories?saved=1");
}

function boundedOrder(value: FormDataEntryValue | null) {
  const order = Number(value || 0);
  if (!Number.isInteger(order) || order < 0 || order > 100000) throw new Error("Order must be a whole number from 0 to 100000.");
  return order;
}

export async function deleteCategoryAction(form: FormData) {
  await requireAdmin();
  const db = database();
  const id = String(form.get("id") || "");
  if (await db.project.count({ where: { categoryId: id } })) throw new Error("Move all projects out of this category before deleting it.");
  await db.category.delete({ where: { id } });
  revalidatePath("/", "layout");
  redirect("/admin/categories?deleted=1");
}

export async function updateServiceAction(form: FormData) {
  await requireAdmin();
  const db = database();
  const id = String(form.get("id") || "");
  const title = String(form.get("title") || "").trim().slice(0,120);
  const slug = slugify(String(form.get("slug") || title));
  const iconKey = String(form.get("iconKey") || "Shapes");
  if (!title || !slug || !["Shapes","Sparkles","PanelsTopLeft"].includes(iconKey)) throw new Error("Provide a valid title, URL and icon.");
  const owner = await db.service.findUnique({ where: { slug } });
  if (owner && owner.id !== id) throw new Error("This service slug is already in use.");
  await db.service.update({ where: { id }, data: { title,slug,iconKey,description:String(form.get("description") || "").trim().slice(0,2000),isVisible:form.get("isVisible")==="on",sortOrder:boundedOrder(form.get("sortOrder")) } });
  revalidatePath("/"); revalidatePath("/services");
  redirect("/admin/services?saved=1");
}

export async function deleteServiceAction(form: FormData) {
  await requireAdmin();
  await database().service.delete({ where: { id: String(form.get("id") || "") } });
  revalidatePath("/"); revalidatePath("/services");
  redirect("/admin/services?deleted=1");
}

export async function restoreProjectAction(form: FormData) {
  await requireAdmin();
  const db = database();
  const project = await db.project.update({ where: { id: String(form.get("id") || "") }, data: { status: "DRAFT", isFeatured: false } });
  refreshPublicPages(project.slug);
  redirect("/admin/projects?restored=1");
}

export async function duplicateProjectAction(form: FormData) {
  await requireAdmin();
  const db = database();
  const source = await db.project.findUnique({ where: { id: String(form.get("id") || "") }, include: { tags: true, blocks: true } });
  if (!source) throw new Error("Project not found.");
  const project = await db.project.create({ data: {
    title: `${source.title.slice(0,110)} (copy)`, slug: `${source.slug}-copy-${crypto.randomUUID().slice(0,8)}`,
    excerpt: source.excerpt, description: source.description, client: source.client, year: source.year, services: source.services,
    coverAssetId: source.coverAssetId, categoryId: source.categoryId, externalLink: source.externalLink,
    status: "DRAFT", isFeatured: false, sortOrder: source.sortOrder,
    tags: { connect: source.tags.map(tag=>({id:tag.id})) },
    blocks: { create: source.blocks.map(block=>({ type:block.type,layout:block.layout,sortOrder:block.sortOrder,assetId:block.assetId,...(block.content ? {content:block.content} : {}) })) },
  } });
  redirect(`/admin/projects/${project.id}?saved=1`);
}

export async function createServiceAction(formData: FormData) {
  await requireAdmin();
  const db = database();
  const title = String(formData.get("title") || "").trim();
  const slug = slugify(String(formData.get("slug") || "") || title);
  const description = String(formData.get("description") || "").trim();
  const iconKey = String(formData.get("iconKey") || "Shapes");
  if (!title || !slug) throw new Error("Service title is required.");
  const sortOrder = await db.service.count();
  await db.service.create({ data: { title, slug, description: description || null, iconKey, sortOrder } });
  revalidatePath("/");
  revalidatePath("/services");
  redirect("/admin/services?created=1");
}

export async function toggleServiceAction(formData: FormData) {
  await requireAdmin();
  const db = database();
  const id = String(formData.get("id") || "");
  const current = await db.service.findUnique({ where: { id } });
  if (!current) throw new Error("Service not found.");
  await db.service.update({ where: { id }, data: { isVisible: !current.isVisible } });
  revalidatePath("/");
  revalidatePath("/services");
  redirect("/admin/services");
}

export async function updateSectionAction(formData: FormData) {
  await requireAdmin();
  const db = database();
  const id = String(formData.get("id") || "");
  const label = String(formData.get("label") || "").trim();
  const isVisible = formData.get("isVisible") === "on";
  const eyebrow = String(formData.get("eyebrow") || "").trim();
  const title = String(formData.get("title") || "").trim();
  const body = String(formData.get("body") || "").trim();
  const current = await db.homeSection.findUnique({ where: { id } });
  if (!current) throw new Error("Section not found.");
  const previousContent = current.content && typeof current.content === "object" && !Array.isArray(current.content) ? current.content : {};
  const backgroundInput = String(formData.get("background") || "");
  const background = ["light", "soft", "dark"].includes(backgroundInput) ? backgroundInput : getSectionTone(current.key, previousContent);
  let heroImageContent = {};
  if (current.key === "hero") {
    const imageSettings = heroImageSettingsSchema.parse({
      imageAssetId: String(formData.get("imageAssetId") || "").trim() || null,
      imageAlt: String(formData.get("imageAlt") || ""),
      showImage: formData.get("showImage") === "on",
    });
    const image = imageSettings.imageAssetId ? await db.mediaAsset.findUnique({ where: { id: imageSettings.imageAssetId } }) : null;
    if (imageSettings.imageAssetId && (!image || image.kind !== "IMAGE")) throw new Error("Please select a valid uploaded image for the hero.");
    heroImageContent = {
      ...imageSettings,
      imageUrl: image?.secureUrl || null,
      imageWidth: image?.width || null,
      imageHeight: image?.height || null,
    };
  }
  await db.homeSection.update({
    where: { id },
    data: { label: label || current.label, isVisible, content: { ...previousContent, eyebrow, title, body, background, ...heroImageContent } },
  });
  revalidatePath("/");
  redirect("/admin/home?saved=1");
}

export async function moveSectionAction(formData: FormData) {
  await requireAdmin();
  const db = database();
  const id = String(formData.get("id") || "");
  const direction = String(formData.get("direction") || "");
  const current = await db.homeSection.findUnique({ where: { id } });
  if (!current || !["up", "down"].includes(direction)) return;
  const neighbour = await db.homeSection.findFirst({
    where: {
      key: { not: "categories" },
      sortOrder: direction === "up" ? { lt: current.sortOrder } : { gt: current.sortOrder },
    },
    orderBy: { sortOrder: direction === "up" ? "desc" : "asc" },
  });
  if (neighbour) {
    await db.$transaction([
      db.homeSection.update({ where: { id: current.id }, data: { sortOrder: neighbour.sortOrder } }),
      db.homeSection.update({ where: { id: neighbour.id }, data: { sortOrder: current.sortOrder } }),
    ]);
  }
  revalidatePath("/");
  redirect("/admin/home");
}

export async function updateSettingsAction(formData: FormData) {
  await requireAdmin();
  const db = database();
  const brandName = String(formData.get("brandName") || "SHOBAKY STUDIO").trim();
  const founderName = String(formData.get("founderName") || "MOHAMED ALSHOBAKY").trim();
  const siteDescription = String(formData.get("siteDescription") || "").trim();
  const accentColor = String(formData.get("accentColor") || "#111111").trim();
  const email = String(formData.get("email") || "").trim();
  const instagram = String(formData.get("instagram") || "").trim();
  const behance = String(formData.get("behance") || "").trim();
  const linkedin = String(formData.get("linkedin") || "").trim();
  const defaultSeoTitle = z.string().trim().min(1).max(70).parse(String(formData.get("defaultSeoTitle") || brandName));
  const defaultSeoDescription = z.string().trim().max(160).parse(String(formData.get("defaultSeoDescription") || ""));
  z.string().email().parse(email);
  z.string().min(1).max(120).parse(brandName);
  z.string().min(1).max(120).parse(founderName);
  z.string().regex(/^#[0-9a-fA-F]{6}$/).parse(accentColor);
  const socials: Record<string,string> = { instagram,behance,linkedin };
  for (const key of ["dribbble","whatsapp","youtube","twitter"]) socials[key] = String(formData.get(key) || "").trim();
  for (const url of Object.values(socials)) if (url && !/^https?:\/\//i.test(url)) throw new Error("Social links must start with https:// or http://.");
  const existingSettings = await db.siteSettings.findUnique({ where: { id: "site" } });
  const oldContact = existingSettings?.contactDetails && typeof existingSettings.contactDetails === "object" && !Array.isArray(existingSettings.contactDetails) ? existingSettings.contactDetails : {};
  await db.siteSettings.upsert({
    where: { id: "site" },
    update: { brandName, founderName, siteDescription: siteDescription.slice(0,2000) || null, accentColor, defaultSeoTitle, defaultSeoDescription, socialLinks: socials, contactDetails: { ...oldContact,email } },
    create: { id: "site", brandName, founderName, siteDescription: siteDescription.slice(0,2000) || null, accentColor, defaultSeoTitle, defaultSeoDescription, socialLinks: socials, contactDetails: { email } },
  });
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
  revalidatePath("/", "layout");
  redirect("/admin/settings?saved=1");
}

export async function updateMessageStatusAction(formData: FormData) {
  await requireAdmin();
  const db = database();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "READ");
  if (!["NEW", "READ", "REPLIED", "ARCHIVED"].includes(status)) throw new Error("Invalid message status.");
  await db.contactMessage.update({ where: { id }, data: { status: status as "NEW" | "READ" | "REPLIED" | "ARCHIVED", readAt: status === "READ" ? new Date() : undefined, repliedAt: status === "REPLIED" ? new Date() : undefined } });
  redirect("/admin/messages");
}

export async function updateMediaAction(form: FormData) {
  await requireAdmin();
  const db = database();
  const id = String(form.get("id") || "");
  const alt = String(form.get("alt") || "").trim().slice(0,240);
  await db.mediaAsset.update({ where: { id }, data: { alt } });
  revalidatePath("/", "layout");
  redirect("/admin/media?saved=1");
}

export async function updatePageAction(form: FormData) {
  await requireAdmin();
  const db=database();
  const key=String(form.get("key")||"");
  if (!Object.hasOwn(pageDefaults,key)) throw new Error("Choose a valid page.");
  const copy=z.object({eyebrow:z.string().trim().max(120),title:z.string().trim().min(1).max(400),intro:z.string().trim().max(5000),body:z.string().trim().max(5000)}).parse(Object.fromEntries(['eyebrow','title','intro','body'].map(field=>[field,String(form.get(field)||'')])));
  const settings=await db.siteSettings.findUnique({where:{id:'site'},select:{pageContent:true}});
  const previous=settings?.pageContent&&typeof settings.pageContent==='object'&&!Array.isArray(settings.pageContent)?settings.pageContent:{};
  const pageContent={...previous,[key]:copy};
  await db.siteSettings.upsert({where:{id:'site'},update:{pageContent},create:{id:'site',pageContent}});
  revalidatePath(`/${key}`);
  redirect('/admin/pages?saved=1');
}
