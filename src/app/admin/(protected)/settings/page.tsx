import { AdminForm } from "@/components/admin/admin-form";
import { Save } from "lucide-react";
import { AdminHeading } from "@/components/admin/admin-heading";
import { updateSettingsAction } from "@/app/admin/actions";
import { getAdminSettings } from "@/lib/admin-data";
import { AppearanceSettings } from "@/components/admin/appearance-settings";
import { ConnectionStatus } from "@/components/admin/connection-status";

export default async function AdminSettingsPage() {
  const settings = await getAdminSettings();
  return (
    <div className="mx-auto max-w-[960px] px-5 py-7 sm:px-8 sm:py-10 lg:px-12">
      <AdminHeading eyebrow="Configuration" title="Site settings" description="Identity, contact information, social links, and default metadata." />
      <div className="mt-7"><AppearanceSettings /></div>
      <AdminForm action={updateSettingsAction} className="mt-7 grid gap-6">
        <section className="rounded-[22px] border border-black/10 bg-white p-5 sm:p-7"><h2 className="font-medium tracking-[-0.035em]">Identity</h2><div className="mt-5 grid gap-5 sm:grid-cols-2"><label><span className="mb-2 block text-sm font-medium">Brand name</span><input name="brandName" className="field" defaultValue={settings.brandName} /></label><label><span className="mb-2 block text-sm font-medium">Founder name</span><input name="founderName" className="field" defaultValue={settings.founderName} /></label><label className="sm:col-span-2"><span className="mb-2 block text-sm font-medium">Site description</span><textarea name="siteDescription" className="field resize-y" rows={3} defaultValue={settings.siteDescription} /></label><label><span className="mb-2 block text-sm font-medium">Accent color</span><input name="accentColor" className="field" defaultValue={settings.accentColor} pattern="#[0-9A-Fa-f]{6}" /></label></div></section>
        <section className="rounded-[22px] border border-black/10 bg-white p-5 sm:p-7"><h2 className="font-medium tracking-[-0.035em]">Contact & social</h2><div className="mt-5 grid gap-5 sm:grid-cols-2"><label><span className="mb-2 block text-sm font-medium">Email</span><input name="email" type="email" className="field" defaultValue={settings.email} /></label><label><span className="mb-2 block text-sm font-medium">Instagram URL</span><input name="instagram" type="url" className="field" defaultValue={settings.instagram} /></label><label><span className="mb-2 block text-sm font-medium">Behance URL</span><input name="behance" type="url" className="field" defaultValue={settings.behance} /></label><label><span className="mb-2 block text-sm font-medium">LinkedIn URL</span><input name="linkedin" type="url" className="field" defaultValue={settings.linkedin} /></label></div></section>
        <section className="admin-panel"><h2 className="font-medium">More social profiles</h2><div className="mt-5 grid gap-5 sm:grid-cols-2">{([['dribbble','Dribbble'],['whatsapp','WhatsApp'],['youtube','YouTube'],['twitter','X / Twitter']] as const).map(([key,label])=><label key={key}><span className="mb-2 block text-sm font-medium">{label} URL</span><input type="url" name={key} className="field" defaultValue={settings[key]} /></label>)}</div></section>
        <section className="admin-panel"><h2 className="font-medium">Default search metadata</h2><div className="mt-5 grid gap-5"><label><span className="mb-2 block text-sm font-medium">Site title</span><input className="field" name="defaultSeoTitle" maxLength={70} required defaultValue={settings.defaultSeoTitle}/></label><label><span className="mb-2 block text-sm font-medium">Meta description</span><textarea className="field" name="defaultSeoDescription" maxLength={160} rows={3} defaultValue={settings.defaultSeoDescription}/></label></div></section>
        <div className="flex justify-end"><button className="button button-primary"><Save size={15} /> Save settings</button></div>
      </AdminForm>
      <div className="mt-6"><ConnectionStatus /></div>
    </div>
  );
}
