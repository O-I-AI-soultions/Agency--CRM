type NormalizedStatus = "RUNNING" | "SUCCEEDED" | "FAILED" | "TIMED-OUT";

function normalizeStatus(apifyStatus: string): NormalizedStatus {
  switch (apifyStatus) {
    case "SUCCEEDED":
      return "SUCCEEDED";
    case "FAILED":
    case "ABORTED":
      return "FAILED";
    case "TIMED-OUT":
      return "TIMED-OUT";
    case "READY":
    case "RUNNING":
    default:
      return "RUNNING";
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const runId = searchParams.get("runId");

    if (!runId) {
      return Response.json({ error: "Missing runId" }, { status: 400 });
    }

    const apifyToken = process.env.APIFY_API_TOKEN;
    if (!apifyToken) {
      return Response.json({ error: "Missing APIFY_API_TOKEN" }, { status: 500 });
    }

    const response = await fetch(`https://api.apify.com/v2/actor-runs/${runId}`, {
      headers: {
        Authorization: `Bearer ${apifyToken}`,
      },
    });

    if (!response.ok) {
      return Response.json({ error: "Failed to fetch run status" }, { status: 502 });
    }

    const { data } = await response.json();
    const status = normalizeStatus(data?.status as string);

    return Response.json({ status });
  } catch {
    return Response.json({ error: "Failed to fetch run status" }, { status: 500 });
  }
}
