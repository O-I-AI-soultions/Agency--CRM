import { listLeads } from "@/lib/airtable";
import { KANBAN_STATUSES, type KanbanStatus, type LeadRecord } from "@/lib/types";
import KanbanBoard from "@/components/KanbanBoard";

export const dynamic = "force-dynamic";

const COLUMN_LABELS: Record<KanbanStatus, string> = {
  "New Lead": "לידים חדשים",
  Contacted: "נוצר קשר",
  "Pitch Sent": "הצעה נשלחה",
  "Not Interested": "לא מעוניין",
};

export default async function LeadsPage() {
  const leads = await listLeads();

  const groups: Record<KanbanStatus | "Other", LeadRecord[]> = {
    "New Lead": [],
    Contacted: [],
    "Pitch Sent": [],
    "Not Interested": [],
    Other: [],
  };

  for (const lead of leads) {
    if (lead.status === null) {
      // Untriaged leads from the scraper have no Status set yet — treat as New Lead.
      groups["New Lead"].push(lead);
    } else if ((KANBAN_STATUSES as readonly string[]).includes(lead.status)) {
      groups[lead.status as KanbanStatus].push(lead);
    } else {
      groups.Other.push(lead);
    }
  }

  const columns = [
    { title: COLUMN_LABELS["New Lead"], leads: groups["New Lead"], accent: "sky" as const },
    { title: COLUMN_LABELS.Contacted, leads: groups.Contacted, accent: "amber" as const },
    { title: COLUMN_LABELS["Pitch Sent"], leads: groups["Pitch Sent"], accent: "accent" as const },
    { title: COLUMN_LABELS["Not Interested"], leads: groups["Not Interested"], accent: "warn" as const },
    { title: "אחר", leads: groups.Other, accent: "muted" as const },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">ניהול לידים</h1>
        <p className="mt-1 text-sm text-muted">
          {leads.length} לידים בצנרת — גרירה ידנית בין שלבים באמצעות הכפתורים בכל כרטיס
        </p>
      </div>
      <KanbanBoard columns={columns} />
    </div>
  );
}
