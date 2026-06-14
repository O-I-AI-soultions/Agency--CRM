import Link from "next/link";
import { Search, Bell, ChevronDown, Plus } from "lucide-react";
import type { Partner } from "@/lib/auth";

interface TopHeaderProps {
  title: string;
  subtitle: string;
  partner: Partner;
}

export default function TopHeader({ title, subtitle, partner }: TopHeaderProps) {
  return (
    <header className="panel flex flex-wrap items-center gap-4 px-4 py-3 sm:h-16 sm:flex-nowrap sm:px-7 sm:py-0">
      <div className="min-w-0 flex-1 sm:flex-initial">
        <h1 className="truncate font-display text-xl font-semibold text-foreground">{title}</h1>
        <p className="truncate text-[13px] text-muted">{subtitle}</p>
      </div>

      <div className="order-last w-full sm:order-none sm:flex sm:flex-1 sm:justify-center">
        <div className="flex w-full items-center gap-2 rounded-lg border border-border bg-background px-3.5 py-2 transition-colors focus-within:border-accent sm:max-w-[340px]">
          <Search size={16} className="text-muted-2 shrink-0" />
          <input
            type="text"
            placeholder="חיפוש..."
            aria-label="חיפוש"
            suppressHydrationWarning
            className="w-full bg-transparent text-base text-foreground placeholder:text-muted-2 focus:outline-none"
          />
        </div>
      </div>

      <button
        type="button"
        aria-label="התראות"
        className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-2 hover:text-accent focus:outline-none focus:ring-2 focus:ring-accent/40"
      >
        <Bell size={20} />
        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-warn ring-2 ring-surface" />
      </button>

      <div className="flex items-center gap-2.5">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-surface-2 font-mono text-xs font-semibold text-accent">
          {partner.charAt(0)}
        </span>
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-foreground">{partner}</p>
          <p className="text-xs text-muted-2">O-I</p>
        </div>
        <ChevronDown size={14} className="hidden text-muted-2 sm:block" />
      </div>

      <Link href="/leads?tab=scrape" className="btn-primary shrink-0">
        <Plus size={16} />
        חדש
      </Link>
    </header>
  );
}
