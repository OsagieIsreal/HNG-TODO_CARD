// ─── Constants ─────────────────────────────────────────────────────────────────

export const PRIORITY_CONFIG: Record<import('./types').Priority, { label: string; color: string }> = {
  Low:    { label: "Low",    color: "#4caf87" },
  Medium: { label: "Medium", color: "#e6a817" },
  High:   { label: "High",   color: "#e05c5c" },
};

export const STATUS_CONFIG: Record<import('./types').Status, { label: string; color: string }> = {
  Pending:     { label: "Pending",     color: "#9b8ea8" },
  "In Progress": { label: "In Progress", color: "#4a9edd" },
  Done:        { label: "Done",        color: "#4caf87" },
};

export const MS_PER_HOUR = 1000 * 60 * 60;
export const MS_PER_DAY  = MS_PER_HOUR * 24;