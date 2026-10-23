import { AdminForm } from "@/components/admin/admin-form";
import { ArrowDown, ArrowUp } from "lucide-react";
import { AdminHeading } from "@/components/admin/admin-heading";
import { moveSectionAction, updateSectionAction } from "@/app/admin/actions";
import { getAdminSections } from "@/lib/admin-data";
import { getSectionTone } from "@/lib/home-sections";
import Link from "next/link";
import { HeroImageSettings } from "@/components/admin/hero-image-settings";

function stringContent(content: Record<string, unknown> | null, key: string) {
  const value = content?.[key];
  return typeof value === "string" ? value : "";
}

export default async function AdminHomePage() {
  const sections = (await getAdminSections()).filter((section) => section.key !== "categories");
  return (
    <div className="mx-auto max-w-[1120px] px-5 py-7 sm:px-8 sm:py-10 lg:px-12">
      <AdminHeading eyebrow="Homepage" title="Sections" description="Show, hide, edit, reorder, and choose a background for each homepage section." />
      <div className="mt-7 grid gap-4">
        {sections.map((section, index) => (
          <article key={section.id} className="rounded-[22px] border border-black/10 bg-white p-5 sm:p-6">
            <div className="flex gap-4"><div className="flex flex-col gap-1"><AdminForm action={moveSectionAction}><input type="hidden" name="id" value={section.id} /><input type="hidden" name="direction" value="up" /><button disabled={index === 0} className="rounded border border-black/10 p-1 disabled:opacity-25"><ArrowUp size={14} /></button></AdminForm><AdminForm action={moveSectionAction}><input type="hidden" name="id" value={section.id} /><input type="hidden" name="direction" value="down" /><button disabled={index === sections.length - 1} className="rounded border border-black/10 p-1 disabled:opacity-25"><ArrowDown size={14} /></button></AdminForm></div>
              <AdminForm action={updateSectionAction} className="min-w-0 flex-1"><input type="hidden" name="id" value={section.id} /><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="eyebrow">{section.key === "latest-projects" ? "Latest published work" : section.type.replaceAll("_", " ")}</p><h2 className="mt-1 text-xl font-medium tracking-[-0.045em]">{section.label}</h2></div><label className="flex shrink-0 items-center gap-2 text-sm"><input type="checkbox" name="isVisible" defaultChecked={section.isVisible} className="h-4 w-4 accent-black" /> Visible</label></div>
                {section.key === "featured-work" ? <p className="mt-4 rounded-xl border border-black/10 bg-[#f7f7f5] px-4 py-3 text-sm leading-6 text-black/60">Only published projects with <strong className="font-medium text-black">Feature in Selected Work</strong> enabled appear here, with three cards per row on desktop. <Link href="/admin/projects" className="font-medium text-black underline underline-offset-4">Choose projects</Link></p> : null}
                {section.key === "latest-projects" ? <p className="mt-4 rounded-xl border border-black/10 bg-[#f7f7f5] px-4 py-3 text-sm leading-6 text-black/60">Shows the six newest published projects by publication date, independently of the Selected Work selection.</p> : null}
                <div className="mt-5 grid gap-4 md:grid-cols-3"><label><span className="mb-1.5 block text-xs text-black/50">Admin label</span><input className="field" name="label" defaultValue={section.label} /></label><label><span className="mb-1.5 block text-xs text-black/50">Eyebrow</span><input className="field" name="eyebrow" defaultValue={stringContent(section.content, "eyebrow")} /></label><label><span className="mb-1.5 block text-xs text-black/50">Title</span><input className="field" name="title" defaultValue={stringContent(section.content, "title")} /></label></div>
                <label className="mt-4 block"><span className="mb-1.5 block text-xs text-black/50">Body</span><textarea className="field resize-y" name="body" rows={2} defaultValue={stringContent(section.content, "body")} /></label>
                {section.key === "hero" ? <HeroImageSettings content={section.content} /> : null}
                <label className="mt-4 block max-w-xs"><span className="mb-1.5 block text-xs text-black/50">Section background</span><select name="background" className="field" defaultValue={getSectionTone(section.key, section.content)}><option value="light">White</option>{section.key !== "hero" ? <option value="soft">Light gray</option> : null}<option value="dark">Black</option></select></label>
                <div className="mt-4 flex justify-end"><button className="button button-secondary text-xs">Save section</button></div>
              </AdminForm>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
