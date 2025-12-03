export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type FilterType = 'all' | 'active' | 'completed';

export interface TodoState {
  todos: Todo[];
  filter: FilterType;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

export interface TodoActions {
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (id: string, text: string) => void;
  clearCompleted: () => void;
  toggleAllTodos: () => void;
  setFilter: (filter: FilterType) => void;
  setSearchQuery: (query: string) => void;
}

export interface TodoCount {
  all: number;
  active: number;
  completed: number;
}