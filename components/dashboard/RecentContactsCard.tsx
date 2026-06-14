import type { LeadRecord } from "@/lib/types";

function relativeTime(iso: string): string {
  const date = new Date(iso);
  const today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
  const day = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.floor((today.getTime() - day.getTime()) / 86_400_000);

  if (diffDays <= 0) return "היום";
  if (diffDays === 1) return "לפני יום";
  return `לפני ${diffDays} ימים`;
}

interface RecentContactsCardProps {
  leads: LeadRecord[];
}

export default function RecentContactsCard({ leads }: RecentContactsCardProps) {
  const recent = [...leads]
    .sort((a, b) => {
      const aTime = new Date(a.lastContacted ?? a.createdTime).getTime();
      const bTime = new Date(b.lastContacted ?? b.createdTime).getTime();
      return bTime - aTime;
    })
    .slice(0, 3);

  return (
    <div
      className="panel animate-fade-up p-5"
      style={{ animationDelay: "0.2s" }}
    >
      <h2 className="text-[13px] font-semibold text-muted">אנשי קשר אחרונים</h2>

      <div className="mt-3 space-y-3">
        {recent.length === 0 && <p className="text-xs text-muted-2">אין עדיין לידים</p>}

        {recent.map((lead) => (
          <div key={lead.id} className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-2 font-mono text-xs font-semibold text-foreground">
              {lead.businessName.charAt(0)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{lead.businessName}</p>
              <p className="truncate text-xs text-muted-2">{lead.city ?? lead.niche ?? "—"}</p>
            </div>
            <span className="shrink-0 font-mono text-[11px] text-muted">
              {relativeTime(lead.lastContacted ?? lead.createdTime)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
