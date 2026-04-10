import type { TimeRemaining } from './types';
import { MS_PER_HOUR, MS_PER_DAY } from './constants';

// ─── Utility Functions ─────────────────────────────────────────────────────────

export function computeTimeRemaining(dueDate: Date, now: Date = new Date()): TimeRemaining {
  const diffMs   = dueDate.getTime() - now.getTime();
  const diffHours = diffMs / MS_PER_HOUR;
  const diffDays  = diffMs / MS_PER_DAY;

  if (diffMs <= 0) {
    const overdueHours = Math.abs(Math.floor(diffHours));
    const label =
      overdueHours < 1
        ? "Overdue by less than an hour"
        : overdueHours === 1
        ? "Overdue by 1 hour"
        : `Overdue by ${overdueHours} hours`;
    return { label, isOverdue: true };
  }

  if (diffHours < 1)   return { label: "Due now",      isOverdue: false };
  if (diffHours < 24)  return { label: "Due tomorrow", isOverdue: false };

  const days = Math.floor(diffDays);
  return {
    label:     days === 1 ? "Due in 1 day" : `Due in ${days} days`,
    isOverdue: false,
  };
}

export function formatDueDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
    year:  "numeric",
  });
}