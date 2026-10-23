import Link from "next/link";
import { ArrowRight, FolderPlus, Mail } from "lucide-react";
import { AdminHeading } from "@/components/admin/admin-heading";
import { getAdminDashboard } from "@/lib/admin-data";

export default async function AdminDashboardPage() {
  const dashboard = await getAdminDashboard();
  const metrics = [
    ["Total projects", dashboard.projects],
    ["Published", dashboard.published],
    ["Categories", dashboard.categories],
    ["New messages", dashboard.newMessages],
  ];
  return (
    <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 sm:py-10 lg:px-12">
      <AdminHeading eyebrow="SHOBAKY STUDIO" title="Good to see you." description="A clear view of the portfolio and incoming enquiries." actions={<><Link href="/admin/projects/new" className="button button-primary"><FolderPlus size={15} /> New project</Link><Link href="/admin/messages" className="button button-secondary"><Mail size={15} /> Messages</Link></>} />
      <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value]) => <div key={String(label)} className="rounded-[18px] border border-black/10 bg-white p-5"><p className="text-sm text-black/50">{label}</p><p className="mt-4 text-4xl font-medium tracking-[-0.07em]">{value}</p></div>)}
      </div>
      <section className="mt-8 rounded-[22px] border border-black/10 bg-white">
        <div className="flex items-center justify-between border-b border-black/10 p-5"><h2 className="font-medium tracking-[-0.035em]">Recent projects</h2><Link href="/admin/projects" className="inline-flex items-center gap-1 text-sm underline underline-offset-4">All projects <ArrowRight size={14} /></Link></div>
        <div className="divide-y divide-black/10">
          {dashboard.recentProjects.map((project) => <Link key={project.id} href={`/admin/projects/${project.id}`} className="flex items-center justify-between gap-4 p-5 hover:bg-[#f8f8f6]"><div><p className="font-medium tracking-[-0.025em]">{project.title}</p><p className="mt-1 text-xs text-black/45">/{project.slug} · {project.categoryName}</p></div><span className={`rounded-full border px-2.5 py-1 text-[0.68rem] ${project.status === "PUBLISHED" ? "border-black/15 text-black/60" : "border-amber-200 text-amber-700"}`}>{project.status.toLowerCase()}</span></Link>)}
        </div>
      </section>
    </div>
  );
}
