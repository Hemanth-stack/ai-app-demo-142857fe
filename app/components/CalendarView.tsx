'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, AlertTriangle } from 'lucide-react';
import { Todo, CalendarDay } from '../types/todo';
import TodoItem from './TodoItem';

interface CalendarViewProps {
  todos: Todo[];
  onToggleTodo: (id: string) => void;
  onDeleteTodo: (id: string) => void;
  onUpdateTodo: (id: string, text: string, dueDate?: Date, priority?: 'low' | 'medium' | 'high') => void;
  onAddTodo: (text: string, dueDate?: Date, priority?: 'low' | 'medium' | 'high') => void;
}

export default function CalendarView({
  todos,
  onToggleTodo,
  onDeleteTodo,
  onUpdateTodo,
  onAddTodo
}: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Get first day of the month and last day
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Get first day of the calendar (might be from previous month)
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    // Get last day of the calendar (might be from next month)
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));
    
    const days: CalendarDay[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dayTodos = todos.filter(todo => {
        if (!todo.dueDate) return false;
        const todoDate = new Date(todo.dueDate);
        todoDate.setHours(0, 0, 0, 0);
        const currentDay = new Date(date);
        currentDay.setHours(0, 0, 0, 0);
        return todoDate.getTime() === currentDay.getTime();
      });

      days.push({
        date: new Date(date),
        isCurrentMonth: date.getMonth() === month,
        isToday: date.getTime() === today.getTime(),
        todos: dayTodos
      });
    }
    
    return days;
  }, [currentDate, todos]);

  const selectedDateTodos = useMemo(() => {
    if (!selectedDate) return [];
    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);
    
    return todos.filter(todo => {
      if (!todo.dueDate) return false;
      const todoDate = new Date(todo.dueDate);
      todoDate.setHours(0, 0, 0, 0);
      return todoDate.getTime() === selected.getTime();
    });
  }, [selectedDate, todos]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleAddTodo = (date: Date) => {
    setSelectedDate(date);
    setShowAddForm(true);
  };

  const handleSubmitTodo = () => {
    if (newTodoText.trim() && selectedDate) {
      onAddTodo(newTodoText.trim(), selectedDate, newTodoPriority);
      setNewTodoText('');
      setNewTodoPriority('medium');
      setShowAddForm(false);
    }
  };

  const getPriorityColor = (priority?: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'high': return 'bg-red-100 border-red-300';
      case 'medium': return 'bg-yellow-100 border-yellow-300';
      case 'low': return 'bg-green-100 border-green-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };

  const isOverdue = (todo: Todo) => {
    if (!todo.dueDate || todo.completed) return false;
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    return todo.dueDate < now;
  };

  const monthYearFormat = new Intl.DateTimeFormat('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {monthYearFormat.format(currentDate)}
        </h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateMonth('prev')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => navigateMonth('next')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 border-b border-gray-200">
              {weekdays.map(day => (
                <div key={day} className="p-3 text-center font-medium text-gray-600 bg-gray-50">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, index) => (
                <div
                  key={index}
                  className={`min-h-[100px] p-2 border-r border-b border-gray-100 cursor-pointer transition-colors ${
                    day.isCurrentMonth ? 'hover:bg-blue-50' : 'bg-gray-50 hover:bg-gray-100'
                  } ${day.isToday ? 'bg-blue-100' : ''}`}
                  onClick={() => setSelectedDate(day.date)}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${
                      day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                    } ${day.isToday ? 'text-blue-600' : ''}`}>
                      {day.date.getDate()}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddTodo(day.date);
                      }}
                      className="opacity-0 hover:opacity-100 p-1 hover:bg-blue-100 rounded transition-all"
                      title="Add todo"
                    >
                      <Plus className="h-3 w-3 text-blue-600" />
                    </button>
                  </div>
                  
                  {/* Todo indicators */}
                  <div className="space-y-1">
                    {day.todos.slice(0, 2).map(todo => (
                      <div
                        key={todo.id}
                        className={`text-xs px-2 py-1 rounded border truncate ${
                          getPriorityColor(todo.priority)
                        } ${todo.completed ? 'line-through opacity-60' : ''} ${
                          isOverdue(todo) ? 'border-red-500 bg-red-50' : ''
                        }`}
                        title={todo.text}
                      >
                        <div className="flex items-center gap-1">
                          {isOverdue(todo) && <AlertTriangle className="h-3 w-3 text-red-500" />}
                          <span className="truncate">{todo.text}</span>
                        </div>
                      </div>
                    ))}
                    {day.todos.length > 2 && (
                      <div className="text-xs text-gray-500 px-2">
                        +{day.todos.length - 2} more
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Date Panel */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              {selectedDate 
                ? selectedDate.toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })
                : 'Select a date'
              }
            </h3>

            {/* Add Todo Form */}
            {showAddForm && selectedDate && (
              <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                <input
                  type="text"
                  value={newTodoText}
                  onChange={(e) => setNewTodoText(e.target.value)}
                  placeholder="Enter todo text..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                  autoFocus
                />
                <select
                  value={newTodoPriority}
                  onChange={(e) => setNewTodoPriority(e.target.value as 'low' | 'medium' | 'high')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={handleSubmitTodo}
                    disabled={!newTodoText.trim()}
                    className="flex-1 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Add Todo
                  </button>
                  <button
                    onClick={() => {
                      setShowAddForm(false);
                      setNewTodoText('');
                      setNewTodoPriority('medium');
                    }}
                    className="px-3 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Selected Date Todos */}
            {selectedDate && (
              <div className="space-y-3">
                {selectedDateTodos.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <div className="text-sm">No todos for this date</div>
                    <button
                      onClick={() => handleAddTodo(selectedDate)}
                      className="mt-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Add your first todo
                    </button>
                  </div>
                ) : (
                  selectedDateTodos.map(todo => (
                    <div key={todo.id} className="relative">
                      {isOverdue(todo) && (
                        <div className="absolute -left-2 top-0 bottom-0 w-1 bg-red-500 rounded"></div>
                      )}
                      <TodoItem
                        todo={todo}
                        onToggle={onToggleTodo}
                        onDelete={onDeleteTodo}
                        onUpdate={onUpdateTodo}
                      />
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}