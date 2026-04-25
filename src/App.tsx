import { useTodos } from './hooks/useTodos';
import { useDarkMode } from './hooks/useDarkMode';
import { Header } from './components/Header';
import { TodoForm } from './components/TodoForm';
import { FilterBar } from './components/FilterBar';
import { TodoItem } from './components/TodoItem';
import { EmptyState } from './components/EmptyState';

function App() {
  const { dark, toggle } = useDarkMode();
  const {
    todos,
    filter,
    setFilter,
    allTags,
    stats,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    clearCompleted,
  } = useTodos();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200">
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <Header dark={dark} onToggle={toggle} stats={stats} />

        <TodoForm onAdd={addTodo} />

        <FilterBar
          filter={filter}
          onChange={(patch) => setFilter((prev) => ({ ...prev, ...patch }))}
          allTags={allTags}
          onClearCompleted={clearCompleted}
          completedCount={stats.completed}
        />

        {todos.length === 0 ? (
          <EmptyState status={filter.status} hasSearch={!!filter.search} />
        ) : (
          <ul className="space-y-2">
            {todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={toggleTodo}
                onDelete={deleteTodo}
                onUpdate={updateTodo}
              />
            ))}
          </ul>
        )}

        {stats.total > 0 && (
          <p className="mt-8 text-center text-xs text-gray-300 dark:text-gray-700">
            {stats.total} task{stats.total !== 1 ? 's' : ''} · {stats.active} active · {stats.completed} done
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
