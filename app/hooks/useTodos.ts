'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { Todo, FilterType, TodoState, TodoActions, TodoCount } from '../types/todo';

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

  const addTodo = useCallback((text: string) => {
    try {
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        text: text.trim(),
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setTodos((prev) => [newTodo, ...prev]);
      setError(null);
    } catch (err) {
      setError('Failed to add todo');
    }
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id 
          ? { ...todo, completed: !todo.completed, updatedAt: new Date() }
          : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  const updateTodo = useCallback((id: string, text: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id 
          ? { ...todo, text: text.trim(), updatedAt: new Date() }
          : todo
      )
    );
  }, []);

  const clearCompleted = useCallback(() => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  }, []);

  const toggleAllTodos = useCallback(() => {
    const hasActiveTodos = todos.some((todo) => !todo.completed);
    setTodos((prev) =>
      prev.map((todo) => ({
        ...todo,
        completed: hasActiveTodos,
        updatedAt: new Date(),
      }))
    );
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

  const todoCount = useMemo((): TodoCount => ({
    all: todos.length,
    active: todos.filter((todo) => !todo.completed).length,
    completed: todos.filter((todo) => todo.completed).length,
  }), [todos]);

  return {
    todos: filteredTodos,
    filter,
    searchQuery,
    isLoading,
    error,
    todoCount,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearCompleted,
    toggleAllTodos,
    setFilter,
    setSearchQuery,
  };
}