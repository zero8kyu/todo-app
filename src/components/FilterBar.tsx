import type { FilterState, FilterStatus, Priority } from '../types';
import { SearchIcon } from './Icons';

interface Props {
  filter: FilterState;
  onChange: (patch: Partial<FilterState>) => void;
  allTags: string[];
  onClearCompleted: () => void;
  completedCount: number;
}

const STATUS_TABS: { value: FilterStatus; label: string }[] = [
  { value: 'all',       label: 'All' },
  { value: 'active',    label: 'Active' },
  { value: 'completed', label: 'Done' },
];

const PRIORITY_OPTS: { value: Priority | 'all'; label: string }[] = [
  { value: 'all',    label: 'All priorities' },
  { value: 'high',   label: 'High' },
  { value: 'medium', label: 'Medium' },
  { value: 'low',    label: 'Low' },
];

export function FilterBar({ filter, onChange, allTags, onClearCompleted, completedCount }: Props) {
  return (
    <div className="mb-4 space-y-3">
      {/* Status tabs */}
      <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1 dark:bg-gray-800">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => onChange({ status: tab.value })}
            className={`flex-1 rounded-md py-1.5 text-sm font-medium transition-all ${
              filter.status === tab.value
                ? 'bg-white text-gray-900 shadow-sm dark:bg-gray-700 dark:text-white'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search + priority + tag row */}
      <div className="flex flex-wrap gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-40">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
            <SearchIcon />
          </span>
          <input
            type="text"
            value={filter.search}
            onChange={(e) => onChange({ search: e.target.value })}
            placeholder="Search tasks or tags…"
            className="input pl-8"
          />
        </div>

        {/* Priority filter */}
        <select
          value={filter.priority}
          onChange={(e) => onChange({ priority: e.target.value as Priority | 'all' })}
          className="input w-auto cursor-pointer"
        >
          {PRIORITY_OPTS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Tag filter */}
        {allTags.length > 0 && (
          <select
            value={filter.tag}
            onChange={(e) => onChange({ tag: e.target.value })}
            className="input w-auto cursor-pointer"
          >
            <option value="">All tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>#{tag}</option>
            ))}
          </select>
        )}
      </div>

      {/* Clear completed */}
      {completedCount > 0 && (
        <div className="flex justify-end">
          <button onClick={onClearCompleted} className="text-xs text-gray-400 hover:text-red-500 transition-colors dark:text-gray-500 dark:hover:text-red-400">
            Clear {completedCount} completed
          </button>
        </div>
      )}
    </div>
  );
}
