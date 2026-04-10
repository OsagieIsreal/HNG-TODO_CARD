import React from "react";
import type { Priority } from '../types';
import { PRIORITY_CONFIG } from '../constants';

const PriorityBadge: React.FC<{ priority: Priority }> = ({ priority }) => {
  const { label, color } = PRIORITY_CONFIG[priority];
  return (
    <span
      data-testid="test-todo-priority"
      style={{
        backgroundColor: color + "22",
        color,
        border: `1px solid ${color}55`,
        padding: "2px 10px",
        borderRadius: "20px",
        fontSize: "0.7rem",
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        fontFamily: "inherit",
      }}
    >
      {label}
    </span>
  );
};

export default PriorityBadge;