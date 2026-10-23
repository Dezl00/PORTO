import { AdminHeading } from "@/components/admin/admin-heading";
import { MediaLibrary } from "@/components/admin/media-library";
import { getAdminMedia } from "@/lib/admin-data";
export default async function MediaPage() { return <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-8 sm:py-10 lg:px-12"><AdminHeading eyebrow="Assets" title="Media library" description="Upload once. Reuse across the portfolio. Manage accessible image descriptions." /><MediaLibrary assets={await getAdminMedia()} /></div>; }
