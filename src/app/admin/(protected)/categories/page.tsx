import { Plus } from "lucide-react";
import { AdminHeading } from "@/components/admin/admin-heading";
import { AdminForm } from "@/components/admin/admin-form";
import { CategoryEditor } from "@/components/admin/category-editor";
import { createCategoryAction } from "@/app/admin/actions";
import { getAdminCategories } from "@/lib/admin-data";
export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();
  return <div className="mx-auto max-w-[1300px] px-5 py-7 sm:px-8 sm:py-10 lg:px-12"><AdminHeading eyebrow="Taxonomy" title="Categories" description="Manage category covers, descriptions, visibility, order and search metadata." /><section className="admin-panel mt-7"><h2 className="font-medium">Add a category</h2><AdminForm action={createCategoryAction} className="mt-5 grid gap-4 sm:grid-cols-2"><label><span className="mb-2 block text-xs text-black/55">Name</span><input className="field" name="name" required maxLength={120} /></label><label><span className="mb-2 block text-xs text-black/55">Slug (optional)</span><input className="field" name="slug" placeholder="Generated from name" /></label><label className="sm:col-span-2"><span className="mb-2 block text-xs text-black/55">Description</span><input className="field" name="description" maxLength={2000} /></label><button className="button button-primary w-fit"><Plus size={15} /> Add category</button></AdminForm></section><div className="mt-5 grid gap-4">{categories.map(category=><CategoryEditor key={category.id} category={category} />)}</div></div>;
}
