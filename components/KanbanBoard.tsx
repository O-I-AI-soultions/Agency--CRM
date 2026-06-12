import type { LeadRecord } from "@/lib/types";
import KanbanColumn, { type ColumnAccent } from "@/components/KanbanColumn";

interface KanbanBoardColumn {
  title: string;
  leads: LeadRecord[];
  accent: ColumnAccent;
}

interface KanbanBoardProps {
  columns: KanbanBoardColumn[];
}

export default function KanbanBoard({ columns }: KanbanBoardProps) {
  return (
    <div className="kanban-scroll -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6 lg:-mx-8 lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:px-8">
      {columns.map((column) => (
        <KanbanColumn
          key={column.title}
          title={column.title}
          leads={column.leads}
          accent={column.accent}
        />
      ))}
    </div>
  );
}
