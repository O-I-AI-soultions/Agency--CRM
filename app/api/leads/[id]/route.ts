import { revalidatePath } from "next/cache";
import { updateLeadStatus } from "@/lib/airtable";
import { KANBAN_STATUSES, type KanbanStatus } from "@/lib/types";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const body = await request.json();
    const status = body?.status;

    if (
      typeof status !== "string" ||
      !(KANBAN_STATUSES as readonly string[]).includes(status)
    ) {
      return Response.json({ error: "Invalid status" }, { status: 400 });
    }

    await updateLeadStatus(id, status as KanbanStatus);
    revalidatePath("/leads");

    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Failed to update lead status" }, { status: 500 });
  }
}
