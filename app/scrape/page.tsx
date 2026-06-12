import { listScrapeHistory } from "@/lib/airtable";
import ScrapeForm from "@/components/ScrapeForm";
import ScrapeHistory from "@/components/ScrapeHistory";

export const dynamic = "force-dynamic";

export default async function ScrapePage() {
  const runs = await listScrapeHistory();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-foreground">סריקת לידים</h1>
        <p className="mt-1 text-sm text-muted">
          הפעלת סריקה חדשה ב-Apify ומעקב אחר היסטוריית הסריקות
        </p>
      </div>

      <ScrapeForm />

      <div>
        <h2 className="mb-3 text-lg font-bold text-foreground">היסטוריית סריקות</h2>
        <ScrapeHistory runs={runs} />
      </div>
    </div>
  );
}
