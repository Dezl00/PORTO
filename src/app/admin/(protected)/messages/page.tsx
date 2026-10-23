import { AdminHeading } from "@/components/admin/admin-heading";
import { MessageInbox } from "@/components/admin/message-inbox";
import { getAdminMessages } from "@/lib/admin-data";
export default async function AdminMessagesPage() { return <div className="mx-auto max-w-[1300px] px-5 py-7 sm:px-8 sm:py-10 lg:px-12"><AdminHeading eyebrow="Inbox" title="Messages" description="Read enquiries, reply using your email app, and keep their status organised." /><MessageInbox messages={await getAdminMessages()} /></div>; }
