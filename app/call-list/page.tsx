import { listLeads } from "@/lib/airtable";
import { computePriority } from "@/lib/priority";
import CallListTable from "@/components/CallListTable";

export const dynamic = "force-dynamic";

function isToday(dateString: string): boolean {
  const date = new Date(dateString);
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export default async function CallListPage() {
  const leads = await listLeads();

  const callList = leads
    .filter(
      (lead) =>
        (lead.status === "New Lead" || lead.status === "Contacted" || lead.status === null) &&
        !(lead.lastContacted && isToday(lead.lastContacted))
    )
    .map((lead) => ({ lead, ...computePriority(lead) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">רשימת שיחות להיום</h1>
        <p className="mt-1 text-sm text-muted">
          הלידים הדחופים ביותר ליצירת קשר היום, מסודרים לפי עדיפות
        </p>
      </div>
      {callList.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-surface/60 px-6 py-12 text-center">
          <p className="text-sm text-muted">כל הכבוד! אין לידים דחופים להיום 🎉</p>
        </div>
      ) : (
        <CallListTable items={callList} />
      )}
    </div>
  );
}
