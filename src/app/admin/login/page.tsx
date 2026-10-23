import { LockKeyhole } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { loginAction } from "@/app/admin/login/actions";

type LoginPageProps = { searchParams: Promise<{ error?: string }> };

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { error } = await searchParams;
  return (
    <main className="grid min-h-screen bg-[#f6f6f4] lg:grid-cols-2">
      <div className="hidden border-r border-black/10 bg-white p-10 lg:flex lg:flex-col lg:justify-between">
        <Logo />
        <div>
          <p className="eyebrow">Private workspace</p>
          <h1 className="mt-4 max-w-lg text-6xl font-medium leading-[0.88] tracking-[-0.08em]">Control every detail of the portfolio.</h1>
        </div>
        <p className="text-sm text-black/45">SHOBAKY STUDIO / owner access only</p>
      </div>
      <div className="flex items-center justify-center px-5 py-10 sm:px-8">
        <div className="w-full max-w-md rounded-[24px] border border-black/10 bg-white p-6 sm:p-9">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-black/15"><LockKeyhole size={18} strokeWidth={1.5} /></div>
          <h2 className="mt-6 text-3xl font-medium tracking-[-0.06em]">Welcome back.</h2>
          <p className="mt-2 text-sm leading-6 text-black/55">Sign in to manage SHOBAKY STUDIO.</p>
          {error ? <p role="alert" className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{error === "rate" ? "Too many attempts. Please try again in 15 minutes." : "The email or password is not correct."}</p> : null}
          <form action={loginAction} className="mt-8 grid gap-5">
            <label><span className="mb-2 block text-sm font-medium">Email</span><input className="field" name="email" type="email" autoComplete="email" required /></label>
            <label><span className="mb-2 block text-sm font-medium">Password</span><input className="field" name="password" type="password" autoComplete="current-password" required /></label>
            <button className="button button-primary mt-1" type="submit">Sign in</button>
          </form>
          {process.env.NODE_ENV !== "production" ? <p className="mt-6 text-xs leading-5 text-black/40">Local demo credentials: admin@shobakystudio.local / studio-demo</p> : null}
        </div>
      </div>
    </main>
  );
}
