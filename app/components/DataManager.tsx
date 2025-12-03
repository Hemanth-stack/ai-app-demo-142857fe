'use client';

import { useState } from 'react';
import { Download, Upload, FileText, Database, AlertTriangle, CheckCircle } from 'lucide-react';
import { Todo } from '../types/todo';
import { Category } from '../types/category';
import { useDataExport } from '../hooks/useDataExport';

interface DataManagerProps {
  todos: Todo[];
  categories: Category[];
  onImportData: (todos: Todo[], categories: Category[]) => void;
}

export default function DataManager({ todos, categories, onImportData }: DataManagerProps) {
  const [importing, setImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });
  
  const { exportToJSON, exportToCSV, importFromJSON } = useDataExport();

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportStatus({ type: null, message: '' });

    try {
      const { todos: importedTodos, categories: importedCategories } = await importFromJSON(file);
      onImportData(importedTodos, importedCategories);
      setImportStatus({
        type: 'success',
        message: `Successfully imported ${importedTodos.length} todos and ${importedCategories.length} categories`
      });
    } catch (error) {
      setImportStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Failed to import data'
      });
    } finally {
      setImporting(false);
      // Reset file input
      e.target.value = '';
    }
  };

  const clearImportStatus = () => {
    setImportStatus({ type: null, message: '' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Database className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Data Management</h2>
      </div>

      {/* Status Messages */}
      {importStatus.type && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          importStatus.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-800' 
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {importStatus.type === 'success' ? (
            <CheckCircle className="h-5 w-5" />
          ) : (
            <AlertTriangle className="h-5 w-5" />
          )}
          <span>{importStatus.message}</span>
          <button
            onClick={clearImportStatus}
            className="ml-auto p-1 hover:bg-black/10 rounded"
          >
            ×
          </button>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Export Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Export Data
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Download your todos and categories as backup files
          </p>
          
          <div className="space-y-3">
            <button
              onClick={() => exportToJSON(todos, categories)}
              disabled={todos.length === 0}
              className="w-full flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-5 w-5 text-blue-600" />
              <div className="text-left">
                <div className="font-medium text-blue-900 dark:text-blue-100">Export as JSON</div>
                <div className="text-sm text-blue-700 dark:text-blue-300">
                  Complete backup with all data
                </div>
              </div>
            </button>

            <button
              onClick={() => exportToCSV(todos)}
              disabled={todos.length === 0}
              className="w-full flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileText className="h-5 w-5 text-green-600" />
              <div className="text-left">
                <div className="font-medium text-green-900 dark:text-green-100">Export as CSV</div>
                <div className="text-sm text-green-700 dark:text-green-300">
                  Spreadsheet format for analysis
                </div>
              </div>
            </button>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 mt-3">
            Current data: {todos.length} todos, {categories.length} categories
          </div>
        </div>

        {/* Import Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            Import Data
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Restore your todos from a previously exported JSON file
          </p>

          <div className="space-y-3">
            <label className="w-full flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors cursor-pointer">
              <Upload className="h-5 w-5 text-purple-600" />
              <div className="text-left flex-1">
                <div className="font-medium text-purple-900 dark:text-purple-100">
                  {importing ? 'Importing...' : 'Choose JSON File'}
                </div>
                <div className="text-sm text-purple-700 dark:text-purple-300">
                  Select a backup file to restore
                </div>
              </div>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                disabled={importing}
                className="hidden"
              />
            </label>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Import Warning
                </span>
              </div>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                Importing will replace all current data. Make sure to export your current 
                todos first if you want to keep them.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Storage Info */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Storage Information
        </h4>
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <div>• Data is stored locally in your browser</div>
          <div>• Regular exports recommended as backup</div>
          <div>• Clearing browser data will remove all todos</div>
        </div>
      </div>
    </div>
  );
}