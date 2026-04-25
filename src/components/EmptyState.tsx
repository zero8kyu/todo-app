import type { FilterStatus } from '../types';

interface Props {
  status: FilterStatus;
  hasSearch: boolean;
}

export function EmptyState({ status, hasSearch }: Props) {
  const messages: Record<string, { emoji: string; title: string; sub: string }> = {
    search:    { emoji: '🔍', title: 'No results found',         sub: 'Try a different search term or clear the filters.' },
    all:       { emoji: '✅', title: 'No tasks yet',             sub: 'Add your first task above to get started.' },
    active:    { emoji: '🎉', title: 'Nothing left to do!',      sub: 'All tasks are completed. Great work!' },
    completed: { emoji: '📋', title: 'No completed tasks yet',   sub: 'Complete some tasks and they will appear here.' },
  };

  const key = hasSearch ? 'search' : status;
  const { emoji, title, sub } = messages[key] ?? messages['all'];

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-3 text-4xl select-none">{emoji}</div>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
      <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{sub}</p>
    </div>
  );
}
