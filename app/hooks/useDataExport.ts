'use client';

import { Todo } from '../types/todo';
import { Category } from '../types/category';

interface ExportData {
  todos: Todo[];
  categories: Category[];
  exportedAt: string;
  version: string;
}

export function useDataExport() {
  const exportToJSON = (todos: Todo[], categories: Category[] = []) => {
    const exportData: ExportData = {
      todos: todos.map(todo => ({
        ...todo,
        createdAt: todo.createdAt.toISOString(),
        dueDate: todo.dueDate?.toISOString(),
      })) as any,
      categories: categories.map(cat => ({
        ...cat,
        createdAt: cat.createdAt.toISOString(),
      })) as any,
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    downloadFile(dataBlob, `todos-backup-${formatDate(new Date())}.json`);
  };

  const exportToCSV = (todos: Todo[]) => {
    const headers = [
      'ID', 'Text', 'Completed', 'Priority', 'Category ID', 
      'Created At', 'Due Date', 'Tags'
    ];
    
    const csvContent = [
      headers.join(','),
      ...todos.map(todo => [
        todo.id,
        `"${todo.text.replace(/"/g, '""')}"`,
        todo.completed,
        todo.priority || '',
        todo.categoryId || '',
        todo.createdAt.toISOString(),
        todo.dueDate?.toISOString() || '',
        (todo.tags || []).join(';')
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    downloadFile(blob, `todos-export-${formatDate(new Date())}.csv`);
  };

  const importFromJSON = (file: File): Promise<{ todos: Todo[], categories: Category[] }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content) as ExportData;
          
          const todos: Todo[] = data.todos.map(todo => ({
            ...todo,
            createdAt: new Date(todo.createdAt as any),
            dueDate: todo.dueDate ? new Date(todo.dueDate as any) : undefined,
          }));
          
          const categories: Category[] = (data.categories || []).map(cat => ({
            ...cat,
            createdAt: new Date(cat.createdAt as any),
          }));
          
          resolve({ todos, categories });
        } catch (error) {
          reject(new Error('Invalid JSON file format'));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  return {
    exportToJSON,
    exportToCSV,
    importFromJSON,
  };
}