"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ClipboardList, CheckSquare, Users, Menu, ChevronDown, Settings } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import type { Partner } from "@/lib/auth";

const NAV_ITEMS = [
  { href: "/", icon: LayoutDashboard, label: "דשבורד" },
  { href: "/leads", icon: ClipboardList, label: "לידים" },
  { href: "/tasks", icon: CheckSquare, label: "משימות" },
  { href: "/clients", icon: Users, label: "לקוחות" },
  { href: "/settings", icon: Settings, label: "הגדרות" },
];

interface SidebarProps {
  partner: Partner;
}

export default function Sidebar({ partner }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="פתח תפריט"
        className="panel fixed top-4 left-4 z-30 flex h-11 w-11 items-center justify-center text-foreground focus:outline-none focus:ring-2 focus:ring-accent/40 md:hidden"
      >
        <Menu size={20} />
      </button>

      {isOpen && (
        <div
          aria-hidden
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/30 md:hidden"
        />
      )}

      <aside
        className={
          "fixed inset-y-0 left-0 z-50 flex w-60 flex-col bg-sidebar-bg shadow-[4px_0_24px_rgba(0,0,0,0.15)] transition-transform duration-200 md:translate-x-0 " +
          (isOpen ? "translate-x-0" : "-translate-x-full")
        }
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-accent font-mono text-xs font-bold text-accent-foreground">
            O·I
          </span>
          <span className="font-mono text-[15px] font-semibold tracking-wide text-white">O·I CRM</span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {NAV_ITEMS.map((item, index) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                aria-current={active ? "page" : undefined}
                className={
                  "group flex h-12 animate-fade-up items-center gap-3 rounded-[10px] px-4 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-accent/60 " +
                  (active
                    ? "border-l-[3px] border-accent bg-accent-soft text-white"
                    : "text-white/55 hover:bg-sidebar-active hover:text-white")
                }
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <item.icon
                  size={20}
                  className={active ? "text-white" : "text-white/55 group-hover:text-accent"}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-2.5 rounded-[10px] px-3 py-2.5">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent font-mono text-xs font-semibold text-accent-foreground">
              {partner.charAt(0)}
            </span>
            <span className="flex-1 text-xs font-medium text-white/70">{partner}</span>
            <ChevronDown size={14} className="text-white/40" />
          </div>
          <div className="mt-1 flex items-center gap-1">
            <button
              type="button"
              onClick={handleLogout}
              className="flex-1 rounded-[10px] px-3 py-2 text-right text-sm font-medium text-white/55 transition-colors hover:bg-white/5 hover:text-warn focus:outline-none focus:ring-2 focus:ring-accent/60"
            >
              התנתק
            </button>
            <ThemeToggle className="shrink-0" />
          </div>
        </div>
      </aside>
    </>
  );
}
