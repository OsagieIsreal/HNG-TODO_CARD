// ─── Types & Interfaces ────────────────────────────────────────────────────────

export type Priority = "Low" | "Medium" | "High";
export type Status = "Pending" | "In Progress" | "Done";

export interface Todo {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  status: Status;
  dueDate: Date;
  tags: string[];
}

export interface TodoCardProps extends Todo {
  onEdit?: () => void;
  onDelete?: () => void;
  onStatusChange?: (status: Status) => void;
  dragHandleProps?: {
    attributes?: Record<string, any>;
    listeners?: Record<string, any>;
  };
}

export interface TimeRemaining {
  label: string;
  isOverdue: boolean;
}