import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { notFound } from "next/navigation";
import { AdminHeading } from "@/components/admin/admin-heading";
import { ProjectBlocksManager } from "@/components/admin/project-blocks-manager";
import { ProjectForm } from "@/components/admin/project-form";
import { addProjectBlockAction, moveProjectBlockAction, removeProjectBlockAction, updateProjectAction, updateProjectBlockAction } from "@/app/admin/actions";
import { getAdminCategories, getAdminProjectBlocks, getAdminProjects } from "@/lib/admin-data";

type PageProps = { params: Promise<{ id: string }>; searchParams: Promise<{ saved?: string }> };

export default async function EditProjectPage({ params, searchParams }: PageProps) {
  const [{ id }, query, projects, categories] = await Promise.all([params, searchParams, getAdminProjects(), getAdminCategories()]);
  const project = projects.find((item) => item.id === id);
  if (!project) notFound();
  const [blocks] = await Promise.all([getAdminProjectBlocks(project.id)]);
  const action = updateProjectAction.bind(null, project.id);
  const addBlockAction = addProjectBlockAction.bind(null, project.id);
  const moveBlockAction = moveProjectBlockAction.bind(null, project.id);
  const removeBlockAction = removeProjectBlockAction.bind(null, project.id);
  return (
    <div className="mx-auto max-w-[1120px] px-5 py-7 sm:px-8 sm:py-10 lg:px-12">
      <AdminHeading eyebrow="Projects" title={project.title} description={`/${project.slug}`} actions={<><a href={`/projects/${project.slug}`} target="_blank" rel="noreferrer" className="button button-secondary"><ExternalLink size={15} /> View</a><Link href="/admin/projects" className="button button-secondary"><ArrowLeft size={15} /> Back</Link></>} />
      {query.saved ? <p className="mt-6 rounded-[16px] border border-black/10 bg-white px-4 py-3 text-sm text-black/60">Project saved and public pages refreshed.</p> : null}
      <div className="mt-7 grid gap-6"><ProjectForm project={project} categories={categories} action={action} /><ProjectBlocksManager blocks={blocks} addAction={addBlockAction} moveAction={moveBlockAction} removeAction={removeBlockAction} editAction={updateProjectBlockAction.bind(null,project.id)} /></div>
    </div>
  );
}
