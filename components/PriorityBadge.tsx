import { Flame, Circle, ArrowDown } from "lucide-react";
import type { LeadRecord, Priority } from "@/lib/types";
import { computePriority } from "@/lib/priority";

const PRIORITY_LABELS: Record<Priority, string> = {
  High: "גבוהה",
  Medium: "בינונית",
  Low: "נמוכה",
};

const PRIORITY_CLASSES: Record<Priority, string> = {
  High: "tag tag-warn",
  Medium: "tag tag-amber",
  Low: "tag tag-accent",
};

const PRIORITY_ICONS: Record<Priority, typeof Flame> = {
  High: Flame,
  Medium: Circle,
  Low: ArrowDown,
};

export default function PriorityBadge({ lead }: { lead: LeadRecord }) {
  const { level } = computePriority(lead);
  const Icon = PRIORITY_ICONS[level];

  return (
    <span className={`shrink-0 ${PRIORITY_CLASSES[level]}`}>
      <Icon size={12} /> {PRIORITY_LABELS[level]}
    </span>
  );
}
