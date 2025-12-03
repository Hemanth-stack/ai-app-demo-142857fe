'use client';

import { useState, useCallback, useRef } from 'react';
import { Todo } from '../types/todo';
import { Trash2, Check, Edit2, Save, X } from 'lucide-react';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate?: (id: string, text: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete, onUpdate }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
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
    setTimeout(() => editInputRef.current?.focus(), 0);
  }, [todo.text]);

  const handleSave = useCallback(() => {
    const trimmedText = editText.trim();
    if (trimmedText && trimmedText !== todo.text && onUpdate) {
      onUpdate(todo.id, trimmedText);
    }
    setIsEditing(false);
    setEditText(todo.text);
  }, [editText, todo.id, todo.text, onUpdate]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditText(todo.text);
  }, [todo.text]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  }, [handleSave, handleCancel]);

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(todo.createdAt);

  return (
    <div 
      className={`group flex items-center gap-3 p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${
        todo.completed ? 'border-green-200 bg-green-50' : 'border-gray-200'
      }`}
      role="listitem"
    >
      <button
        onClick={handleToggle}
        className={`flex items-center justify-center w-5 h-5 border-2 rounded transition-all ${
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
          <div className="flex items-center gap-2">
            <input
              ref={editInputRef}
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              maxLength={500}
              aria-label="Edit todo text"
            />
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
        ) : (
          <div>
            <div
              className={`break-words ${
                todo.completed
                  ? 'line-through text-gray-500'
                  : 'text-gray-900'
              }`}
            >
              {todo.text}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Created {formattedDate}
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