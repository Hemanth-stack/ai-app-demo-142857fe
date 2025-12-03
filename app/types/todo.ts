export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date; // Added for calendar functionality
  priority?: 'low' | 'medium' | 'high'; // Added for better organization
}

export type FilterType = 'all' | 'active' | 'completed';

export type ViewType = 'list' | 'calendar'; // Added for view switching

export interface TodoState {
  todos: Todo[];
  filter: FilterType;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  view: ViewType; // Added for view state
}

export interface TodoActions {
  addTodo: (text: string, dueDate?: Date, priority?: 'low' | 'medium' | 'high') => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (id: string, text: string, dueDate?: Date, priority?: 'low' | 'medium' | 'high') => void;
  clearCompleted: () => void;
  toggleAllTodos: () => void;
  setFilter: (filter: FilterType) => void;
  setSearchQuery: (query: string) => void;
  setView: (view: ViewType) => void; // Added for view switching
}

export interface TodoCount {
  all: number;
  active: number;
  completed: number;
  overdue: number; // Added for overdue tracking
}

export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  todos: Todo[];
}