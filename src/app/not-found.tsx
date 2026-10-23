import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteHeader } from "@/components/site/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex min-h-[70svh] max-w-[1440px] flex-col justify-center px-5 sm:px-8 lg:px-12">
        <p className="eyebrow">404</p>
        <h1 className="mt-5 max-w-2xl text-5xl font-medium tracking-[-0.075em] sm:text-7xl">That page is not here.</h1>
        <p className="mt-5 max-w-md text-lg leading-7 text-black/60">The link may have changed, or the page may no longer be available.</p>
        <Link href="/" className="button button-primary mt-8 w-fit"><ArrowLeft size={16} /> Back home</Link>
      </main>
    </>
  );
}
