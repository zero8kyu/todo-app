export type Priority = 'high' | 'medium' | 'low';
export type FilterStatus = 'all' | 'active' | 'completed';

export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  dueDate: string | null; // ISO date string YYYY-MM-DD
  createdAt: string;      // ISO datetime string
  tags: string[];
}

export interface FilterState {
  status: FilterStatus;
  priority: Priority | 'all';
  search: string;
  tag: string;
}
