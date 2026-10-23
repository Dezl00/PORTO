import Link from "next/link";
import { FolderPlus } from "lucide-react";
import { AdminHeading } from "@/components/admin/admin-heading";
import { ProjectList } from "@/components/admin/project-list";
import { getAdminProjects } from "@/lib/admin-data";
export default async function AdminProjectsPage() {
 return <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 sm:py-10 lg:px-12"><AdminHeading eyebrow="Portfolio" title="Projects" description="Create, publish, curate and organise your work." actions={<Link href="/admin/projects/new" className="button button-primary"><FolderPlus size={15} /> New project</Link>} /><ProjectList projects={await getAdminProjects()} /></div>;
}
