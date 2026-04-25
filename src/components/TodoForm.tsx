import { useState, useRef, type FormEvent } from 'react';
import type { Priority } from '../types';
import { PlusIcon } from './Icons';

interface Props {
  onAdd: (title: string, priority: Priority, dueDate: string | null, tags: string[]) => void;
}

const PRIORITIES: { value: Priority; label: string; color: string }[] = [
  { value: 'high',   label: 'High',   color: 'text-red-500' },
  { value: 'medium', label: 'Medium', color: 'text-yellow-500' },
  { value: 'low',    label: 'Low',    color: 'text-green-500' },
];

export function TodoForm({ onAdd }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddTag = () => {
    const cleaned = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (cleaned && !tags.includes(cleaned)) {
      setTags((prev) => [...prev, cleaned]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed, priority, dueDate || null, tags);
    setTitle('');
    setPriority('medium');
    setDueDate('');
    setTags([]);
    setTagInput('');
    setExpanded(false);
    inputRef.current?.focus();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      {/* Main input row */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setExpanded(true)}
          placeholder="Add a new task…"
          className="input flex-1"
          autoFocus
        />
        <button type="submit" disabled={!title.trim()} className="btn-primary gap-1 disabled:opacity-40">
          <PlusIcon />
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>

      {/* Expanded options */}
      {expanded && (
        <div className="mt-3 animate-fade-in space-y-3 border-t border-gray-100 pt-3 dark:border-gray-800">
          {/* Priority + Due date */}
          <div className="flex flex-wrap gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Priority</label>
              <div className="flex gap-1">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPriority(p.value)}
                    className={`rounded-md px-2.5 py-1 text-xs font-medium transition-all ${
                      priority === p.value
                        ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className={priority === p.value ? '' : p.color}>{p.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Due date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={new Date().toISOString().slice(0, 10)}
                className="input w-auto text-xs"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Tags</label>
            <div className="flex flex-wrap items-center gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300"
                >
                  #{tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="ml-0.5 hover:text-indigo-900 dark:hover:text-indigo-100">×</button>
                </span>
              ))}
              <div className="flex gap-1">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); }
                    if (e.key === ',' || e.key === ' ') { e.preventDefault(); handleAddTag(); }
                  }}
                  placeholder="tag name…"
                  className="input w-28 text-xs"
                />
                <button type="button" onClick={handleAddTag} className="btn-ghost text-xs">Add</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
