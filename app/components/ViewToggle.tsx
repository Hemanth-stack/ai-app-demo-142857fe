'use client';

import { Calendar, List } from 'lucide-react';
import { ViewType } from '../types/todo';

interface ViewToggleProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export default function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
      <button
        onClick={() => onViewChange('list')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
          currentView === 'list'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <List className="h-4 w-4" />
        List View
      </button>
      <button
        onClick={() => onViewChange('calendar')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
          currentView === 'calendar'
            ? 'bg-white text-blue-600 shadow-sm'
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <Calendar className="h-4 w-4" />
        Calendar View
      </button>
    </div>
  );
}