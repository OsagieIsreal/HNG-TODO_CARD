// ─── Constants ─────────────────────────────────────────────────────────────────

export const PRIORITY_CONFIG: Record<import('./types').Priority, { label: string; color: string; bgColor: string }> = {
  High:   { label: "High",   color: "#e53e3e", bgColor: "#fed7d7" },
  Medium: { label: "Medium", color: "#d69e2e", bgColor: "#fefcbf" },
  Low:    { label: "Low",    color: "#38a169", bgColor: "#c6f6d5" },
};

export const STATUS_CONFIG: Record<import('./types').Status, { label: string; color: string; bgColor: string }> = {
  Pending:     { label: "Pending",     color: "#718096", bgColor: "#f7fafc" },
  "In Progress": { label: "In Progress", color: "#3182ce", bgColor: "#ebf8ff" },
  Done:        { label: "Done",        color: "#38a169", bgColor: "#f0fff4" },
};

export const MS_PER_HOUR = 1000 * 60 * 60;
export const MS_PER_DAY  = MS_PER_HOUR * 24;