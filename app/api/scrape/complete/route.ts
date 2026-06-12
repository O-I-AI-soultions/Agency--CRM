import { completeScrapeHistoryRecord, failScrapeHistoryRecord } from "@/lib/airtable";

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const historyRecordId = body?.historyRecordId;
    const leadsFound = body?.leadsFound;
    const failed = body?.failed === true;

    if (typeof historyRecordId !== "string" || !historyRecordId) {
      return Response.json({ error: "Missing historyRecordId" }, { status: 400 });
    }

    if (failed) {
      await failScrapeHistoryRecord(historyRecordId);
      return Response.json({ ok: true });
    }

    if (typeof leadsFound !== "number" || !Number.isFinite(leadsFound)) {
      return Response.json({ error: "Missing leadsFound" }, { status: 400 });
    }

    await completeScrapeHistoryRecord(historyRecordId, Math.max(0, Math.round(leadsFound)));

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Failed to update scrape history" }, { status: 500 });
  }
}
