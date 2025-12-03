'use client';

import { FilterType, TodoCount } from '../types/todo';
import { CheckSquare, Clock, CheckCheck, Trash2, AlertTriangle } from 'lucide-react';

interface TodoFilterProps {
  currentFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  todoCount: TodoCount;
  onClearCompleted?: () => void;
  onToggleAll?: () => void;
  hasActiveTodos?: boolean;
}

export default function TodoFilter({ 
  currentFilter, 
  onFilterChange, 
  todoCount,
  onClearCompleted,
  onToggleAll,
  hasActiveTodos = false
}: TodoFilterProps) {
  const filters: { key: FilterType; label: string; count: number; icon: React.ComponentType<any> }[] = [
    { key: 'all', label: 'All', count: todoCount.all, icon: CheckSquare },
    { key: 'active', label: 'Active', count: todoCount.active, icon: Clock },
    { key: 'completed', label: 'Completed', count: todoCount.completed, icon: CheckCheck },
  ];

  return (
    <div className="mb-6 space-y-4">
      {/* Stats Overview */}
      {todoCount.all > 0 && (
        <div className="flex flex-wrap gap-3 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm">
            <CheckSquare className="h-4 w-4 text-blue-600" />
            <span className="font-medium">{todoCount.all}</span>
            <span className="text-gray-600">Total</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-orange-600" />
            <span className="font-medium">{todoCount.active}</span>
            <span className="text-gray-600">Active</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCheck className="h-4 w-4 text-green-600" />
            <span className="font-medium">{todoCount.completed}</span>
            <span className="text-gray-600">Done</span>
          </div>
          {todoCount.overdue > 0 && (
            <div className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="font-medium text-red-600">{todoCount.overdue}</span>
              <span className="text-red-600">Overdue</span>
            </div>
          )}
        </div>
      )}

      {/* Filter Buttons */}
      <div 
        className="flex flex-wrap gap-2"
        role="tablist" 
        aria-label="Filter todos"
      >
        {filters.map((filter) => {
          const Icon = filter.icon;
          return (
            <button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                currentFilter === filter.key
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
              }`}
              role="tab"
              aria-selected={currentFilter === filter.key}
              aria-controls="todo-list"
            >
              <Icon className="h-4 w-4" />
              {filter.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                currentFilter === filter.key 
                  ? 'bg-white/20 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {filter.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Bulk Actions */}
      {todoCount.all > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
          {onToggleAll && (
            <button
              onClick={onToggleAll}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              aria-label={hasActiveTodos ? 'Mark all as complete' : 'Mark all as incomplete'}
            >
              <CheckCheck className="h-3 w-3" />
              {hasActiveTodos ? 'Complete All' : 'Incomplete All'}
            </button>
          )}
          
          {onClearCompleted && todoCount.completed > 0 && (
            <button
              onClick={onClearCompleted}
              className="flex items-center gap-2 px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Clear completed todos"
            >
              <Trash2 className="h-3 w-3" />
              Clear Completed ({todoCount.completed})
            </button>
          )}
        </div>
      )}
    </div>
  );
}