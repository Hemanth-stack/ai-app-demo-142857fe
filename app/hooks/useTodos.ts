'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Todo, FilterType, TodoState, TodoActions, TodoCount, ViewType } from '../types/todo';

const STORAGE_KEY = 'todos-app-data';

function loadTodosFromStorage(): Todo[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return parsed.map((todo: any) => ({
      ...todo,
      createdAt: new Date(todo.createdAt),
      updatedAt: new Date(todo.updatedAt),
      dueDate: todo.dueDate ? new Date(todo.dueDate) : undefined,
    }));
  } catch (error) {
    console.error('Failed to load todos from storage:', error);
    return [];
  }
}

function saveTodosToStorage(todos: Todo[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (error) {
    console.error('Failed to save todos to storage:', error);
  }
}

export function useTodos(): TodoState & TodoActions & { todoCount: TodoCount } {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<ViewType>('list');

  // Load todos from localStorage on mount
  useEffect(() => {
    try {
      const loadedTodos = loadTodosFromStorage();
      setTodos(loadedTodos);
    } catch (err) {
      setError('Failed to load todos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    if (!isLoading) {
      saveTodosToStorage(todos);
    }
  }, [todos, isLoading]);

  const addTodo = useCallback((text: string, dueDate?: Date, priority: 'low' | 'medium' | 'high' = 'medium') => {
    try {
      if (!text.trim()) {
        setError('Todo text cannot be empty');
        return;
      }

      const newTodo: Todo = {
        id: crypto.randomUUID(),
        text: text.trim(),
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        dueDate,
        priority,
      };
      
      setTodos((prev) => [newTodo, ...prev]);
      setError(null);
    } catch (err) {
      console.error('Error adding todo:', err);
      setError('Failed to add todo');
    }
  }, []);

  const toggleTodo = useCallback((id: string) => {
    try {
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id 
            ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
            : todo
        )
      );
      setError(null);
    } catch (err) {
      console.error('Error toggling todo:', err);
      setError('Failed to update todo');
    }
  }, []);

  const deleteTodo = useCallback((id: string) => {
    try {
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
      setError(null);
    } catch (err) {
      console.error('Error deleting todo:', err);
      setError('Failed to delete todo');
    }
  }, []);

  const updateTodo = useCallback((id: string, text: string, dueDate?: Date, priority?: 'low' | 'medium' | 'high') => {
    try {
      if (!text.trim()) {
        setError('Todo text cannot be empty');
        return;
      }

      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id 
            ? { 
                ...todo, 
                text: text.trim(), 
                updatedAt: new Date(),
                ...(dueDate !== undefined && { dueDate }),
                ...(priority && { priority })
              }
            : todo
        )
      );
      setError(null);
    } catch (err) {
      console.error('Error updating todo:', err);
      setError('Failed to update todo');
    }
  }, []);

  const clearCompleted = useCallback(() => {
    try {
      setTodos((prev) => prev.filter((todo) => !todo.completed));
      setError(null);
    } catch (err) {
      console.error('Error clearing completed todos:', err);
      setError('Failed to clear completed todos');
    }
  }, []);

  const toggleAllTodos = useCallback(() => {
    try {
      const hasActiveTodos = todos.some((todo) => !todo.completed);
      setTodos((prev) =>
        prev.map((todo) => ({
          ...todo,
          completed: hasActiveTodos,
          updatedAt: new Date(),
        }))
      );
      setError(null);
    } catch (err) {
      console.error('Error toggling all todos:', err);
      setError('Failed to toggle all todos');
    }
  }, [todos]);

  const filteredTodos = useMemo(() => {
    let filtered = todos;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((todo) =>
        todo.text.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    switch (filter) {
      case 'active':
        return filtered.filter((todo) => !todo.completed);
      case 'completed':
        return filtered.filter((todo) => todo.completed);
      default:
        return filtered;
    }
  }, [todos, filter, searchQuery]);

  const todoCount = useMemo((): TodoCount => {
    const now = new Date();
    now.setHours(23, 59, 59, 999); // End of today
    
    return {
      all: todos.length,
      active: todos.filter((todo) => !todo.completed).length,
      completed: todos.filter((todo) => todo.completed).length,
      overdue: todos.filter((todo) => 
        !todo.completed && 
        todo.dueDate && 
        todo.dueDate < now
      ).length,
    };
  }, [todos]);

  return {
    todos: filteredTodos,
    filter,
    searchQuery,
    isLoading,
    error,
    view,
    todoCount,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearCompleted,
    toggleAllTodos,
    setFilter,
    setSearchQuery,
    setView,
  };
}