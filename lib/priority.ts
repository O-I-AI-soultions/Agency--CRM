import type { LeadRecord, Priority } from "@/lib/types";

export interface PriorityResult {
  score: number;
  level: Priority;
}

export function computePriority(lead: LeadRecord): PriorityResult {
  let score = 0;

  const rating = lead.googleRating ?? 0;
  if (rating >= 4.5) score += 3;
  else if (rating >= 4.0) score += 2;
  else if (rating >= 3.5) score += 1;

  if (lead.status === "New Lead" || lead.status === null) score += 3;
  else if (lead.status === "Contacted") score += 2;
  else if (lead.status === "Pitch Sent") score += 1;

  const followUps = lead.followUpCount ?? 0;
  if (followUps === 0) score += 2;
  else if (followUps === 1) score += 1;

  const daysSinceCreated = (Date.now() - new Date(lead.createdTime).getTime()) / 86_400_000;
  if (daysSinceCreated <= 7) score += 2;
  else if (daysSinceCreated <= 14) score += 1;

  const level: Priority = score >= 7 ? "High" : score >= 4 ? "Medium" : "Low";

  return { score, level };
}
