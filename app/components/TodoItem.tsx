'use client';

import { useState, useCallback, useRef } from 'react';
import { Todo } from '../types/todo';
import { Trash2, Check, Edit2, Save, X, Calendar, Flag, AlertTriangle } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate?: (id: string, text: string, dueDate?: Date, priority?: 'low' | 'medium' | 'high') => void;
}

export default function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editDueDate, setEditDueDate] = useState(
    todo.dueDate ? todo.dueDate.toISOString().split('T')[0] : ''
  );
  const [editPriority, setEditPriority] = useState(todo.priority || 'medium');
  const editInputRef = useRef<HTMLInputElement>(null);

  const handleToggle = useCallback(() => {
    onToggle(todo.id);
  }, [todo.id, onToggle]);

  const handleDelete = useCallback(() => {
    if (window.confirm('Are you sure you want to delete this todo?')) {
      onDelete(todo.id);
    }
  }, [todo.id, onDelete]);

  const handleEdit = useCallback(() => {
    setIsEditing(true);
    setEditText(todo.text);
    setEditDueDate(todo.dueDate ? todo.dueDate.toISOString().split('T')[0] : '');
    setEditPriority(todo.priority || 'medium');
    setTimeout(() => editInputRef.current?.focus(), 0);
  }, [todo.text, todo.dueDate, todo.priority]);

  const handleSave = useCallback(() => {
    const trimmedText = editText.trim();
    if (trimmedText && onUpdate) {
      const parsedDueDate = editDueDate ? new Date(editDueDate) : undefined;
      onUpdate(todo.id, trimmedText, parsedDueDate, editPriority);
    }
    setIsEditing(false);
  }, [editText, editDueDate, editPriority, todo.id, onUpdate]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditText(todo.text);
    setEditDueDate(todo.dueDate ? todo.dueDate.toISOString().split('T')[0] : '');
    setEditPriority(todo.priority || 'medium');
  }, [todo.text, todo.dueDate, todo.priority]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  }, [handleSave, handleCancel]);

  const isOverdue = useCallback(() => {
    if (!todo.dueDate || todo.completed) return false;
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    return todo.dueDate < now;
  }, [todo.dueDate, todo.completed]);

  const isDueToday = useCallback(() => {
    if (!todo.dueDate) return false;
    const today = new Date();
    const dueDate = new Date(todo.dueDate);
    return (
      today.getDate() === dueDate.getDate() &&
      today.getMonth() === dueDate.getMonth() &&
      today.getFullYear() === dueDate.getFullYear()
    );
  }, [todo.dueDate]);

  const getPriorityColor = (priority?: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityIcon = (priority?: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return '🔴';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '';
    }
  };

  const formattedDate = todo.createdAt ? new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(todo.createdAt) : '';

  const formattedDueDate = todo.dueDate ? new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: todo.dueDate.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  }).format(todo.dueDate) : '';

  return (
    <div 
      className={`group flex items-start gap-3 p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${
        todo.completed 
          ? 'border-green-200 bg-green-50' 
          : isOverdue()
          ? 'border-red-200 bg-red-50'
          : isDueToday()
          ? 'border-blue-200 bg-blue-50'
          : 'border-gray-200'
      }`}
      role="listitem"
    >
      <button
        onClick={handleToggle}
        className={`flex items-center justify-center w-5 h-5 border-2 rounded transition-all mt-0.5 ${
          todo.completed
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-300 hover:border-green-500'
        } focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2`}
        aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
        aria-pressed={todo.completed}
      >
        {todo.completed && <Check className="h-3 w-3" />}
      </button>

      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="space-y-3">
            <input
              ref={editInputRef}
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={500}
              aria-label="Edit todo text"
            />
            <div className="flex gap-2">
              <input
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value as 'low' | 'medium' | 'high')}
                className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={!editText.trim()}
                className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors disabled:opacity-50"
                aria-label="Save changes"
              >
                <Save className="h-4 w-4" />
              </button>
              <button
                onClick={handleCancel}
                className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors"
                aria-label="Cancel editing"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-start gap-2 mb-2">
              <div
                className={`flex-1 break-words ${
                  todo.completed
                    ? 'line-through text-gray-500'
                    : 'text-gray-900'
                }`}
              >
                {todo.text}
              </div>
              {todo.priority && todo.priority !== 'medium' && (
                <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(todo.priority)}`}>
                  {getPriorityIcon(todo.priority)} {todo.priority}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>Created {formattedDate}</span>
              {todo.dueDate && (
                <span className={`flex items-center gap-1 ${
                  isOverdue() ? 'text-red-600 font-medium' : 
                  isDueToday() ? 'text-blue-600 font-medium' : 
                  'text-gray-500'
                }`}>
                  {isOverdue() && <AlertTriangle className="h-3 w-3" />}
                  <Calendar className="h-3 w-3" />
                  Due {formattedDueDate}
                  {isDueToday() && ' (Today)'}
                  {isOverdue() && ' (Overdue)'}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {!isEditing && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onUpdate && (
            <button
              onClick={handleEdit}
              className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
              aria-label="Edit todo"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={handleDelete}
            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
            aria-label="Delete todo"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}