'use client';

import { useState, useCallback } from 'react';
import { Plus, Calendar as CalendarIcon, Flag } from 'lucide-react';

interface TodoFormProps {
  onAddTodo: (text: string, dueDate?: Date, priority?: 'low' | 'medium' | 'high') => void;
  disabled?: boolean;
  selectedDate?: Date;
}

export default function TodoForm({ onAddTodo, disabled = false, selectedDate }: TodoFormProps) {
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState<string>(
    selectedDate ? selectedDate.toISOString().split('T')[0] : ''
  );
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedText = text.trim();
    
    if (!trimmedText || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const parsedDueDate = dueDate ? new Date(dueDate) : undefined;
      await onAddTodo(trimmedText, parsedDueDate, priority);
      setText('');
      setDueDate('');
      setPriority('medium');
      setShowAdvanced(false);
    } catch (error) {
      console.error('Failed to add todo:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [text, dueDate, priority, onAddTodo, isSubmitting]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const getPriorityColor = (p: 'low' | 'medium' | 'high') => {
    switch (p) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6" role="form" aria-label="Add new todo">
      <div className="space-y-3">
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
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`px-3 py-2 border rounded-lg transition-colors ${
              showAdvanced || dueDate || priority !== 'medium'
                ? 'border-blue-500 bg-blue-50 text-blue-600'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            aria-label="Toggle advanced options"
          >
            <CalendarIcon className="h-4 w-4" />
          </button>
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

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="flex gap-2 p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <label htmlFor="due-date" className="block text-xs font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <input
                id="due-date"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="priority" className="block text-xs font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Press Enter to add, max 500 characters</span>
          {(dueDate || priority !== 'medium') && (
            <div className="flex items-center gap-3">
              {dueDate && (
                <span className="flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  {new Date(dueDate).toLocaleDateString()}
                </span>
              )}
              {priority !== 'medium' && (
                <span className={`flex items-center gap-1 ${getPriorityColor(priority)}`}>
                  <Flag className="h-3 w-3" />
                  {priority} priority
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </form>
  );
}