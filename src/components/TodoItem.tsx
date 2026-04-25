import { useState, useRef, type KeyboardEvent } from 'react';
import type { Todo, Priority } from '../types';
import { TrashIcon, PencilIcon, CheckIcon, XIcon, CalendarIcon, TagIcon } from './Icons';

interface Props {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, patch: Partial<Omit<Todo, 'id' | 'createdAt'>>) => void;
}

const PRIORITY_CONFIG: Record<Priority, { dot: string; badge: string; label: string }> = {
  high:   { dot: 'bg-red-500',    badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',    label: 'High' },
  medium: { dot: 'bg-yellow-400', badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300', label: 'Med' },
  low:    { dot: 'bg-green-500',  badge: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',   label: 'Low' },
};

function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.round((d.getTime() - today.getTime()) / 86400000);
  if (diff < 0) return `Overdue (${iso})`;
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function isOverdue(iso: string | null, completed: boolean): boolean {
  if (!iso || completed) return false;
  const d = new Date(iso + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return d < today;
}

export function TodoItem({ todo, onToggle, onDelete, onUpdate }: Props) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const inputRef = useRef<HTMLInputElement>(null);

  const startEdit = () => {
    setEditTitle(todo.title);
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const commitEdit = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== todo.title) {
      onUpdate(todo.id, { title: trimmed });
    }
    setEditing(false);
  };

  const cancelEdit = () => {
    setEditTitle(todo.title);
    setEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') commitEdit();
    if (e.key === 'Escape') cancelEdit();
  };

  const overdue = isOverdue(todo.dueDate, todo.completed);
  const cfg = PRIORITY_CONFIG[todo.priority];
  const dateLabel = formatDate(todo.dueDate);

  return (
    <li
      className={`group flex items-start gap-3 rounded-xl border px-4 py-3 transition-all animate-slide-in ${
        todo.completed
          ? 'border-gray-100 bg-gray-50/60 dark:border-gray-800/50 dark:bg-gray-900/40'
          : 'border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900'
      }`}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(todo.id)}
        aria-label={todo.completed ? 'Mark as active' : 'Mark as done'}
        className={`mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${
          todo.completed
            ? 'border-indigo-500 bg-indigo-500 text-white'
            : 'border-gray-300 hover:border-indigo-400 dark:border-gray-600 dark:hover:border-indigo-500'
        }`}
      >
        {todo.completed && <CheckIcon />}
      </button>

      {/* Content */}
      <div className="min-w-0 flex-1">
        {editing ? (
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={commitEdit}
              className="input flex-1 text-sm"
            />
            <button onClick={commitEdit} className="btn-ghost text-green-600 dark:text-green-400"><CheckIcon /></button>
            <button onClick={cancelEdit} className="btn-ghost text-red-500 dark:text-red-400"><XIcon /></button>
          </div>
        ) : (
          <p
            onDoubleClick={startEdit}
            className={`text-sm leading-snug transition-all ${
              todo.completed
                ? 'text-gray-400 line-through dark:text-gray-500'
                : 'text-gray-800 dark:text-gray-200'
            }`}
          >
            {todo.title}
          </p>
        )}

        {/* Meta row */}
        {!editing && (
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            {/* Priority badge */}
            <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-medium ${cfg.badge}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
              {cfg.label}
            </span>

            {/* Due date */}
            {dateLabel && (
              <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${
                overdue ? 'text-red-500 dark:text-red-400' : 'text-gray-400 dark:text-gray-500'
              }`}>
                <CalendarIcon />
                {dateLabel}
              </span>
            )}

            {/* Tags */}
            {todo.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-0.5 rounded-full bg-indigo-50 px-1.5 py-0.5 text-[11px] font-medium text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
              >
                <TagIcon />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      {!editing && (
        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <button onClick={startEdit} className="btn-ghost p-1.5" aria-label="Edit">
            <PencilIcon />
          </button>
          <button onClick={() => onDelete(todo.id)} className="btn-danger p-1.5" aria-label="Delete">
            <TrashIcon />
          </button>
        </div>
      )}
    </li>
  );
}
