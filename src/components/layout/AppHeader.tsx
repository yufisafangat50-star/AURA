

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/lib/context";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
] as const;

export default function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useApp();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="border-b-2 border-ink bg-paper-card">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 pt-4">

        <Link href="/dashboard" className="flex items-center gap-2 pb-4">
          <span className="font-serif text-xl font-bold text-ink">Aura</span>
          <span className="label-caps mt-0.5">ResearchPilot</span>
        </Link>

        <nav className="flex items-center gap-0 self-end">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  relative -mb-[2px] border-2 border-b-0 px-6 py-2.5 text-sm font-medium
                  transition-colors
                  ${
                    isActive
                      ? "border-ink bg-paper text-ink"
                      : "border-transparent bg-transparent text-muted-text hover:text-ink-soft"
                  }
                `}
                style={{ borderRadius: "4px 4px 0 0" }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 pb-4">
          <button 
            onClick={handleLogout}
            title="Keluar / Logout"
            className="flex items-center gap-2 rounded-full border-2 border-border-soft bg-paper-card-alt px-3 py-1.5 shadow-sm transition-colors hover:border-ink hover:bg-ink hover:text-paper group"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-sage/20 text-sage group-hover:bg-paper/20 group-hover:text-paper transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </div>
            <span className="text-sm font-medium text-ink pr-1 group-hover:text-paper transition-colors">
              {user ? user.name : "..."}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
