'use client';

import { useState, useCallback } from 'react';
import { Plus } from 'lucide-react';

interface TodoFormProps {
  onAddTodo: (text: string) => void;
  disabled?: boolean;
}

export default function TodoForm({ onAddTodo, disabled = false }: TodoFormProps) {
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = text.trim();
    
    if (!trimmedText || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onAddTodo(trimmedText);
      setText('');
    } catch (error) {
      console.error('Failed to add todo:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [text, onAddTodo, isSubmitting]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6" role="form" aria-label="Add new todo">
      <div className="flex gap-2">
        <label htmlFor="todo-input" className="sr-only">
          Enter a new todo
        </label>
        <input
          id="todo-input"
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new todo..."
          disabled={disabled || isSubmitting}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          maxLength={500}
          aria-describedby="todo-help"
        />
        <button
          type="submit"
          disabled={disabled || isSubmitting || !text.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[80px]"
          aria-label="Add todo"
        >
          {isSubmitting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Add
            </>
          )}
        </button>
      </div>
      <div id="todo-help" className="text-xs text-gray-500 mt-1">
        Press Enter to add, max 500 characters
      </div>
    </form>
  );
}