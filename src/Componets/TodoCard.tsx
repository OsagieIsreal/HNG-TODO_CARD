import React, { useState, useEffect } from "react";
import type { TodoCardProps, Status, TimeRemaining } from './types';
import { PRIORITY_CONFIG } from './constants';
import { computeTimeRemaining, formatDueDate } from './utils';
import PriorityBadge from './components/PriorityBadge';
import StatusBadge from './components/StatusBadge';
import TagItem from './components/TagItem';

// ─── Main Component ────────────────────────────────────────────────────────────

const TodoCard: React.FC<TodoCardProps> = ({
  title,
  description,
  priority,
  status,
  dueDate,
  tags,
  onEdit,
  onDelete,
  onStatusChange,
}) => {
  const [isCompleted, setIsCompleted]       = useState<boolean>(status === "Done");
  const [currentStatus, setCurrentStatus]   = useState<Status>(status);
  const [timeRemaining, setTimeRemaining]   = useState<TimeRemaining>(() =>
    computeTimeRemaining(dueDate)
  );

  // Auto-update time remaining every 60 seconds
  useEffect(() => {
    const tick = () => setTimeRemaining(computeTimeRemaining(dueDate));
    tick();
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, [dueDate]);

  // Sync external status prop changes
  useEffect(() => {
    setCurrentStatus(status);
    setIsCompleted(status === "Done");
  }, [status]);

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked    = e.target.checked;
    const nextStatus: Status = checked ? "Done" : "Pending";
    setIsCompleted(checked);
    setCurrentStatus(nextStatus);
    onStatusChange?.(nextStatus);
  };

  const dateTimeAttr   = dueDate.toISOString().split("T")[0];
  const formattedDate  = formatDueDate(dueDate);
  const priorityColor  = PRIORITY_CONFIG[priority].color;

  return (
    <>
      {/* Scoped styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

        .tc-root {
          font-family: 'DM Sans', sans-serif;
          background: #ffffff;
          border-radius: 18px;
          padding: 24px;
          width: 100%;
          max-width: 460px;
          box-sizing: border-box;
          border: 1.5px solid #ede8f4;
          box-shadow: 0 4px 24px 0 rgba(80, 50, 120, 0.07), 0 1.5px 4px 0 rgba(80,50,120,0.04);
          position: relative;
          overflow: hidden;
          transition: box-shadow 0.2s ease, transform 0.2s ease;
        }

        .tc-root:hover {
          box-shadow: 0 8px 36px 0 rgba(80, 50, 120, 0.13), 0 2px 6px 0 rgba(80,50,120,0.06);
          transform: translateY(-2px);
        }

        .tc-root::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: var(--priority-color, #9b8ea8);
          border-radius: 18px 18px 0 0;
        }

        .tc-header {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 14px;
        }

        .tc-checkbox-wrap {
          margin-top: 3px;
          flex-shrink: 0;
        }

        .tc-checkbox {
          width: 18px;
          height: 18px;
          accent-color: #7c5cbf;
          cursor: pointer;
          flex-shrink: 0;
        }

        .tc-title {
          font-family: 'Syne', sans-serif;
          font-size: 1.1rem;
          font-weight: 700;
          color: #1e1530;
          margin: 0;
          line-height: 1.3;
          transition: color 0.2s, text-decoration 0.2s;
          word-break: break-word;
        }

        .tc-title--done {
          text-decoration: line-through;
          color: #b0a8bc;
        }

        .tc-description {
          font-size: 0.875rem;
          color: #6b5f7a;
          margin: 0 0 16px 0;
          line-height: 1.6;
          font-weight: 300;
          word-break: break-word;
        }

        .tc-badges {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 14px;
        }

        .tc-date-row {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          margin-bottom: 16px;
        }

        .tc-due-date {
          font-size: 0.78rem;
          font-weight: 500;
          color: #8677a0;
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .tc-due-date svg {
          flex-shrink: 0;
        }

        .tc-time-remaining {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          padding: 2px 9px;
          border-radius: 12px;
          display: inline-block;
        }

        .tc-time-remaining--overdue {
          background: #fdecea;
          color: #c0392b;
          border: 1px solid #f5c6c2;
        }

        .tc-time-remaining--normal {
          background: #eef4fb;
          color: #2d6fa8;
          border: 1px solid #c3dcf5;
        }

        .tc-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 0;
          margin: 0 0 18px 0;
        }

        .tc-footer {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
        }

        .tc-btn {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem;
          font-weight: 500;
          padding: 7px 16px;
          border-radius: 9px;
          border: none;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
          letter-spacing: 0.02em;
          outline-offset: 3px;
        }

        .tc-btn:active {
          transform: scale(0.97);
        }

        .tc-btn--edit {
          background: #f3effe;
          color: #6b3fc0;
          border: 1px solid #d9c8f5;
        }

        .tc-btn--edit:hover {
          background: #e8dcfc;
          box-shadow: 0 2px 8px rgba(107, 63, 192, 0.15);
        }

        .tc-btn--delete {
          background: #fef3f2;
          color: #c0392b;
          border: 1px solid #f5c6c2;
        }

        .tc-btn--delete:hover {
          background: #fde8e6;
          box-shadow: 0 2px 8px rgba(192, 57, 43, 0.13);
        }

        @media (max-width: 480px) {
          .tc-root {
            max-width: 100%;
            border-radius: 14px;
            padding: 18px;
          }
          .tc-title { font-size: 1rem; }
          .tc-footer { justify-content: stretch; }
          .tc-btn { flex: 1; text-align: center; }
        }
      `}</style>

      <article
        data-testid="test-todo-card"
        className="tc-root"
        style={{ "--priority-color": priorityColor } as React.CSSProperties}
        aria-label={`Todo: ${title}`}
      >
        {/* Header: Checkbox + Title */}
        <div className="tc-header">
          <div className="tc-checkbox-wrap">
            <label htmlFor={`toggle-${title}`} style={{ display: "block", lineHeight: 0 }}>
              <span className="sr-only" style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)" }}>
                Mark "{title}" as complete
              </span>
              <input
                id={`toggle-${title}`}
                type="checkbox"
                className="tc-checkbox"
                checked={isCompleted}
                onChange={handleToggle}
                data-testid="test-todo-complete-toggle"
                aria-label={`Mark "${title}" as complete`}
              />
            </label>
          </div>
          <h2
            className={`tc-title${isCompleted ? " tc-title--done" : ""}`}
            data-testid="test-todo-title"
          >
            {title}
          </h2>
        </div>

        {/* Description */}
        <p className="tc-description" data-testid="test-todo-description">
          {description}
        </p>

        {/* Priority + Status badges */}
        <div className="tc-badges">
          <PriorityBadge priority={priority} />
          <StatusBadge   status={currentStatus} />
        </div>

        {/* Due Date + Time Remaining */}
        <div className="tc-date-row">
          <time
            className="tc-due-date"
            dateTime={dateTimeAttr}
            data-testid="test-todo-due-date"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8"  y1="2" x2="8"  y2="6"/>
              <line x1="3"  y1="10" x2="21" y2="10"/>
            </svg>
            Due {formattedDate}
          </time>

          <span
            className={`tc-time-remaining ${
              timeRemaining.isOverdue
                ? "tc-time-remaining--overdue"
                : "tc-time-remaining--normal"
            }`}
            data-testid="test-todo-time-remaining"
            aria-live="polite"
            aria-atomic="true"
          >
            {timeRemaining.label}
          </span>
        </div>

        {/* Tags */}
        <ul
          className="tc-tags"
          data-testid="test-todo-tags"
          role="list"
          aria-label="Tags"
        >
          {tags.map((tag) => (
            <TagItem key={tag} tag={tag} />
          ))}
        </ul>

        {/* Action Buttons */}
        <div className="tc-footer">
          <button
            className="tc-btn tc-btn--edit"
            data-testid="test-todo-edit-button"
            onClick={onEdit}
            aria-label={`Edit task: ${title}`}
            type="button"
          >
            Edit
          </button>
          <button
            className="tc-btn tc-btn--delete"
            data-testid="test-todo-delete-button"
            onClick={onDelete}
            aria-label={`Delete task: ${title}`}
            type="button"
          >
            Delete
          </button>
        </div>
      </article>
    </>
  );
};

export default TodoCard;
