'use client';

import { useState } from 'react';
import TodoForm from './TodoForm';
import TodoFilter from './TodoFilter';
import TodoList from './TodoList';
import SearchBar from './SearchBar';
import ErrorBoundary from './ErrorBoundary';
import ViewToggle from './ViewToggle';
import CalendarView from './CalendarView';
import Analytics from './Analytics';
import CategoryManager from './CategoryManager';
import DataManager from './DataManager';
import ThemeToggle from './ThemeToggle';
import { useTodos } from '../hooks/useTodos';
import { useCategories } from '../hooks/useCategories';
import { CheckSquare, AlertCircle, BarChart3, Settings, FolderOpen } from 'lucide-react';
import { useMemo } from 'react';

type ViewType = 'list' | 'calendar' | 'analytics' | 'categories' | 'settings';

export default function Component() {
  const {
    todos,
    filter,
    searchQuery,
    isLoading,
    error,
    todoCount,
    view: todoView,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo,
    clearCompleted,
    toggleAllTodos,
    setFilter,
    setSearchQuery,
    setView: setTodoView,
    importTodos,
  } = useTodos();

  const {
    categories,
    tags,
    addCategory,
    updateCategory,
    deleteCategory,
    addTag,
    deleteTag,
  } = useCategories();

  const [currentView, setCurrentView] = useState<ViewType>('list');

  const hasActiveTodos = useMemo(() => 
    todoCount.active > 0, 
    [todoCount.active]
  );

  const handleImportData = (importedTodos: any[], importedCategories: any[]) => {
    importTodos(importedTodos);
    // Handle category import if needed
  };

  const navigationItems = [
    { key: 'list' as const, label: 'Todos', icon: CheckSquare, count: todoCount.all },
    { key: 'calendar' as const, label: 'Calendar', icon: CheckSquare, count: todoCount.all },
    { key: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
    { key: 'categories' as const, label: 'Categories', icon: FolderOpen, count: categories.length },
    { key: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  return (
    <ErrorBoundary>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <CheckSquare className="h-10 w-10 text-blue-600" />
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  Todo Pro
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Professional productivity suite
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {todoCount.all > 0 && (
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {todoCount.active} of {todoCount.all} remaining
                  {todoCount.overdue > 0 && (
                    <span className="ml-2 px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-xs font-medium">
                      {todoCount.overdue} overdue
                    </span>
                  )}
                </div>
              )}
              <ThemeToggle />
            </div>
          </header>

          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0" />
              <div>
                <p className="text-red-800 dark:text-red-200 font-medium">Error</p>
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="mb-8">
            <div className="flex flex-wrap gap-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.key}
                    onClick={() => setCurrentView(item.key)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      currentView === item.key
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-sm'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                    {item.count !== undefined && (
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        currentView === item.key 
                          ? 'bg-white/20 text-white' 
                          : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </nav>

          {/* Main Content */}
          <div className="space-y-8">
            {currentView === 'analytics' && <Analytics todos={todos} />}
            
            {currentView === 'categories' && (
              <CategoryManager
                categories={categories}
                onAddCategory={addCategory}
                onUpdateCategory={updateCategory}
                onDeleteCategory={deleteCategory}
              />
            )}
            
            {currentView === 'settings' && (
              <DataManager
                todos={todos}
                categories={categories}
                onImportData={handleImportData}
              />
            )}

            {(currentView === 'list' || currentView === 'calendar') && (
              <>
                <ViewToggle 
                  currentView={todoView} 
                  onViewChange={setTodoView} 
                />

                {todoView === 'list' ? (
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8">
                    <TodoForm onAddTodo={addTodo} disabled={isLoading} />
                    <SearchBar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
                    <TodoFilter
                      currentFilter={filter}
                      onFilterChange={setFilter}
                      todoCount={todoCount}
                      onClearCompleted={clearCompleted}
                      onToggleAll={toggleAllTodos}
                      hasActiveTodos={hasActiveTodos}
                    />
                    <TodoList
                      todos={todos}
                      onToggleTodo={toggleTodo}
                      onDeleteTodo={deleteTodo}
                      onUpdateTodo={updateTodo}
                      isLoading={isLoading}
                      searchQuery={searchQuery}
                    />
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
              </>
            )}
          </div>

          {/* Footer */}
          <footer className="text-center mt-12 text-gray-500 dark:text-gray-400 text-sm">
            <p>Built with Next.js, TypeScript, and Tailwind CSS</p>
          </footer>
        </div>
      </main>
    </ErrorBoundary>
  );
}