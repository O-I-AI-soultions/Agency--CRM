"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/leads", label: "ניהול לידים" },
  { href: "/clients", label: "לקוחות משלמים" },
];

export default function NavBar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-10 border-b border-border bg-surface/80 backdrop-blur-sm">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-sm font-black text-white">
            O·I
          </span>
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-bold text-foreground">מערכת ניהול O-I</span>
            <span className="text-xs text-muted">לידים ולקוחות</span>
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-full border border-border bg-background/60 p-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={
                  "rounded-full px-3 py-1.5 text-sm font-semibold transition-colors sm:px-4 " +
                  (isActive
                    ? "bg-accent text-white shadow-sm"
                    : "text-muted hover:bg-surface hover:text-foreground")
                }
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        <button
          onClick={handleLogout}
          className="rounded-full border border-border px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:border-warn/40 hover:bg-warn-soft hover:text-warn"
          type="button"
        >
          התנתק
        </button>
      </nav>
    </header>
  );
}
