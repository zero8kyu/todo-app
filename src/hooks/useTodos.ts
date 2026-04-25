import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Todo, Priority, FilterState } from '../types';

const STORAGE_KEY = 'claude-todos-v1';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Todo[];
  } catch {
    return [];
  }
}

function saveTodos(todos: Todo[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);
  const [filter, setFilter] = useState<FilterState>({
    status: 'all',
    priority: 'all',
    search: '',
    tag: '',
  });

  // Persist on every change
  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const addTodo = useCallback(
    (title: string, priority: Priority = 'medium', dueDate: string | null = null, tags: string[] = []) => {
      const todo: Todo = {
        id: generateId(),
        title: title.trim(),
        completed: false,
        priority,
        dueDate,
        createdAt: new Date().toISOString(),
        tags,
      };
      setTodos((prev) => [todo, ...prev]);
    },
    []
  );

  const updateTodo = useCallback((id: string, patch: Partial<Omit<Todo, 'id' | 'createdAt'>>) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  }, []);

  const reorderTodos = useCallback((fromIndex: number, toIndex: number) => {
    setTodos((prev) => {
      const next = [...prev];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      return next;
    });
  }, []);

  // Derived: all unique tags
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    todos.forEach((t) => t.tags.forEach((tag) => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [todos]);

  // Filtered & sorted list
  const filteredTodos = useMemo(() => {
    return todos.filter((t) => {
      if (filter.status === 'active' && t.completed) return false;
      if (filter.status === 'completed' && !t.completed) return false;
      if (filter.priority !== 'all' && t.priority !== filter.priority) return false;
      if (filter.tag && !t.tags.includes(filter.tag)) return false;
      if (filter.search) {
        const q = filter.search.toLowerCase();
        if (!t.title.toLowerCase().includes(q) && !t.tags.some((tag) => tag.toLowerCase().includes(q)))
          return false;
      }
      return true;
    });
  }, [todos, filter]);

  const stats = useMemo(() => ({
    total: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  }), [todos]);

  return {
    todos: filteredTodos,
    filter,
    setFilter,
    allTags,
    stats,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    clearCompleted,
    reorderTodos,
  };
}
