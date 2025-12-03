'use client';

import TodoForm from './TodoForm';
import TodoFilter from './TodoFilter';
import TodoList from './TodoList';
import SearchBar from './SearchBar';
import ErrorBoundary from './ErrorBoundary';
import ViewToggle from './ViewToggle';
import CalendarView from './CalendarView';
import { useTodos } from '../hooks/useTodos';
import { CheckSquare, AlertCircle } from 'lucide-react';
import { useMemo } from 'react';

export default function Component() {
  const {
    todos,
    filter,
    searchQuery,
    isLoading,
    error,
    todoCount,
    view,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearCompleted,
    toggleAllTodos,
    setFilter,
    setSearchQuery,
    setView,
  } = useTodos();

  const hasActiveTodos = useMemo(() => 
    todoCount.active > 0, 
    [todoCount.active]
  );

  return (
    <ErrorBoundary>
      <main 
        className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4"
        role="main"
      >
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <CheckSquare className="h-10 w-10 text-blue-600" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Todo App
              </h1>
            </div>
            <p className="text-xl text-gray-600">
              Stay organized and get things done
            </p>
            {todoCount.all > 0 && (
              <div className="mt-4 text-sm text-gray-500">
                {todoCount.active} of {todoCount.all} todos remaining
                {todoCount.overdue > 0 && (
                  <span className="ml-2 px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium">
                    {todoCount.overdue} overdue
                  </span>
                )}
              </div>
            )}
          </header>

          {/* Error Alert */}
          {error && (
            <div 
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 max-w-4xl mx-auto"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
              <div>
                <p className="text-red-800 font-medium">Error</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* View Toggle */}
          <div className="max-w-4xl mx-auto">
            <ViewToggle currentView={view} onViewChange={setView} />
          </div>

          {/* Main Content */}
          {view === 'list' ? (
            <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 max-w-4xl mx-auto">
              <TodoForm 
                onAddTodo={addTodo} 
                disabled={isLoading}
              />
              
              <SearchBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
              />
              
              <TodoFilter
                currentFilter={filter}
                onFilterChange={setFilter}
                todoCount={todoCount}
                onClearCompleted={clearCompleted}
                onToggleAll={toggleAllTodos}
                hasActiveTodos={hasActiveTodos}
              />
              
              <div id="todo-list">
                <TodoList
                  todos={todos}
                  onToggleTodo={toggleTodo}
                  onDeleteTodo={deleteTodo}
                  onUpdateTodo={updateTodo}
                  isLoading={isLoading}
                  searchQuery={searchQuery}
                />
              </div>
            </div>
          ) : (
            <CalendarView
              todos={todos}
              onToggleTodo={toggleTodo}
              onDeleteTodo={deleteTodo}
              onUpdateTodo={updateTodo}
              onAddTodo={addTodo}
            />
          )}

          {/* Footer */}
          <footer className="text-center mt-8 text-gray-500 text-sm">
            <p>
              Built with Next.js, TypeScript, and Tailwind CSS
            </p>
          </footer>
        </div>
      </main>
    </ErrorBoundary>
  );
}