import { MoonIcon, SunIcon } from './Icons';

interface Props {
  dark: boolean;
  onToggle: () => void;
  stats: { total: number; active: number; completed: number };
}

export function Header({ dark, onToggle, stats }: Props) {
  return (
    <header className="mb-8 flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
          My Tasks
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {stats.active === 0 && stats.total > 0
            ? 'All done!'
            : `${stats.active} remaining · ${stats.completed} done`}
        </p>
      </div>

      <button
        onClick={onToggle}
        className="btn-ghost rounded-full p-2 text-lg"
        aria-label="Toggle dark mode"
      >
        {dark ? <SunIcon /> : <MoonIcon />}
      </button>
    </header>
  );
}
