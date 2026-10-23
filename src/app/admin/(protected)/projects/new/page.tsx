import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AdminHeading } from "@/components/admin/admin-heading";
import { ProjectForm } from "@/components/admin/project-form";
import { createProjectAction } from "@/app/admin/actions";
import { getAdminCategories } from "@/lib/admin-data";

export default async function NewProjectPage() {
  const categories = await getAdminCategories();
  return (
    <div className="mx-auto max-w-[1120px] px-5 py-7 sm:px-8 sm:py-10 lg:px-12">
      <AdminHeading eyebrow="Projects" title="New project" description="Start as a draft, then publish when every detail is ready." actions={<Link href="/admin/projects" className="button button-secondary"><ArrowLeft size={15} /> Back</Link>} />
      <div className="mt-7"><ProjectForm categories={categories} action={createProjectAction} /></div>
    </div>
  );
}
