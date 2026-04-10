import React from "react";
import type { Status } from '../types';
import { STATUS_CONFIG } from '../constants';

const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  const { label, color } = STATUS_CONFIG[status];
  return (
    <span
      data-testid="test-todo-status"
      style={{
        backgroundColor: color + "18",
        color,
        border: `1px solid ${color}44`,
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

export default StatusBadge;