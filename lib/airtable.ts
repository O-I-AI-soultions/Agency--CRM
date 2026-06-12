import "server-only";
import Airtable from "airtable";
import type {
  ClientRecord,
  ClientStatus,
  KanbanStatus,
  LeadRecord,
  ScrapeHistoryRecord,
  ScrapeRunStatus,
} from "@/lib/types";

const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;

if (!apiKey || !baseId) {
  throw new Error("Missing AIRTABLE_API_KEY or AIRTABLE_BASE_ID env vars");
}

const base = new Airtable({ apiKey }).base(baseId);

export const LEAD_TRACKER_TABLE = "Lead Tracker";
export const CLIENTS_TABLE = "Clients";
export const SCRAPE_HISTORY_TABLE = "Scrape History";

function mapLeadRecord(record: Airtable.Record<Airtable.FieldSet>): LeadRecord {
  const fields = record.fields;

  const assignedTo = fields["Assigned To"] as
    | { id: string; name: string; email: string }
    | undefined;

  return {
    id: record.id,
    businessName: (fields["Business Name"] as string) ?? "",
    phoneNumber: (fields["Phone Number"] as string) ?? null,
    city: (fields["City"] as string) ?? null,
    googleRating: (fields["Google Rating"] as number) ?? null,
    websiteUrl: (fields["Website URL"] as string) ?? null,
    googleMapsLink: (fields["Google Maps Link"] as string) ?? null,
    status: (fields["Status"] as LeadRecord["status"]) ?? null,
    notes: (fields["Notes"] as string) ?? null,
    lastContacted: (fields["Last Contacted"] as string) ?? null,
    nextAction: (fields["Next Action"] as string) ?? null,
    leadSource: (fields["Lead Source"] as string) ?? null,
    priority: (fields["Priority"] as LeadRecord["priority"]) ?? null,
    assignedTo: assignedTo?.name ?? null,
    followUpCount: (fields["Follow-up Count"] as number) ?? null,
    createdTime: record._rawJson.createdTime,
    email: (fields["Email"] as string) ?? null,
    address: (fields["Address"] as string) ?? null,
    niche: (fields["Niche"] as string) ?? null,
  };
}

function mapClientRecord(record: Airtable.Record<Airtable.FieldSet>): ClientRecord {
  const fields = record.fields;

  return {
    id: record.id,
    clientName: (fields["Client Name"] as string) ?? "",
    setupFee: (fields["Setup Fee"] as number) ?? null,
    monthlyRetainer: (fields["Monthly Retainer"] as number) ?? null,
    status: (fields["Status"] as ClientStatus) ?? null,
  };
}

export async function listLeads(): Promise<LeadRecord[]> {
  const records = await base(LEAD_TRACKER_TABLE).select().all();
  return records.map(mapLeadRecord);
}

export async function updateLeadStatus(
  recordId: string,
  status: KanbanStatus
): Promise<void> {
  if (status === "Contacted") {
    const record = await base(LEAD_TRACKER_TABLE).find(recordId);
    const currentCount = (record.fields["Follow-up Count"] as number) ?? 0;

    await base(LEAD_TRACKER_TABLE).update(recordId, {
      Status: status,
      "Last Contacted": new Date().toISOString(),
      "Follow-up Count": currentCount + 1,
    });
    return;
  }

  await base(LEAD_TRACKER_TABLE).update(recordId, {
    Status: status,
  });
}

export async function updateLeadFields(
  recordId: string,
  fields: Record<string, unknown>
): Promise<void> {
  await base(LEAD_TRACKER_TABLE).update(recordId, fields as Partial<Airtable.FieldSet>);
}

export async function listClients(): Promise<ClientRecord[]> {
  const records = await base(CLIENTS_TABLE).select().all();
  return records.map(mapClientRecord);
}

export async function updateClientStatus(
  recordId: string,
  status: ClientStatus
): Promise<void> {
  await base(CLIENTS_TABLE).update(recordId, {
    Status: status,
  });
}

function mapScrapeHistoryRecord(
  record: Airtable.Record<Airtable.FieldSet>
): ScrapeHistoryRecord {
  const fields = record.fields;

  return {
    id: record.id,
    runId: (fields["Run ID"] as string) ?? "",
    date: (fields["Date"] as string) ?? record._rawJson.createdTime,
    city: (fields["City"] as string) ?? "",
    niche: (fields["Niche"] as string) ?? "",
    limit: (fields["Limit"] as number) ?? 0,
    status: (fields["Status"] as ScrapeRunStatus) ?? null,
    leadsFound: (fields["Leads Found"] as number) ?? 0,
    triggeredBy: (fields["Triggered By"] as string) ?? "",
  };
}

export async function listScrapeHistory(): Promise<ScrapeHistoryRecord[]> {
  const records = await base(SCRAPE_HISTORY_TABLE)
    .select({ sort: [{ field: "Date", direction: "desc" }] })
    .all();
  return records.map(mapScrapeHistoryRecord);
}

export async function createScrapeHistoryRecord(data: {
  runId: string;
  city: string;
  niche: string;
  limit: number;
  triggeredBy: string;
}): Promise<string> {
  const record = await base(SCRAPE_HISTORY_TABLE).create({
    "Run ID": data.runId,
    Date: new Date().toISOString(),
    City: data.city,
    Niche: data.niche,
    Limit: data.limit,
    Status: "Running",
    "Leads Found": 0,
    "Triggered By": data.triggeredBy,
  });
  return record.id;
}

export async function completeScrapeHistoryRecord(
  recordId: string,
  leadsFound: number
): Promise<void> {
  await base(SCRAPE_HISTORY_TABLE).update(recordId, {
    Status: "Completed",
    "Leads Found": leadsFound,
  });
}

export async function failScrapeHistoryRecord(recordId: string): Promise<void> {
  await base(SCRAPE_HISTORY_TABLE).update(recordId, {
    Status: "Failed",
  });
}

export async function countLeadTrackerRecords(): Promise<number> {
  const records = await base(LEAD_TRACKER_TABLE)
    .select({ fields: [] })
    .all();
  return records.length;
}

export async function convertLeadToClient(
  leadId: string,
  details: { businessName: string; setupFee: number; monthlyRetainer: number }
): Promise<void> {
  await base(CLIENTS_TABLE).create({
    "Client Name": details.businessName,
    "Setup Fee": details.setupFee,
    "Monthly Retainer": details.monthlyRetainer,
    Status: "Active",
  });

  await base(LEAD_TRACKER_TABLE).update(leadId, {
    Status: "Converted",
  });
}
