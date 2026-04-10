// ─── Types & Interfaces ────────────────────────────────────────────────────────

export type Priority = "Low" | "Medium" | "High";
export type Status = "Pending" | "In Progress" | "Done";

export interface TodoCardProps {
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate: Date;
  tags: string[];
  onEdit?: () => void;
  onDelete?: () => void;
  onStatusChange?: (status: Status) => void;
}

export interface TimeRemaining {
  label: string;
  isOverdue: boolean;
}