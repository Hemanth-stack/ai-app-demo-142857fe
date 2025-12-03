'use client';

import { Todo } from '../types/todo';
import TodoItem from './TodoItem';
import { ListTodo, Loader } from 'lucide-react';

interface TodoListProps {
  todos: Todo[];
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onUpdateTodo?: (id: string, text: string) => void;
  isLoading?: boolean;
  searchQuery?: string;
}

export default function TodoList({ 
  todos, 
  onToggleTodo, 
  onDeleteTodo, 
  onUpdateTodo,
  isLoading = false,
  searchQuery = ''
}: TodoListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">Loading todos...</span>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500" role="status">
        <ListTodo className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p className="text-lg font-medium">
          {searchQuery ? 'No todos match your search' : 'No todos found'}
        </p>
        <p className="text-sm mt-1">
          {searchQuery 
            ? 'Try adjusting your search terms' 
            : 'Add one above to get started!'
          }
        </p>
      </div>
    );
  }

  return (
    <div 
      className="space-y-3"
      role="list"
      aria-label={`${todos.length} todos`}
    >
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggleTodo}
          onDelete={onDeleteTodo}
          onUpdate={onUpdateTodo}
        />
      ))}
    </div>
  );
}