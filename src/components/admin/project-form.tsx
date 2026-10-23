"use client";

import { AdminForm } from "@/components/admin/admin-form";
import { useState } from "react";
import { Save } from "lucide-react";
import { CloudinaryUploader } from "@/components/admin/cloudinary-uploader";
import type { AdminCategoryRow, AdminProjectRow } from "@/lib/admin-data";
import { slugify } from "@/lib/utils";

type ProjectFormProps = {
  project?: AdminProjectRow;
  categories: AdminCategoryRow[];
  action: (formData: FormData) => void | Promise<void>;
};

export function ProjectForm({ project, categories, action }: ProjectFormProps) {
  const [title, setTitle] = useState(project?.title || "");
  const [slug, setSlug] = useState(project?.slug || "");
  const [slugEdited, setSlugEdited] = useState(Boolean(project));
  const [cover, setCover] = useState<{ id: string; secureUrl: string } | null>(project?.coverAssetId ? { id: project.coverAssetId, secureUrl: project.coverUrl || "" } : null);

  function changeTitle(value: string) {
    setTitle(value);
    if (!slugEdited) setSlug(slugify(value));
  }

  return (
    <AdminForm action={action} className="grid gap-6">
      <section className="rounded-[22px] border border-black/10 bg-white p-5 sm:p-7">
        <div className="grid gap-5 lg:grid-cols-2">
          <label className="lg:col-span-2"><span className="mb-2 block text-sm font-medium">Project title *</span><input name="title" className="field" value={title} onChange={(event) => changeTitle(event.target.value)} required /></label>
          <label><span className="mb-2 block text-sm font-medium">Slug *</span><input name="slug" className="field font-mono text-sm" value={slug} onChange={(event) => { setSlug(slugify(event.target.value)); setSlugEdited(true); }} required pattern="[a-z0-9]+(-[a-z0-9]+)*" /><span className="mt-2 block text-xs text-black/40">/projects/{slug || "your-project"}</span></label>
          <label><span className="mb-2 block text-sm font-medium">Category</span><select name="categoryId" defaultValue={project?.categoryId || ""} className="field"><option value="">Uncategorised</option>{categories.map((category) => <option value={category.id} key={category.id}>{category.name}</option>)}</select></label>
          <label className="lg:col-span-2"><span className="mb-2 block text-sm font-medium">Short introduction</span><textarea name="excerpt" className="field resize-y" rows={3} defaultValue={project?.excerpt || ""} maxLength={280} /></label>
          <label className="lg:col-span-2"><span className="mb-2 block text-sm font-medium">Project story</span><textarea name="description" className="field resize-y" rows={8} defaultValue={project?.description || ""} /></label>
          <label><span className="mb-2 block text-sm font-medium">Client</span><input name="client" className="field" defaultValue={project?.client || ""} /></label>
          <label><span className="mb-2 block text-sm font-medium">Year</span><input name="year" type="number" min="1900" max="2100" className="field" defaultValue={project?.year || ""} /></label>
          <label><span className="mb-2 block text-sm font-medium">Services</span><input name="services" className="field" defaultValue={project?.services.join(", ") || ""} placeholder="Brand Identity, Art Direction" /></label>
          <label><span className="mb-2 block text-sm font-medium">Tags</span><input name="tags" className="field" defaultValue={project?.tags.join(", ") || ""} placeholder="Identity, Packaging" /></label>
          <label><span className="mb-2 block text-sm font-medium">External project URL</span><input name="externalLink" type="url" className="field" defaultValue={project?.externalLink || ""} placeholder="https://" /></label>
          <label><span className="mb-2 block text-sm font-medium">Display order</span><input name="sortOrder" type="number" min="0" max="100000" className="field" defaultValue={project?.sortOrder || 0} /><span className="mt-2 block text-xs text-black/45">Lower numbers appear first in Selected Work and the main portfolio.</span></label>
        </div>
      </section>
      <section className="rounded-[22px] border border-black/10 bg-white p-5 sm:p-7">
        <div className="flex items-start justify-between gap-5"><div><h2 className="font-medium tracking-[-0.035em]">Project cover</h2><p className="mt-1 text-sm text-black/50">This image is used across project cards and social previews.</p></div></div>
        <div className="mt-5"><CloudinaryUploader value={cover?.id} url={cover?.secureUrl} onChange={(asset) => setCover(asset ? { id: asset.id, secureUrl: asset.secureUrl } : null)} /></div>
        <input name="coverAssetId" type="hidden" value={cover?.id || ""} readOnly />
      </section>
      <section className="rounded-[22px] border border-black/10 bg-white p-5 sm:p-7">
        <div className="grid gap-5 lg:grid-cols-2">
          <label><span className="mb-2 block text-sm font-medium">Publishing status</span><select name="status" className="field" defaultValue={project?.status || "DRAFT"}><option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option><option value="ARCHIVED">Archived</option></select></label>
          <label className="mt-8 flex cursor-pointer items-center gap-3 text-sm"><input type="checkbox" name="isFeatured" defaultChecked={project?.isFeatured} className="h-4 w-4 accent-black" /> Feature in Selected Work</label>
          <label><span className="mb-2 block text-sm font-medium">SEO title</span><input name="seoTitle" className="field" maxLength={70} defaultValue={project?.seoTitle || ""} /></label>
          <label><span className="mb-2 block text-sm font-medium">SEO description</span><input name="seoDescription" className="field" maxLength={160} defaultValue={project?.seoDescription || ""} /></label>
        </div>
      </section>
      <div className="flex justify-end"><button type="submit" className="button button-primary"><Save size={15} /> {project ? "Save changes" : "Create project"}</button></div>
    </AdminForm>
  );
}
