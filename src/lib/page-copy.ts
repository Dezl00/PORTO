import { hasDatabaseConnection, prisma } from "@/lib/prisma";
export const pageDefaults = {
  about: { label:"About", eyebrow:"About the studio", title:"SHOBAKY STUDIO is the independent graphic design practice of Mohamed Alshobaky.", intro:"Work starts with clarity: what needs to be said, who needs to see it, and what should stay with them after.", body:"From identity systems to campaigns and digital surfaces, each project is shaped with equal attention to the big idea and the details that make it usable." },
  services: { label:"Services", eyebrow:"Services", title:"The right system for the story you need to tell.", intro:"Engagements can be focused or end-to-end, depending on what the work needs.", body:"Not sure what kind of engagement fits? Start with the project, not the label." },
  contact: { label:"Contact", eyebrow:"Start a project", title:"Let's make something clear and memorable.", intro:"Share a little about the project, its context, and what you're trying to achieve.", body:"" },
};
export type PageKey = keyof typeof pageDefaults;
export async function getPageCopy(key: PageKey) {
  if (!hasDatabaseConnection() || !prisma) return pageDefaults[key];
  const settings = await prisma.siteSettings.findUnique({where:{id:'site'},select:{pageContent:true}});
  const pages=settings?.pageContent;
  const values=pages&&typeof pages==='object'&&!Array.isArray(pages)?pages[key]:null;
  const copy={...pageDefaults[key]};
  if(values&&typeof values==='object'&&!Array.isArray(values)) for(const field of ['eyebrow','title','intro','body'] as const) if(typeof values[field]==='string') copy[field]=values[field];
  return copy;
}
