import { countLeadTrackerRecords } from "@/lib/airtable";

export async function GET() {
  try {
    const count = await countLeadTrackerRecords();
    return Response.json({ count });
  } catch {
    return Response.json({ error: "Failed to count leads" }, { status: 500 });
  }
}
