

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useApp } from "@/lib/context";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard" },
] as const;

export default function AppHeader() {
  const pathname = usePathname();
  const { scenario, setScenario, user } = useApp();

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
          <div className="flex items-center gap-1.5 rounded-sm border border-border-soft bg-paper px-2 py-1">
            <span className="label-caps">Simulasi:</span>
            <button
              onClick={() => setScenario("new")}
              className={`px-2 py-0.5 text-xs transition-colors ${
                scenario === "new"
                  ? "bg-ink text-sage font-medium"
                  : "text-muted-text hover:text-ink-soft"
              }`}
              style={{ borderRadius: "2px" }}
            >
              User Baru
            </button>
            <button
              onClick={() => setScenario("returning")}
              className={`px-2 py-0.5 text-xs transition-colors ${
                scenario === "returning"
                  ? "bg-ink text-sage font-medium"
                  : "text-muted-text hover:text-ink-soft"
              }`}
              style={{ borderRadius: "2px" }}
            >
              User Lama
            </button>
          </div>

          <span className="text-sm text-ink-soft">{user.name}</span>
        </div>
      </div>
    </header>
  );
}
